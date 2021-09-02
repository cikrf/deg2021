package com.wavesplatform.voting.contract.invocation

import com.typesafe.scalalogging.Logger
import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service._
import com.wavesplatform.voting.contract._
import com.wavesplatform.voting.contract.invocation.handlers._
import com.wavesplatform.voting.contract.util.DataEntriesExtension._

import scala.concurrent.{ExecutionContext, Future}

trait CallHandler {

  def operationName: String

  def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse]

  def call(
    contractTransaction: ContractTransaction,
    contractState: ContractKeysResponse): Either[VotingError, Seq[DataEntry]]
}

class VotingInvocationHandler(val client: ContractServiceClient, val transactionService: TransactionServiceClient)(
  implicit val ec: ExecutionContext) {

  private val logger = Logger("voting-invocation")

  private val simpleOperationHandlers: Map[String, CallHandler] = Map(
    VoteHandler.operationName                 -> VoteHandler,
    UpdateServerListHandler.operationName     -> UpdateServerListHandler,
    AddMainKeyHandler.operationName           -> AddMainKeyHandler,
    AddVotersListHandler.operationName        -> AddVotersListHandler,
    RemoveFromVotersListHandler.operationName -> RemoveFromVotersListHandler,
    AddToVotersListHandler.operationName      -> AddToVotersListHandler,
    ResultsHandler.operationName              -> ResultsHandler,
    DecryptionHandler.operationName           -> DecryptionHandler,
    FinishVotingHandler.operationName         -> FinishVotingHandler,
    BlindSigIssueHandler.operationName        -> BlindSigIssueHandler,
    CommissionDecryptionHandler.operationName -> CommissionDecryptionHandler,
    StartVotingHandler.operationName          -> StartVotingHandler
  )

  private def getOperationHandler(operationName: String): Either[VotingError.WrongCallOperationError, CallHandler] =
    simpleOperationHandlers
      .get(operationName.toLowerCase)
      .toRight(VotingError.WrongCallOperationError(operationName))

  def handle(tx: ContractTransaction, authToken: String): Either[VotingError, Seq[DataEntry]] = {
    for {
      operationName <- tx.params.extractStringParam(ParamKey.Operation)
      handler       <- getOperationHandler(operationName)
      stateService = new VotingStateService(client, authToken)
      requestStart = System.currentTimeMillis()
      state <- tx.getContractKeys(stateService, handler)
      _ = logger.info(s"Contract keys request: handler = '${handler.getClass}', time = '${System
        .currentTimeMillis() - requestStart}'ms, txId = '${tx.id}'")
      callStart = System.currentTimeMillis()
      result <- handler.call(tx, state)
      _ = logger.info(s"Handler call: time = '${System.currentTimeMillis() - callStart}'ms, txId = '${tx.id}'")
    } yield result
  }
}
