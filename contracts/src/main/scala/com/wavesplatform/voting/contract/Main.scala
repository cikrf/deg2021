package com.wavesplatform.voting.contract

import java.security.Security
import java.util.Objects
import java.util.concurrent.TimeUnit

import akka.actor.ActorSystem
import akka.grpc.GrpcClientSettings
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.{Keep, Sink}
import com.typesafe.scalalogging._
import com.wavesplatform.protobuf.service._
import org.bouncycastle.jce.provider.BouncyCastleProvider

import scala.concurrent.{ExecutionContextExecutor, Future}
import scala.util.{Failure, Success}

object Main {
  private final val CONNECTION_ID_KEY    = "CONNECTION_ID"
  private final val CONNECTION_TOKEN_KEY = "CONNECTION_TOKEN"
  private final val NODE_KEY             = "NODE"
  private final val NODE_PORT_KEY        = "NODE_PORT"

  private final val Parallelism = Runtime.getRuntime.availableProcessors()

  def main(args: Array[String]): Unit = {
    val connectionId = System.getenv(CONNECTION_ID_KEY)
    Objects.requireNonNull(connectionId, "Connection id is not set")
    val connectionToken = System.getenv(CONNECTION_TOKEN_KEY)
    Objects.requireNonNull(connectionToken, "Connection token is not set")
    val nodeHost = System.getenv(NODE_KEY)
    Objects.requireNonNull(nodeHost, "Node host is not set")
    val nodePort = System.getenv(NODE_PORT_KEY)
    Objects.requireNonNull(nodePort, "Node port is not set")

    Security.addProvider(new BouncyCastleProvider)

    implicit val system: ActorSystem               = ActorSystem.create("routes")
    implicit val materializer: ActorMaterializer   = ActorMaterializer.create(system)
    implicit val context: ExecutionContextExecutor = system.dispatcher
    val logger                                     = Logger("voting-contract")

    val settings = GrpcClientSettings
      .connectToServiceAt(nodeHost, nodePort.toInt)
      .withTls(false)
      .withChannelBuilderOverrides(builder =>
        builder.keepAliveTime(15, TimeUnit.SECONDS).keepAliveTimeout(20, TimeUnit.SECONDS))

    val clientService      = ContractServiceClient(settings)
    val transactionService = TransactionServiceClient(settings)

    val handler = new VotingMessagesHandler(clientService, transactionService)

    sys.addShutdownHook {
      logger.info(s"Shutdown hook is triggered, closing resources...")
      clientService.close
      transactionService.close
      system.terminate
    }

    logger.info(s"Voting contract ${BuildInfo.version} is connecting to '$nodeHost:$nodePort'...")

    val transactionStream = clientService
      .connect()
      .withAuth(connectionToken)
      .invoke(ConnectionRequest(connectionId, Parallelism))

    val stream = transactionStream.toMat {
      Sink.foreachAsync(Parallelism) { resp =>
        Future {
          val authToken = resp.authToken
          resp.transaction.foreach(tx => handler.onNewMessage(tx, authToken))
        }
      }
    }(Keep.both)
      .run()

    stream._2.onComplete {
      case Success(_) =>
        logger.info("Transaction stream is completed")
        sys.exit(0)
      case Failure(exception) =>
        logger.error("Transaction stream is closed due to error", exception)
        sys.exit(1)
    }
  }
}
