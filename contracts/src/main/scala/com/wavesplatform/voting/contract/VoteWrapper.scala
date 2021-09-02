package com.wavesplatform.voting.contract

import java.math.BigInteger

import com.wavesplatform.protobuf.common.DataEntry
import play.api.libs.json._

import scala.util.{Failure, Success, Try}

case class VoteWrapper(vote: String, blindSig: BigInteger) {

  def toDataEntry(publicKey: String): DataEntry = {
    DataEntry(StateKey.Vote(publicKey).entryName, toJsonStr(this))
  }
}

object VoteWrapper {

  private implicit val BigIntegerReads: Reads[BigInteger] = Reads {
    case JsString(value) =>
      Try(new BigInteger(value, 16)) match {
        case Success(bigInteger) => JsSuccess(bigInteger)
        case Failure(_)          => JsError(s"Invalid BigInteger number value '$value'")
      }
    case _ => JsError(s"Invalid BigInteger number value")
  }

  private implicit val BigIntegerWrites: Writes[BigInteger] = bigInteger => JsString(bigInteger.toString(16))

  implicit val BigIntegerFormat: Format[BigInteger] = Format(BigIntegerReads, BigIntegerWrites)

  implicit val VoteWrapperFormat: OFormat[VoteWrapper] = Json.format[VoteWrapper]
}
