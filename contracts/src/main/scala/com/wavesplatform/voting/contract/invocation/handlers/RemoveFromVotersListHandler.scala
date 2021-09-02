package com.wavesplatform.voting.contract.invocation.handlers

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension.ContractKeysResponseParser
import com.wavesplatform.voting.contract.util.DataEntriesExtension.{DataEntriesExtensionMethods, DataEntryExtension}
import com.wavesplatform.voting.contract.validators.VotingValidators
import com.wavesplatform.voting.contract.{parseJson, toJsonStr, ParamKey, StateKey, VotingError}

import scala.collection.Seq
import scala.concurrent.Future

/**
  * Проверки:
  *
  * Обязательные поля не пустые
  * Отправитель указан в ключе VOTERS_LIST_REGISTRATOR
  *
  * Запись:
  *
  * Значение userIdHashes на ключ VOTERS_LIST_REMOVE_<txId>
  */
object RemoveFromVotersListHandler extends CallHandler {
  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse] = {
    stateService.requestContractKeys(contractTransaction, Seq(StateKey.VotersListRegistrator.entryName))
  }

  override def call(tx: ContractTransaction, state: ContractKeysResponse): Either[VotingError, Seq[DataEntry]] = {
    val txParams = tx.params
    for {
      votersListRegistrator <- state.getVotersListRegistrator
      _                     <- VotingValidators.validateSenderCanAddVoters(votersListRegistrator, tx.senderPublicKey)
      userIdHashesStr       <- txParams.extractStringParam(ParamKey.UserIdHashes)
      userIdHashes          <- parseJson[Seq[String]](userIdHashesStr)
    } yield DataEntry(StateKey.VotersListRemove(tx.id), toJsonStr(userIdHashes)) :: Nil
  }

  override def operationName: String = "removefromvoterslist"
}
