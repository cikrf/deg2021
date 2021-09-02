package com.wavesplatform.voting.contract.validators

import com.wavesplatform.voting.contract.VotingError

object ServerListValidator {
  def containsSenderPubKey(servers: Seq[String], senderPubKey: String): Either[VotingError, Unit] = {
    Either.cond(
      servers.contains(senderPubKey),
      (),
      VotingError.ServersDoNotContainSenderPubKey(senderPubKey)
    )
  }

  def serversNonEmpty(servers: Seq[String]): Either[VotingError, Unit] = {
    Either.cond(
      servers.nonEmpty,
      (),
      VotingError.ServersListIsEmpty
    )
  }
}
