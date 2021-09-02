package com.wavesplatform.voting.contract.invocation.handlers

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.{StateKey, VotingError}
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension._
import com.wavesplatform.voting.contract.util.DataEntriesExtension.DataEntryExtension
import com.wavesplatform.voting.contract.validators.{ServerListValidator, VotingValidators}

import scala.collection.Seq
import scala.concurrent.Future

/**
  * Проверки:
  *
  * Проверить что обязательные поля не пустые
  * Проверить, что отправитель указан в ключе SERVERS
  * Проверить что VOTING_BASE.status равно completed
  *
  * Запись:
  *
  * Сохранить id транзакции на ключ DECRYPTION_<publicKey>
  */
object DecryptionHandler extends CallHandler {

  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse] = {
    stateService.requestContractKeys(contractTransaction, Seq(StateKey.Servers, StateKey.VotingBase).map(_.entryName))
  }

  def call(
    contractTransaction: ContractTransaction,
    contractState: ContractKeysResponse): Either[VotingError, Seq[DataEntry]] = {
    for {
      servers    <- contractState.getServers
      votingBase <- contractState.getVotingBase
      _          <- ServerListValidator.containsSenderPubKey(servers, contractTransaction.senderPublicKey)
      _          <- VotingValidators.validateVotingCompleted(votingBase)
    } yield Seq(
      DataEntry(
        StateKey.Decryption(contractTransaction.senderPublicKey),
        DataEntry.Value.StringValue(contractTransaction.id)))
  }

  override def operationName: String = "decryption"
}
