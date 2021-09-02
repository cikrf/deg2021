package com.wavesplatform.voting.contract.invocation.handlers

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.{ParamKey, StateKey, VotingError}
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension._
import com.wavesplatform.voting.contract.util.DataEntriesExtension._
import com.wavesplatform.voting.contract.validators.{ServerListValidator, VotingValidators}

import scala.collection.Seq
import scala.concurrent.Future

/**
  * Проверки:
  *
  * Проверить, что отправитель указан в ключе SERVERS
  * Проверить что обязательные поля не пустые
  * Проверить что VOTING_BASE.status равно completed
  *
  * Запись:
  *
  * Сохранить значение results в ключ RESULTS стейта контракта
  */
object ResultsHandler extends CallHandler {

  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse] = {
    stateService.requestContractKeys(contractTransaction, Seq(StateKey.VotingBase, StateKey.Servers).map(_.entryName))
  }

  def call(
    contractTransaction: ContractTransaction,
    contractState: ContractKeysResponse): Either[VotingError, Seq[DataEntry]] = {
    val txParams = contractTransaction.params

    for {
      servers    <- contractState.getServers
      votingBase <- contractState.getVotingBase
      _          <- ServerListValidator.containsSenderPubKey(servers, contractTransaction.senderPublicKey)
      _          <- VotingValidators.validateVotingCompleted(votingBase)
      results    <- txParams.extractStringParam(ParamKey.Results)
    } yield Seq(DataEntry(StateKey.Results, DataEntry.Value.StringValue(results)))
  }

  override def operationName: String = "results"
}
