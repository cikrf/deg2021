package com.wavesplatform.voting.contract.creation

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.common.DataEntry.Value.StringValue
import com.wavesplatform.protobuf.service.ContractTransaction
import com.wavesplatform.voting.contract.util.DataEntriesExtension._
import com.wavesplatform.voting.contract._

import scala.collection.Seq

/**
  * Проверки:
  *
  * Проверить что обязательные поля не пустые
  * Проверить, что отправитель указан в ключе SERVERS
  *
  * Запись:
  *
  * Значения ключей bulletinHash, dimension, blindSigModulo, blindSigExponent, dateStart из транзакции сохранить на ключ VOTING_BASE (в соответствующий параметр)
  * Список публичных ключей серверов (SERVERS) сохранить в массиве на ключе SERVERS
  * Ключ участника уполномоченного на загрузку списка избирателей (votersListRegistrators) записать на ключ VOTERS_LIST_REGISTRATOR
  * Ключ участника уполномоченного на отправку транзакции blindSigIssue записать на ключ BLINDSIG_ISSUE_REGISTRATOR
  * Ключ участника уполномоченного на отправку транзакции issueBallots записать на ключ ISSUE_BALLOTS_REGISTRATOR
  * Ключ участника jwtTokenRegistrator записать на ключ JWTTOKEN_REGISTRATOR
  */
object InitiateVotingHandler {

  def handle(tx: ContractTransaction): Either[VotingError, Seq[DataEntry]] = {
    for {
      txParams                 <- Right(tx.params)
      pollId                   <- txParams.extractStringParam(ParamKey.PollId)
      bulletinHash             <- txParams.extractStringParam(ParamKey.BulletinHash)
      dimensionStr             <- txParams.extractStringParam(ParamKey.Dimension)
      dimension                <- parseJson[Vector[Dim]](dimensionStr)
      blindSigModulo           <- txParams.extractBigIntegerParam(ParamKey.BlindSigModulo)
      blindSigExponent         <- txParams.extractBigIntegerParam(ParamKey.BlindSigExponent)
      maybeDateStart           <- txParams.extractOptionalInstantParam(ParamKey.DateStart)
      maybeDateEnd             <- txParams.extractOptionalInstantParam(ParamKey.DateEnd)
      serversJsonStr           <- txParams.extractStringParam(ParamKey.Servers)
      servers                  <- parseJson[Seq[String]](serversJsonStr)
      votersListRegistrator    <- txParams.extractStringParam(ParamKey.VotersListRegistrator)
      issueBallotsRegistrator  <- txParams.extractStringParam(ParamKey.IssueBallotsRegistrator)
      blindSigIssueRegistrator <- txParams.extractStringParam(ParamKey.BlindSigIssueRegistrator)
      jwtTokenRegistrator = txParams.extractOptionalStringParam(ParamKey.JwtTokenRegistrator)
      ballotReceivedCert  = txParams.extractOptionalStringParam(ParamKey.BallotReceivedCert)
      isRevoteBlocked     = txParams.extractOptionalBooleanParam("isRevoteBlocked").getOrElse(true)
    } yield {
      val votingBase = VotingBase(
        pollId = pollId,
        bulletinHash = bulletinHash,
        dimension = dimension,
        blindSigModulo = blindSigModulo,
        blindSigExponent = blindSigExponent,
        dateStart = maybeDateStart,
        dateEnd = maybeDateEnd,
        status = VotingStatus.Active,
        startDateIssueBallots = None,
        stopDateIssueBallots = None,
        isRevoteBlocked = isRevoteBlocked
      )

      Seq(
        votingBase.toDataEntry,
        DataEntry(StateKey.Servers, toJsonStr(servers)),
        DataEntry(StateKey.VotersListRegistrator, StringValue(votersListRegistrator)),
        DataEntry(StateKey.IssueBallotsRegistrator, StringValue(issueBallotsRegistrator)),
        DataEntry(StateKey.BlindSigIssueRegistrator, StringValue(blindSigIssueRegistrator))
      ) ++
        jwtTokenRegistrator.map(t => DataEntry(StateKey.JwtTokenRegistrator, StringValue(t))) ++
        ballotReceivedCert.map(t => DataEntry(StateKey.BallotReceivedCert, StringValue(t)))
    }
  }
}
