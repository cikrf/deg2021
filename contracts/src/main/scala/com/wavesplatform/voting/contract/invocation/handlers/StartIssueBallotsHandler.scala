package com.wavesplatform.voting.contract.invocation.handlers

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension.ContractKeysResponseParser
import com.wavesplatform.voting.contract.util.DataEntriesExtension.DataEntriesExtensionMethods
import com.wavesplatform.voting.contract.validators.VotingValidators
import com.wavesplatform.voting.contract.{ParamKey, StateKey, VotingError}

import scala.collection.Seq
import scala.concurrent.Future

/**
  * Проверки:
  *
  * Отправитель указан в ключе ISSUE_BALLOTS_REGISTRATOR
  * Параметр startDateIssueBallots не заполнен на ключе VOTING_BASE
  *
  * Запись:
  *
  * Сохранить переданное время на ключ VOTING_BASE в соответствующий параметр startDateIssueBallots в UTC формате
  */
object StartIssueBallotsHandler extends CallHandler {
  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse] = {
    stateService.requestContractKeys(
      contractTransaction,
      Seq(StateKey.VotingBase.entryName, StateKey.IssueBallotsRegistrator.entryName)
    )
  }

  override def call(tx: ContractTransaction, state: ContractKeysResponse): Either[VotingError, Seq[DataEntry]] = {
    for {
      issueBallotsRegistrator <- state.getIssueBallotsRegistrator
      votingBase              <- state.getVotingBase
      _                       <- VotingValidators.validateSenderCanHandleIssueBallots(issueBallotsRegistrator, tx.senderPublicKey)
      _                       <- VotingValidators.validateIssueBallotsIsNotStarted(votingBase)
      startDateIssueBallots   <- tx.params.extractOptionalInstantParam(ParamKey.StartDateIssueBallots)
    } yield Seq(votingBase.copy(startDateIssueBallots = startDateIssueBallots).toDataEntry)
  }

  override def operationName: String = "startissueballots"
}
