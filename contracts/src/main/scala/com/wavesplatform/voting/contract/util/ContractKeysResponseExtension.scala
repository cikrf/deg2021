package com.wavesplatform.voting.contract.util

import com.wavesplatform.protobuf.service.ContractKeysResponse
import com.wavesplatform.voting.contract.util.DataEntriesExtension._
import com.wavesplatform.voting.contract.{parseJson, StateKey, VoteWrapper, VotingBase, VotingError}

import scala.collection.Seq

object ContractKeysResponseExtension {

  implicit class ContractKeysResponseParser(val value: ContractKeysResponse) extends AnyVal {

    def getVotingBase: Either[VotingError, VotingBase] = {
      for {
        votingBaseJsonStr <- value.entries.extractStringParam(StateKey.VotingBase.entryName)
        votingBase        <- parseJson[VotingBase](votingBaseJsonStr)
      } yield votingBase
    }

    def getServers: Either[VotingError, Seq[String]] = {
      for {
        serversListStr <- value.entries.extractStringParam(StateKey.Servers.entryName)
        serversList    <- parseJson[Seq[String]](serversListStr)
      } yield serversList
    }

    def getVote(publicKey: String): Either[VotingError, Option[VoteWrapper]] = {
      val voteWrapperOpt = value.entries.extractOptionalStringParam(StateKey.Vote(publicKey).entryName)
      voteWrapperOpt match {
        case Some(value) => parseJson[VoteWrapper](value).map(Some(_))
        case None        => Right(None)
      }
    }

    def getVotersListRegistrator: Either[VotingError, String] = {
      value.entries.extractStringParam(StateKey.VotersListRegistrator.entryName)
    }

    def getIssueBallotsRegistrator: Either[VotingError, String] = {
      value.entries.extractStringParam(StateKey.IssueBallotsRegistrator.entryName)
    }

    def getBlindSigIssueRegistrator: Either[VotingError, String] = {
      value.entries.extractStringParam(StateKey.BlindSigIssueRegistrator.entryName)
    }

    def getCommissionKey: Either[VotingError, String] = {
      value.entries.extractStringParam(StateKey.CommissionKey.entryName)
    }
  }
}
