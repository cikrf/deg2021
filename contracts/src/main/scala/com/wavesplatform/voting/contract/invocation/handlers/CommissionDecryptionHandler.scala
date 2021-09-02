package com.wavesplatform.voting.contract.invocation.handlers

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension._
import com.wavesplatform.voting.contract.util.DataEntriesExtension.{DataEntryExtension, _}
import com.wavesplatform.voting.contract.validators.{CommissionValidators, ServerListValidator, VotingValidators}
import com.wavesplatform.voting.contract.{ParamKey, StateKey, VotingError}

import scala.collection.Seq
import scala.concurrent.Future

/**
  * Проверки:
  *
  * Проверить что обязательные поля не пустые
  * Проверить, что отправитель указан в ключе SERVERS
  * Проверить что VOTING_BASE.status равно completed
  * Если приватный ключ commissionSecretKey присутствует, то проверить его на публичном ключе записанном на ключе COMMISSION_KEY контракта
  * Запись:
  *
  * Сохранить id транзакции на ключ COMMISSION_DECRYPTION
  */
object CommissionDecryptionHandler extends CallHandler {

  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse] = {
    stateService.requestContractKeys(
      contractTransaction,
      Seq(StateKey.VotingBase, StateKey.Servers, StateKey.CommissionKey).map(_.entryName)
    )
  }

  override def call(tx: ContractTransaction, state: ContractKeysResponse): Either[VotingError, Seq[DataEntry]] =
    for {
      servers    <- state.getServers
      votingBase <- state.getVotingBase
      commissionSecretKey = tx.params.extractOptionalStringParam(ParamKey.CommissionSecretKey)
      _ <- ServerListValidator.containsSenderPubKey(servers, tx.senderPublicKey)
      _ <- VotingValidators.validateVotingCompleted(votingBase)
      _ <- CommissionValidators.validateCommissionSecretKey(commissionSecretKey, state)
    } yield Seq(DataEntry(StateKey.CommissionDecryption, DataEntry.Value.StringValue(tx.id)))

  override def operationName: String = "commissiondecryption"
}
