package com.wavesplatform.voting

import akka.grpc.scaladsl.{SingleResponseRequestBuilder, StreamResponseRequestBuilder}
import com.wavesplatform.protobuf.common.DataEntry.Value.StringValue
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import play.api.libs.json._

import scala.collection.Seq
import scala.concurrent.duration.{Duration, _}
import scala.concurrent.{Await, Future, _}
import scala.util.{Failure, Success, Try}

package object contract {

  def toJsonStr[T](value: T)(implicit writes: Writes[T]): StringValue = StringValue(Json.toJson(value).toString())

  def parseJson[T](jsonStr: String)(implicit fjs: Reads[T]): Either[VotingError, T] = {
    Try(Json.parse(jsonStr)) match {
      case Failure(exception) =>
        Left(VotingError.ParseError(exception.getMessage))

      case Success(jsParseResult) =>
        Try(jsParseResult.validate[T]) match {
          case Success(JsSuccess(value, _)) =>
            Right(value)

          case Success(JsError(errors)) =>
            val jsonErrorsMsg = jsonErrorsToString(errors)
            val msg           = s"Json '$jsonStr' has those errors: $jsonErrorsMsg"
            Left(VotingError.ParseError(msg))

          case Failure(ex) =>
            Left(VotingError.ParseError(ex.getMessage))
        }
    }
  }

  private def jsonErrorsToString(errors: Seq[(JsPath, Seq[JsonValidationError])]): String = {
    errors.map {
      case (path, error) =>
        val messages = error.map(_.message)
        s"path: '${path.toString()}', errors: [${messages.mkString(", ")}]"
    }.mkString("\t")
  }

  implicit class ExtendedFuture[T](val value: Future[T]) extends AnyVal {
    def waitForResponse(atMost: Duration): Either[VotingError, T] = {
      Try(Await.result(value, atMost)) match {
        case Failure(ex)  => Left(VotingError.NoResponse(ex.getMessage))
        case Success(res) => Right(res)
      }
    }
  }

  implicit class ExtendedClient[Req, Res](val value: SingleResponseRequestBuilder[Req, Res]) extends AnyVal {
    def withAuth(authToken: String): SingleResponseRequestBuilder[Req, Res] = {
      value.addHeader("authorization", authToken)
    }
  }

  implicit class ExtendedStreamClient[Req, Res](val value: StreamResponseRequestBuilder[Req, Res]) extends AnyVal {
    def withAuth(authToken: String): StreamResponseRequestBuilder[Req, Res] = {
      value.addHeader("authorization", authToken)
    }
  }

  implicit class ExtendedContractTransaction(val value: ContractTransaction) extends AnyVal {
    def getContractKeys(
      stateService: VotingStateService,
      handler: CallHandler): Either[VotingError, ContractKeysResponse] = {
      blocking(handler.getContractState(value, stateService).waitForResponse(5.seconds))
    }
  }
}
