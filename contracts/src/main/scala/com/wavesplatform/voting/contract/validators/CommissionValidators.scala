package com.wavesplatform.voting.contract.validators

import cats.implicits._
import com.wavesplatform.protobuf.service.ContractKeysResponse
import com.wavesplatform.voting.contract.VotingError
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension._
import org.bouncycastle.util.encoders.Hex

object CommissionValidators {
  def validateCommissionSecretKey(
    commissionSecretKey: Option[String],
    state: ContractKeysResponse): Either[VotingError, Unit] = {
    commissionSecretKey.fold(().asRight[VotingError]) { secretKey =>
      for {
        publicKey <- state.getCommissionKey
        _ <- Either.cond(
          EllipticCurveVerifier.verify(Hex.decode(publicKey), Hex.decode(secretKey)),
          (),
          VotingError.InvalidCommissionSecretKey
        )
      } yield ()
    }
  }
}
