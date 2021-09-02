package com.wavesplatform.voting.contract.util

import cats.syntax.either.{catsSyntaxEither, catsSyntaxEitherObject}
import com.google.protobuf.ByteString
import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.voting.contract.VotingError.{GenericVotingError, UnknownEnumParamValue}
import com.wavesplatform.voting.contract.{StateKey, VotingError}

import java.math.BigInteger
import java.time.Instant

object DataEntriesExtension {

  implicit class DataEntryExtension(val value: DataEntry.type) extends AnyVal {
    def apply(stateKey: StateKey, value: com.wavesplatform.protobuf.common.DataEntry.Value): DataEntry = {
      DataEntry(stateKey.entryName, value)
    }
  }

  implicit class DataEntriesExtensionMethods(val value: Seq[DataEntry]) extends AnyVal {

    private def findParamIndex(paramName: String): Either[VotingError, Int] = {
      val index = value.indexWhere(_.key == paramName)
      Either.cond(
        index != -1 && !value(index).value.isEmpty,
        index,
        VotingError.RequiredParamIsMissing(paramName)
      )
    }

    def extractBooleanParam(paramName: String): Either[VotingError, Boolean] = {
      for {
        index <- findParamIndex(paramName)
        paramValue = value(index).value.boolValue
        result <- Either.cond(
          paramValue.nonEmpty,
          paramValue.get,
          VotingError.RequiredParamValueMissing(paramName)
        )
      } yield result
    }

    def extractOptionalBooleanParam(paramName: String): Option[Boolean] =
      extractParamOpt(paramName).flatMap(_.value.boolValue)

    def extractLongParam(paramName: String): Either[VotingError, Long] = {
      for {
        index <- findParamIndex(paramName)
        paramValue = value(index).value.intValue
        result <- Either.cond(
          paramValue.nonEmpty,
          paramValue.get,
          VotingError.RequiredParamValueMissing(paramName)
        )
      } yield result
    }

    def extractIntParam(paramName: String): Either[VotingError, Int] = {
      for {
        longValue <- extractLongParam(paramName)
        intValue <- Either.cond(
          BigInt(longValue).isValidInt,
          longValue.toInt,
          GenericVotingError(s"Parameter $paramName is not an Integer")
        )
      } yield intValue
    }

    def extractBinaryParam(paramName: String): Either[VotingError, ByteString] = {
      for {
        index <- findParamIndex(paramName)
        paramValue = value(index).value.binaryValue
        result <- Either.cond(
          paramValue.nonEmpty,
          paramValue.get,
          VotingError.RequiredParamValueMissing(paramName)
        )
      } yield result
    }

    def extractStringParam(paramName: String): Either[VotingError, String] = {
      for {
        index <- findParamIndex(paramName)
        paramValue = value(index).value.stringValue
        result <- Either.cond(
          paramValue.exists(!_.isBlank),
          paramValue.get,
          VotingError.RequiredParamValueMissing(paramName)
        )
      } yield result
    }

    def extractEnumParam[T <: enumeratum.EnumEntry](
      paramName: String,
      enumType: enumeratum.Enum[T]
    ): Either[VotingError, T] = {
      for {
        valueStr <- extractStringParam(paramName)
        result   <- enumType.withNameInsensitiveEither(valueStr).leftMap(_ => UnknownEnumParamValue(paramName, valueStr))
      } yield result
    }

    def extractBigIntegerParam(paramName: String): Either[VotingError, BigInteger] = {
      for {
        byteString <- extractBinaryParam(paramName)
        byteArray = byteString.toByteArray
        result <- Either
          .catchNonFatal(new BigInteger(1, byteArray))
          .leftMap(_ =>
            GenericVotingError(
              s"Parameter '$paramName' value is not big integer; found bytes '${byteArray.mkString(", ")}'"))
      } yield result
    }

    private def extractParamOpt(paramName: String): Option[DataEntry] = {
      val index = value.indexWhere(_.key == paramName)
      Either.cond(index >= 0, value(index), None).toOption
    }

    def extractOptionalStringParam(paramName: String): Option[String] = {
      val paramValueOpt = extractParamOpt(paramName)
      val paramValue    = paramValueOpt.flatMap(_.value.stringValue)
      paramValue
    }

    def extractOptionalInstantParam(paramName: String): Either[VotingError, Option[Instant]] = {
      extractOptionalStringParam(paramName)
        .fold[Either[VotingError, Option[Instant]]](Right(None))(InstantUtil.parse(_).map(Some(_)))
    }
  }
}
