package com.wavesplatform.voting.contract.validators

import java.math.BigInteger
import java.security.Security
import java.util

import org.bouncycastle.jce.ECNamedCurveTable
import org.bouncycastle.jce.provider.BouncyCastleProvider
import org.bouncycastle.jce.spec.ECNamedCurveParameterSpec

object EllipticCurveVerifier {
  Security.addProvider(new BouncyCastleProvider)
  private val ecSpec: ECNamedCurveParameterSpec = ECNamedCurveTable.getParameterSpec("GostR3410-2001-CryptoPro-A")

  def verify(publicKey: Array[Byte], privateKey: Array[Byte]): Boolean = {
    val resolvedPublicKey = ecSpec.getG.multiply(new BigInteger(1, privateKey)).getEncoded(true)
    util.Arrays.equals(resolvedPublicKey, publicKey)
  }
}
