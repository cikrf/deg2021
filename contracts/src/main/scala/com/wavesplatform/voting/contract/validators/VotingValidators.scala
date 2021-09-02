package com.wavesplatform.voting.contract.validators

import java.time.Instant

import com.wavesplatform.voting.contract.{VotingBase, VotingError, VotingStatus}

object VotingValidators {
  def validateStartDateNotInState(voting: VotingBase): Either[VotingError, Unit] =
    voting.dateStart.fold[Either[VotingError, Unit]](Right(()))(_ => Left(VotingError.StartDateAlreadyInStateError))

  def validateStartDateInState(votingBase: VotingBase, operation: String): Either[VotingError, Instant] = {
    votingBase.dateStart.fold[Either[VotingError, Instant]](Left(VotingError.EmptyStartDateError(operation)))(Right(_))
  }

  def validateVotingIsInProgress(votingBase: VotingBase, operation: String): Either[VotingError, VotingBase] = {
    for {
      _ <- votingBase.dateStart.fold[Either[VotingError, Unit]](Left(VotingError.EmptyStartDateError(operation))) {
        dateStart => Either.cond(dateStart.isBefore(Instant.now()), (), VotingError.StartDateHasNotComeYet(dateStart))
      }
      _ <- Either.cond(votingBase.status == VotingStatus.Active, (), VotingError.VotingIsNotInProgress)
    } yield votingBase
  }

  def validateVotingNotStarted(votingBase: VotingBase): Either[VotingError, Unit] = {
    for {
      _ <- Either.cond(votingBase.status == VotingStatus.Active, (), VotingError.VotingIsNotInProgress)
      _ <- Either.cond(votingBase.dateStart.forall(_.isAfter(Instant.now())), (), VotingError.VotingAlreadyStarted)
    } yield ()
  }

  def validateVotingCompleted(votingBase: VotingBase): Either[VotingError, Unit] = {
    Either.cond(votingBase.status == VotingStatus.Completed, (), VotingError.VotingIsNotYetFinished)
  }

  def validateSenderCanAddVoters(votersListRegistrator: String, senderPubKey: String): Either[VotingError, Unit] = {
    Either.cond(
      votersListRegistrator == senderPubKey,
      (),
      VotingError.SenderIsNotVotingRegistrator(senderPubKey)
    )
  }

  def validateSenderCanHandleIssueBallots(
    issueBallotsRegistrator: String,
    senderPubKey: String): Either[VotingError, Unit] = {
    Either.cond(
      issueBallotsRegistrator == senderPubKey,
      (),
      VotingError.SenderIsNotIssueBallotsRegistrator(senderPubKey)
    )
  }

  def validateSenderIsBlindSigIssueRegistrator(
    blindSigIssueRegistrator: String,
    senderPubKey: String): Either[VotingError, Unit] = {
    Either.cond(
      blindSigIssueRegistrator == senderPubKey,
      (),
      VotingError.SenderIsNotBlindSigIssueRegistrator(senderPubKey)
    )
  }

  def validateIssueBallotsIsNotStarted(votingBase: VotingBase): Either[VotingError, Unit] = {
    votingBase.startDateIssueBallots
      .toLeft(())
      .left
      .map(VotingError.IssueBallotsAlreadyStarted)
  }

  def validateIssueBallotsIsNotStopped(votingBase: VotingBase): Either[VotingError, Unit] = {
    votingBase.stopDateIssueBallots
      .toLeft(())
      .left
      .map(VotingError.IssueBallotsAlreadyStopped)
  }
}
