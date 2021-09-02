package com.wavesplatform.voting.contract.validators

import java.math.BigInteger
import java.nio.charset.StandardCharsets.UTF_8
import java.security.interfaces.RSAPublicKey

import org.bouncycastle.crypto.digests.GOST3411_2012_256Digest
import org.bouncycastle.util.encoders.Hex

import scala.annotation.tailrec
import scala.collection.mutable.ArrayBuffer

object BlindSignatureVerifier {

  case class BlindSigPublicKey(modulo: BigInteger, exp: BigInteger)

  object BlindSigPublicKey {
    def apply(pk: RSAPublicKey): BlindSigPublicKey = new BlindSigPublicKey(pk.getModulus, pk.getPublicExponent)
  }

  def verify(signature: BigInteger, publicKey: BlindSigPublicKey, message: String, hashSize: Int): Boolean = {
    val result = signature.modPow(publicKey.exp, publicKey.modulo)
    val padded = fdh(message.getBytes(UTF_8), publicKey.modulo, hashSize)
    result == padded
  }

  def fdh(message: Array[Byte], modulo: BigInteger, hashSize: Int): BigInteger = {
    if (hashSize % 256 != 0) {
      throw new RuntimeException("Supported only lengths divisible by 256")
    }

    val moduloBytes = modulo.toByteArray.drop(1)
    if (moduloBytes(0) % 128 == 0) {
      throw new RuntimeException("Modulo significant bit must be 1")
    }

    val byteList         = ArrayBuffer[Byte]()
    val moduloFirstBlock = moduloBytes.slice(0, 32)

    @tailrec
    def fillFirstBlock(iv: Int): Int = {
      val h = hash(message, moduloBytes, iv, "01")
      if (compareBytes(moduloFirstBlock, h, 0)) {
        byteList ++= h
        iv + 1
      } else
        fillFirstBlock(iv + 1)
    }
    val iv = fillFirstBlock(0)

    val blockCount = hashSize / 256
    (0 until blockCount - 1).foreach { i =>
      val h = hash(message, moduloBytes, iv + i, "00")
      byteList ++= h
    }

    new BigInteger(1, byteList.toArray)
  }

  private def hash(message: Array[Byte], moduloBytes: Array[Byte], iv: Int, postfix: String): Array[Byte] = {
    val d = new GOST3411_2012_256Digest()
    update(d, message)
    update(d, moduloBytes)
    update(d, Hex.decode(postfix))
    update(d, Array(iv.toByte))
    val hash = Array.ofDim[Byte](32)
    d.doFinal(hash, 0)
    hash
  }

  private def update(digest: GOST3411_2012_256Digest, bytes: Array[Byte]): Unit =
    digest.update(bytes, 0, bytes.length)

  @tailrec
  private def compareBytes(a: Array[Byte], b: Array[Byte], i: Int): Boolean =
    if (i >= a.length)
      false
    else if (i >= b.length)
      true
    else if (a(i) == b(i))
      compareBytes(a, b, i + 1)
    else
      (a(i) & 0xFF) > (b(i) & 0xFF)
}
