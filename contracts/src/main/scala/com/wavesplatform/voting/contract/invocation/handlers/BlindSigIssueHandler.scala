package com.wavesplatform.voting.contract.invocation.handlers

import cats.syntax.either.catsSyntaxEither
import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.common.DataEntry.Value.StringValue
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension._
import com.wavesplatform.voting.contract.util.DataEntriesExtension._
import com.wavesplatform.voting.contract.validators.VotingValidators
import com.wavesplatform.voting.contract.{VotingError, _}
import play.api.libs.json.{Format, Json}

import scala.collection.Seq
import scala.concurrent.Future

/**
  * Проверки:
  *
  * Проверить что VOTING_BASE.dateStart раньше текущего времени (UTC по часам смарт-контракта) и VOTING_BASE.status равно active
  * Проверить, что отправитель указан в ключе BLINDSIG_ISSUE_REGISTRATOR
  *
  * Запись:
  *
  * Для каждого значения из массива userId сохранить ключ BLINDSIG_<txId> = [{ /"userId/": /"userId1/", /"maskedSig/": /"maskedSig1/"}, ...]
  * Если смарт-контракт отклоняет транзакцию, сохранить на ключ FAIL_<txId>_blindSig причину отклонения транзакции
  */
object BlindSigIssueHandler extends CallHandler {

  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse] = {
    stateService.requestContractKeys(
      contractTransaction,
      Seq(StateKey.VotingBase.entryName, StateKey.BlindSigIssueRegistrator.entryName)
    )
  }

  override def call(tx: ContractTransaction, state: ContractKeysResponse): Either[VotingError, Seq[DataEntry]] = {
    val txParams = tx.params
    (for {
      votingBase               <- state.getVotingBase
      _                        <- VotingValidators.validateVotingIsInProgress(votingBase, operationName)
      blindSigIssueRegistrator <- state.getBlindSigIssueRegistrator
      _                        <- VotingValidators.validateSenderIsBlindSigIssueRegistrator(blindSigIssueRegistrator, tx.senderPublicKey)
      userIdStr                <- txParams.extractStringParam(ParamKey.Data)
      userMaskedSigs           <- parseJson[Vector[UserIdMaskedSig]](userIdStr)
      result = DataEntry(StateKey.BlindSig(tx.id), toJsonStr(userMaskedSigs)) :: Nil
    } yield result).recover(recoverOnFail(tx))
  }

  private def recoverOnFail(tx: ContractTransaction): PartialFunction[VotingError, Seq[DataEntry]] = {
    case e: VotingError => Seq(DataEntry(StateKey.BlindSigFail(tx.id), StringValue(e.errorMessage)))
  }

  override def operationName: String = "blindsigissue"
}

case class UserIdMaskedSig(userId: String, maskedSig: String)
object UserIdMaskedSig {
  implicit val format: Format[UserIdMaskedSig] = Json.format[UserIdMaskedSig]
}
