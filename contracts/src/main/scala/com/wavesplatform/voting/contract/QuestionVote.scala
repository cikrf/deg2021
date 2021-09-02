package com.wavesplatform.voting.contract

import play.api.libs.functional.syntax._
import play.api.libs.json.Reads._
import play.api.libs.json.{JsPath, JsValue, Reads}

case class QuestionVote(selectedOptions: Vector[Vector[JsValue]], zkp: Vector[JsValue])

object QuestionVote {

  implicit val QuestionVoteReads: Reads[QuestionVote] = { json =>
    val reader = JsPath(0).read[Vector[Vector[JsValue]]] and JsPath(1).read[Vector[JsValue]]
    reader(QuestionVote.apply _).reads(json)
  }
}
