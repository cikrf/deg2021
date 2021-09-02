package com.wavesplatform.voting.contract.invocation.handlers

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract._
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.DataEntriesExtension._
import com.wavesplatform.voting.contract.validators.ServerListValidator

import scala.collection.Seq
import scala.concurrent.Future

/**
  * Проверки:
  *
  * Проверить, что отправитель указан в ключе SERVERS
  *
  * Запись:
  *
  * Перезаписать ключ SERVERS списком ключей серверов из транзакции
  */
object UpdateServerListHandler extends CallHandler {

  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse] = {
    VotingStateService.EmptyContractKeysResponse
  }

  override def call(
    contractTransaction: ContractTransaction,
    contractState: ContractKeysResponse): Either[VotingError, Seq[DataEntry]] = {
    for {
      txParams       <- Right(contractTransaction.params)
      serversJsonStr <- txParams.extractStringParam(ParamKey.Servers)
      servers        <- parseJson[Seq[String]](serversJsonStr)
      _              <- ServerListValidator.serversNonEmpty(servers)
      _              <- ServerListValidator.containsSenderPubKey(servers, contractTransaction.senderPublicKey)
    } yield DataEntry(StateKey.Servers, toJsonStr(servers)) :: Nil
  }

  override def operationName: String = "updateserverlist"
}
