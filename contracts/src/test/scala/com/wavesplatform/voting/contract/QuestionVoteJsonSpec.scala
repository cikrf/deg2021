package com.wavesplatform.voting.contract

import org.scalatest.freespec.AnyFreeSpec
import org.scalatest.matchers.should.Matchers
import play.api.libs.json.{JsArray, JsString, Json}

class QuestionVoteJsonSpec extends AnyFreeSpec with Matchers {

  import QuestionVoteJsonSpec._

  private val questionVote = QuestionVoteExample

  private val questionVotesArrayJson =
    s"""
       |[
       |  $QuestionVoteJsonExample,
       |  $QuestionVoteJsonExample,
       |  $QuestionVoteJsonExample
       |]
       |""".stripMargin

  "QuestionVote json read" in {
    val jsValue  = Json.parse(QuestionVoteJsonExample)
    val jsResult = Json.fromJson(jsValue)(QuestionVote.QuestionVoteReads)
    jsResult.isSuccess shouldBe true
    val actual = jsResult.get
    actual.selectedOptions should contain allElementsOf questionVote.selectedOptions
    actual.zkp should contain allElementsOf questionVote.zkp
  }

  "QuestionVote array json read" in {
    val expected = Array(questionVote, questionVote, questionVote)
    val jsValue  = Json.parse(questionVotesArrayJson)
    val jsResult = Json.fromJson[Array[QuestionVote]](jsValue)
    jsResult.isSuccess shouldBe true
    val actual = jsResult.get
    (actual zip expected).foreach {
      case (actualVote, expectedVote) =>
        actualVote.selectedOptions should contain allElementsOf expectedVote.selectedOptions
        actualVote.zkp should contain allElementsOf expectedVote.zkp
    }
  }
}

object QuestionVoteJsonSpec {

  private val PointsArray = JsArray(Seq(JsString("0123456789"), JsString("0123456789")))

  val QuestionVoteExample: QuestionVote = QuestionVote(
    selectedOptions = Vector(
      Vector(
        PointsArray,
        PointsArray,
        PointsArray,
        JsString("0123456789"),
        JsString("0123456789")
      ),
      Vector(
        PointsArray,
        PointsArray,
        PointsArray,
        JsString("0123456789"),
        JsString("0123456789")
      ),
      Vector(
        PointsArray,
        PointsArray,
        PointsArray,
        JsString("0123456789"),
        JsString("0123456789")
      )
    ),
    zkp = Vector(
      PointsArray,
      PointsArray,
      PointsArray,
      JsString("0123456789"),
      JsString("0123456789")
    )
  )

  val QuestionVoteJsonExample: String =
    """
      |[
      |	[
      |		[
      |			["0123456789", "0123456789"],
      |			["0123456789", "0123456789"],
      |			["0123456789", "0123456789"],
      |			"0123456789",
      |			"0123456789"
      |		],
      |		[
      |			["0123456789", "0123456789"],
      |			["0123456789", "0123456789"],
      |			["0123456789", "0123456789"],
      |			"0123456789",
      |			"0123456789"
      |		],
      |		[
      |			["0123456789", "0123456789"],
      |			["0123456789", "0123456789"],
      |			["0123456789", "0123456789"],
      |			"0123456789",
      |			"0123456789"
      |		]
      |	],
      |	[
      |   ["0123456789", "0123456789"],
      |		["0123456789", "0123456789"],
      |		["0123456789", "0123456789"],
      |		"0123456789",
      |		"0123456789"
      |	]
      |]
      |""".stripMargin
}
