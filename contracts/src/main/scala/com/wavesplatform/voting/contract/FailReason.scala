package com.wavesplatform.voting.contract

import play.api.libs.json.{Json, OFormat}

case class FailReason(reason: String, senderPublicKey: String)

object FailReason {

  implicit val FailReasonFormat: OFormat[FailReason] = Json.format[FailReason]
}
