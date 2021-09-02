package com.wavesplatform.voting.contract.util

import java.math.BigInteger
import java.nio.charset.StandardCharsets.UTF_8
import java.security.interfaces.{RSAPrivateKey, RSAPublicKey}
import java.security.{KeyPair, KeyPairGenerator, SecureRandom}

import com.wavesplatform.voting.contract.invocation.handlers.VoteHandler
import com.wavesplatform.voting.contract.validators.BlindSignatureVerifier

object TestKeysGenerator {

  private[this] val KeySize = VoteHandler.KeySize
  private[this] val KeyGen  = KeyPairGenerator.getInstance("RSA")
  private[this] val Random  = SecureRandom.getInstance("SHA1PRNG")

  KeyGen.initialize(KeySize, Random)

  def generateKeys(): KeyPair = {
    val keyPair     = KeyGen.generateKeyPair()
    val moduloBytes = keyPair.getPublic.asInstanceOf[RSAPublicKey].getModulus.toByteArray
    if (moduloBytes(1) % 128 == 0)
      generateKeys()
    else
      keyPair
  }

  def makeBlindSignature(keyPair: KeyPair, message: String): BigInteger = {
    val publicKey  = keyPair.getPublic.asInstanceOf[RSAPublicKey]
    val privateKey = keyPair.getPrivate.asInstanceOf[RSAPrivateKey]

    val modulo             = publicKey.getModulus
    val exponent           = publicKey.getPublicExponent
    val privateKeyExponent = privateKey.getPrivateExponent
    val r                  = new BigInteger(modulo.bitLength() - 1, Random)

    makeBlindSignature(modulo, exponent, privateKeyExponent, r, message)
  }

  def makeBlindSignature(
    modulo: BigInteger,
    exponent: BigInteger,
    privateKeyExponent: BigInteger,
    r: BigInteger,
    message: String): BigInteger = {
    val paddedMessage   = BlindSignatureVerifier.fdh(message.getBytes(UTF_8), modulo, KeySize)
    val maskedMessage   = paddedMessage.multiply(r.modPow(exponent, modulo)).mod(modulo)
    val maskedSignature = maskedMessage.modPow(privateKeyExponent, modulo)

    maskedSignature.multiply(r.modInverse(modulo)).mod(modulo)
  }
}
