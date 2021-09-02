package com.wavesplatform.voting.contract

import com.wavesplatform.voting.contract.util.InstantUtil

import java.math.BigInteger
import java.time.Instant
import java.time.temporal.ChronoUnit

sealed trait VotingError {
  def errorMessage: String
}

object VotingError {

  final case class GenericVotingError(errorMessage: String) extends VotingError

  final case class RequiredParamIsMissing(param: String) extends VotingError {
    override def errorMessage: String = s"Parameter '$param' is missing"
  }

  final case class RequiredParamValueMissing(param: String) extends VotingError {
    override def errorMessage: String = s"Parameter '$param' is present, but value is None"
  }

  final case class WrongDateFormat(actual: String, exceptionMessage: String) extends VotingError {
    override def errorMessage: String =
      s"Wrong date format. Expected: '${InstantUtil.DateFormatPattern}'. Actual: '$actual'. Exception message: '$exceptionMessage'"
  }

  final case class StartDateHasNotComeYet(startDate: Instant) extends VotingError {
    override def errorMessage: String = s"Start date '${startDate.truncatedTo(ChronoUnit.SECONDS)}' has not come yet"
  }

  final case class EmptyStartDateError(operation: String) extends VotingError {
    override def errorMessage: String = s"Start date must be in state before operation '$operation' starts"
  }

  final case object StartDateAlreadyInStateError extends VotingError {
    override def errorMessage: String = "Start date already in state"
  }

  final case class WrongCallOperationError(op: String) extends VotingError {
    override def errorMessage: String = s"Wrong call contract operation '$op'"
  }

  final object EmptyTransactionField extends VotingError {
    override def errorMessage: String = "Empty transaction field"
  }

  final case class NoResponse(reason: String) extends VotingError {
    override def errorMessage: String = s"State request failed, reason: '$reason'"
  }

  final case class ServerIndexesAreNotSequential(indexes: Seq[Int]) extends VotingError {
    override def errorMessage: String =
      s"Server indexes are not sequential or don't start from 1: [${indexes.mkString(", ")}]"
  }

  final case object ServersListIsEmpty extends VotingError {
    override def errorMessage: String = "Servers list is empty"
  }

  final case class ParseError(message: String) extends VotingError {
    override def errorMessage: String = s"Parsing error: '$message'"
  }

  final object VotingAlreadyStarted extends VotingError {
    override def errorMessage: String = s"Voting has already started"
  }

  final object VotingIsNotInProgress extends VotingError {
    override def errorMessage: String = s"Voting is not in progress (has already finished or not yet started)"
  }

  final object VotingIsNotYetFinished extends VotingError {
    override def errorMessage: String = s"Voting is not yet finished (is in progress or not yet started)"
  }

  final case class ServersDoNotContainSenderPubKey(senderPubKey: String) extends VotingError {
    override def errorMessage: String =
      s"Couldn't find the server that contains sender public key '$senderPubKey'"
  }

  final object NoServersWithComplaints extends VotingError {
    override def errorMessage: String = "There are no servers with complaints"
  }

  final case class SenderCantVote(senderPubKey: String) extends VotingError {
    override def errorMessage: String = s"Transaction sender '$senderPubKey' does not have rights to vote"
  }

  final case class WrongRound(round: Long, expectedRound: Long) extends VotingError {
    override def errorMessage: String =
      s"Server has voted in the wrong round. Round from transaction '$round', expected round '$expectedRound'"
  }

  final object NotAllServersHavePublishedCommits extends VotingError {
    override def errorMessage: String = "Not all servers have published dkgCommits"
  }

  final object NotAllServersHavePublishedScalar extends VotingError {
    override def errorMessage: String = "Not all server have published dkgScalar"
  }

  final case class ComplaintTransactionDoesNotExist(transactionId: String) extends VotingError {
    override def errorMessage: String = s"Complaint transaction '$transactionId' does not exist"
  }

  final object ServersNotOnTheSameRound extends VotingError {
    override def errorMessage: String = "Servers are not on the same round"
  }

  final object SomeServersHaveComplaints extends VotingError {
    override def errorMessage: String = "Some servers have complaints"
  }

  final case class UpdateRoundError(newValue: Long, oldValue: Long) extends VotingError {
    override def errorMessage: String =
      s"Specified round value '$newValue' is less than old value '$oldValue' in VOTING_BASE.dkgRound"
  }

  final case class UnknownEnumParamValue(param: String, value: String) extends VotingError {
    override def errorMessage: String = s"Unknown '$param' parameter value '$value'"
  }

  final case class BlindSigIsNotEqual(oldValue: BigInteger, newValue: BigInteger) extends VotingError {
    override def errorMessage: String =
      s"Existing 'blindSig' value '${oldValue.toString(16)}' is not equal to new value '${newValue.toString(16)}'"
  }

  final case class InvalidBlindSig(blindSig: BigInteger) extends VotingError {
    override def errorMessage: String = s"Verification failed for blind signature '${blindSig.toString(16)}'"
  }

  final case class SenderIsNotVotingRegistrator(senderPubKey: String) extends VotingError {
    override def errorMessage: String = s"Sender public key '$senderPubKey' is not the voting registrator"
  }

  final case class SenderIsNotIssueBallotsRegistrator(senderPubKey: String) extends VotingError {
    override def errorMessage: String = s"Sender public key '$senderPubKey' is not the issue ballots registrator"
  }

  final case class SenderIsNotBlindSigIssueRegistrator(senderPubKey: String) extends VotingError {
    override def errorMessage: String = s"Sender public key '$senderPubKey' is not the blind sig issue registrator"
  }

  final case class IssueBallotsAlreadyStarted(time: Instant) extends VotingError {
    override def errorMessage: String = s"Issue ballots are already started at $time"
  }

  final case class IssueBallotsAlreadyStopped(time: Instant) extends VotingError {
    override def errorMessage: String = s"Issue ballots are already stopped at $time"
  }

  case object RevoteIsBlockedError extends VotingError {
    override def errorMessage: String = "Revote is blocked"
  }

  case object InvalidCommissionSecretKey extends VotingError {
    override def errorMessage: String = "Commission secret key doesn't match with the commission key from the state"
  }
}
