package com.wavesplatform.voting.contract.invocation.handlers

import cats.syntax.either.catsSyntaxEither
import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.VotingError._
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension._
import com.wavesplatform.voting.contract.util.DataEntriesExtension._
import com.wavesplatform.voting.contract.validators.BlindSignatureVerifier.BlindSigPublicKey
import com.wavesplatform.voting.contract.validators.{BlindSignatureVerifier, VotingValidators}
import com.wavesplatform.voting.contract.{VotingError, _}

import java.math.BigInteger
import scala.collection.Seq
import scala.concurrent.Future

/**
  * Проверки:
  *
  * Если флаг isRevoteBlocked = True, проверить что ключ VOTE_<publicKey> НЕ существует (голос прилетел впервые)
  * Если на стейте контракта уже есть ключ VOTE_<publicKey>, проверить что VOTE_<publicKey>.blindSig на стейте совпадает с blindSig транзакции
  * Проверить что обязательные поля не пустые
  * Проверить корректность слепой подписи
  * Проверить что VOTING_BASE.dateStart раньше текущего времени (UTC по часам смарт-контракта) и VOTING_BASE.status равно active
  *
  * Запись:
  *
  * Сохранить id транзакции на ключ VOTE_<publicKey>.vote, ключ blindSig транзакции на ключ VOTE_<publicKey>.blindSig
  * Если смарт-контракт отклоняет транзакцию, сохранить на ключ FAIL_<senderAddress>_<txId>_vote публичный ключ отправителя и причину отклонения транзакции
  */
object VoteHandler extends CallHandler {

  val KeySize = 4096

  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService
  ): Future[ContractKeysResponse] = {
    stateService.requestContractKeys(
      contractTransaction,
      Seq(StateKey.VotingBase, StateKey.Servers, StateKey.Vote(contractTransaction.senderPublicKey)).map(_.entryName)
    )
  }

  override def call(
    contractTransaction: ContractTransaction,
    contractState: ContractKeysResponse
  ): Either[VotingError, Seq[DataEntry]] = {
    val senderPK = contractTransaction.senderPublicKey
    (for {
      votingBase  <- contractState.getVotingBase
      _           <- checkRevote(senderPK, contractState, votingBase)
      _           <- VotingValidators.validateVotingIsInProgress(votingBase, operationName)
      voteWrapper <- handleVote(contractState, votingBase, contractTransaction)
      result = Seq(voteWrapper.toDataEntry(senderPK))
    } yield result).recover(recoverOnFail(contractTransaction))
  }

  private def checkRevote(
    senderPublicKey: String,
    contractState: ContractKeysResponse,
    votingBase: VotingBase
  ): Either[VotingError, Unit] =
    Either.cond(
      !votingBase.isRevoteBlocked || !contractState.entries.exists(_.key == s"VOTE_$senderPublicKey"),
      (),
      VotingError.RevoteIsBlockedError
    )

  private def recoverOnFail(tx: ContractTransaction): PartialFunction[VotingError, Seq[DataEntry]] = {
    case e: VotingError =>
      val failReason = FailReason(e.errorMessage, tx.senderPublicKey)
      Seq(DataEntry(StateKey.VoteFail(tx.sender, tx.id), toJsonStr(failReason)))
  }

  private def handleVote(
    contractState: ContractKeysResponse,
    votingBase: VotingBase,
    contractTransaction: ContractTransaction
  ): Either[VotingError, VoteWrapper] = {
    val senderPK = contractTransaction.senderPublicKey
    for {
      blindSig <- contractTransaction.params.extractBigIntegerParam(ParamKey.BlindSig)
      voteOpt  <- contractState.getVote(senderPK)
      isNew = voteOpt.isEmpty
      _ <- if (isNew) {
        validateBlindSignature(blindSig, votingBase, senderPK)
      } else {
        Either.cond(voteOpt.exists(_.blindSig == blindSig), (), BlindSigIsNotEqual(voteOpt.get.blindSig, blindSig))
      }
    } yield VoteWrapper(contractTransaction.id, blindSig)
  }

  private def validateBlindSignature(
    blindSig: BigInteger,
    votingBase: VotingBase,
    senderPublicKey: String
  ): Either[VotingError, Unit] = {
    val publicKey = BlindSigPublicKey(votingBase.blindSigModulo, votingBase.blindSigExponent)
    Either
      .cond(BlindSignatureVerifier.verify(blindSig, publicKey, senderPublicKey, KeySize), (), InvalidBlindSig(blindSig))
  }

  override def operationName: String = "vote"
}
