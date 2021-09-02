package com.wavesplatform.voting.contract

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.voting.contract.util.InstantUtil.InstantJsonFormat
import enumeratum.{Enum, EnumEntry, EnumFormats, PlayJsonEnum}
import play.api.libs.functional.syntax._
import play.api.libs.json.Reads._
import play.api.libs.json.Writes._
import play.api.libs.json._

import java.math.BigInteger
import java.time.Instant
import scala.collection.immutable
import scala.util.{Failure, Success, Try}

sealed trait VotingStatus extends EnumEntry
object VotingStatus extends Enum[VotingStatus] with PlayJsonEnum[VotingStatus] {

  override implicit val jsonFormat: Format[VotingStatus] = EnumFormats.formats(this, insensitive = true)

  val values: immutable.IndexedSeq[VotingStatus] = findValues

  case object Active    extends VotingStatus
  case object Halted    extends VotingStatus
  case object Completed extends VotingStatus
}

case class Dim(min: Int, max: Int, optionsCount: Int)
object Dim {
  implicit val format: Format[Dim] = new Format[Dim] {
    override def reads(json: JsValue): JsResult[Dim] = json match {
      case JsArray(intsJson) if intsJson.size == 3 =>
        val ints = intsJson.map(_.as[Int])
        JsSuccess(Dim(ints.head, ints(1), ints.last))
      case _ => JsError("Expected JsArray of size 3")
    }

    override def writes(o: Dim): JsValue = JsArray(List(o.min, o.max, o.optionsCount).map(JsNumber(_)))
  }
}

case class VotingBase(
  pollId: String,
  bulletinHash: String,
  dimension: Vector[Dim],
  blindSigModulo: BigInteger,
  blindSigExponent: BigInteger,
  dateStart: Option[Instant],
  dateEnd: Option[Instant],
  status: VotingStatus,
  startDateIssueBallots: Option[Instant],
  stopDateIssueBallots: Option[Instant],
  isRevoteBlocked: Boolean = false) {

  def toDataEntry: DataEntry = {
    DataEntry(StateKey.VotingBase.entryName, toJsonStr(this))
  }
}

object VotingBase extends InstantJsonFormat {

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

  implicit val votingBaseFormat: Format[VotingBase] = {
    ((JsPath \ ParamKey.PollId).format[String] and
      (JsPath \ ParamKey.BulletinHash).format[String] and
      (JsPath \ ParamKey.Dimension).format[Vector[Dim]] and
      (JsPath \ ParamKey.BlindSigModulo).format[BigInteger](BigIntegerFormat) and
      (JsPath \ ParamKey.BlindSigExponent).format[BigInteger](BigIntegerFormat) and
      (JsPath \ ParamKey.DateStart).formatNullable[Instant] and
      (JsPath \ ParamKey.DateEnd).formatNullable[Instant] and
      (JsPath \ "status").format[VotingStatus] and
      (JsPath \ ParamKey.StartDateIssueBallots).formatNullable[Instant] and
      (JsPath \ ParamKey.StopDateIssueBallots).formatNullable[Instant] and
      (JsPath \ "isRevoteBlocked").format[Boolean])(VotingBase.apply, unlift(VotingBase.unapply))
  }
}
