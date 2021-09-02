package com.wavesplatform.voting.contract.invocation.handlers

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service._
import com.wavesplatform.voting.contract.{ParamKey, StateKey, VotingError}
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension._
import com.wavesplatform.voting.contract.util.DataEntriesExtension._
import com.wavesplatform.voting.contract.validators.{ServerListValidator, VotingValidators}

import scala.concurrent.Future

/**
  * Проверки:
  *
  * Проверить что отправитель указан в ключе SERVER
  * Проверить что обязательные поля не пустые
  * Проверить что VOTING_BASE.dateStart позже текущего времени (UTC по часам смарт-контракта) или dateStart не заполнено и VOTING_BASE.status равно active
  *
  * Запись:
  *
  * Сохранить значение mainKey в ключ MAIN_KEY стейта контракта
  * Сохранить значение commissionKey в ключ COMMISSION_KEY стейта контракта
  * Сохранить значение dkgKey в ключ DKG_KEY стейта контракта
  */
object AddMainKeyHandler extends CallHandler {

  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse] = {
    stateService.requestContractKeys(contractTransaction, Seq(StateKey.VotingBase, StateKey.Servers).map(_.entryName))
  }

  def call(
    contractTransaction: ContractTransaction,
    contractState: ContractKeysResponse): Either[VotingError, Seq[DataEntry]] = {
    for {
      txParams   <- Right(contractTransaction.params)
      votingBase <- contractState.getVotingBase
      _          <- VotingValidators.validateVotingNotStarted(votingBase)
      servers    <- contractState.getServers
      _          <- ServerListValidator.containsSenderPubKey(servers, contractTransaction.senderPublicKey)
      mainKey    <- txParams.extractStringParam(ParamKey.MainKey)
      commKey    <- txParams.extractStringParam(ParamKey.CommissionKey)
      dkgKey     <- txParams.extractStringParam(ParamKey.DkgKey)
    } yield Seq(
      DataEntry(StateKey.MainKey, DataEntry.Value.StringValue(mainKey)),
      DataEntry(StateKey.CommissionKey, DataEntry.Value.StringValue(commKey)),
      DataEntry(StateKey.DKGKey, DataEntry.Value.StringValue(dkgKey))
    )
  }

  override def operationName: String = "addmainkey"
}
