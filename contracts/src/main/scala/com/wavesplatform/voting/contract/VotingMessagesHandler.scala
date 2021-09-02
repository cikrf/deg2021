package com.wavesplatform.voting.contract

import com.typesafe.scalalogging.Logger
import com.wavesplatform.protobuf.service._
import com.wavesplatform.voting.contract.creation.InitiateVotingHandler
import com.wavesplatform.voting.contract.invocation.VotingInvocationHandler

import scala.concurrent.ExecutionContext
import scala.util.control.NonFatal
import scala.util.{Failure, Try}

class VotingMessagesHandler(val clientService: ContractServiceClient, val transactionService: TransactionServiceClient)(
  implicit ec: ExecutionContext) {
  private val votingInvocationHandler = new VotingInvocationHandler(clientService, transactionService)
  private val logger                  = Logger[VotingMessagesHandler]

  def onNewMessage(tx: ContractTransaction, authToken: String): Try[Unit] = {
    logger.info(s"Incoming transaction: '$tx'")
    Try(tx.`type` match {
      case 103 => handleCreateTransaction(tx, authToken)
      case 104 => handleCallTransaction(tx, authToken)
      case _   => handleError(tx, authToken, "Error: unknown transaction type " + tx.`type`)
    }).recoverWith {
      case NonFatal(ex) =>
        logger.error(s"Encountered an unexpected error while processing transaction '${tx.id}'", ex)
        Try(handleError(tx, authToken, s"Unexpected error: ${ex.getMessage}"))
        Failure(ex)
    }
  }

  private def handleCreateTransaction(tx: ContractTransaction, authToken: String): Unit = {
    InitiateVotingHandler.handle(tx) match {
      case Left(error) =>
        handleError(tx, authToken, error.errorMessage)

      case Right(values) =>
        logger.info(s"Committing execution success for Create transaction '${tx.id}'")
        clientService
          .commitExecutionSuccess()
          .withAuth(authToken)
          .invoke(ExecutionSuccessRequest(tx.id, values))
    }
  }

  private def handleCallTransaction(tx: ContractTransaction, authToken: String): Unit = {
    votingInvocationHandler.handle(tx, authToken) match {
      case Left(error) =>
        handleError(tx, authToken, error.errorMessage)

      case Right(values) =>
        logger.info(s"Committing execution success for Call transaction '${tx.id}'")
        clientService
          .commitExecutionSuccess()
          .withAuth(authToken)
          .invoke(ExecutionSuccessRequest(tx.id, values))
    }
  }

  private def handleError(tx: ContractTransaction, authToken: String, errorMessage: String): Unit = {
    logger.error(s"Committing error for tx.id '${tx.id}': '$errorMessage'")
    clientService
      .commitExecutionError()
      .withAuth(authToken)
      .invoke(ExecutionErrorRequest(tx.id, errorMessage))
  }
}
