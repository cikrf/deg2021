package com.wavesplatform.voting.contract

import enumeratum.EnumEntry
import enumeratum.EnumEntry.UpperSnakecase

import scala.collection.immutable

sealed trait StateKey extends EnumEntry with UpperSnakecase

object StateKey extends enumeratum.Enum[StateKey] {
  override def values: immutable.IndexedSeq[StateKey] = findValues

  case object CommissionKey        extends StateKey
  case object CommissionDecryption extends StateKey
  case object DKGKey               extends StateKey
  case object MainKey              extends StateKey
  case object Results              extends StateKey
  case object Servers              extends StateKey
  case object VotingBase           extends StateKey

  case object VotersListRegistrator extends StateKey {
    override def entryName: String = s"VOTERS_LIST_REGISTRATOR"
  }

  case class BlindSig(transactionId: String) extends StateKey {
    override def entryName: String = s"BLINDSIG_$transactionId"
  }

  case class BlindSigFail(transactionId: String) extends StateKey {
    override def entryName: String = s"FAIL_${transactionId}_blindSig"
  }

  case class Decryption(publicKey: String) extends StateKey {
    override def entryName: String = s"DECRYPTION_$publicKey"
  }

  case class Vote(publicKey: String) extends StateKey {
    override def entryName: String = s"VOTE_$publicKey"
  }

  case class VoteFail(senderAddress: String, transactionId: String) extends StateKey {
    override def entryName: String = s"FAIL_${senderAddress}_${transactionId}_vote"
  }

  case class VotersList(transactionId: String) extends StateKey {
    override def entryName: String = s"VOTERS_LIST_$transactionId"
  }

  case class VotersListRemove(transactionId: String) extends StateKey {
    override def entryName: String = s"VOTERS_LIST_REMOVE_$transactionId"
  }

  case class VotersListAdd(transactionId: String) extends StateKey {
    override def entryName: String = s"VOTERS_LIST_ADD_$transactionId"
  }

  case object IssueBallotsRegistrator extends StateKey {
    override def entryName: String = s"ISSUE_BALLOTS_REGISTRATOR"
  }

  case object BlindSigIssueRegistrator extends StateKey {
    override def entryName: String = s"BLINDSIG_ISSUE_REGISTRATOR"
  }

  case object JwtTokenRegistrator extends StateKey {
    override def entryName: String = s"JWTTOKEN_REGISTRATOR"
  }

  case object BallotReceivedCert extends StateKey {
    override def entryName: String = s"BALLOT_RECEIVED_CERT"
  }
}
