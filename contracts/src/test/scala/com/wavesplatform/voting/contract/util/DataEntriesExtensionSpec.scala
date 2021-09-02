package com.wavesplatform.voting.contract.util

import org.scalatest.freespec.AnyFreeSpec
import org.scalatest.matchers.should.Matchers
import com.wavesplatform.voting.contract.util.DataEntriesExtension._
import com.wavesplatform.protobuf.common.DataEntry
import play.api.libs.json._
import com.google.protobuf.ByteString
import com.wavesplatform.voting.contract.VotingError

class DataEntriesExtensionSpec extends AnyFreeSpec with Matchers {
  private val byteString = ByteString.copyFrom(Array(1.toByte, 2.toByte, 3.toByte))
  private val dataEntries = Seq(
    DataEntry(
      key = "longParam",
      value = DataEntry.Value.IntValue(1584022707912L)
    ),
    DataEntry(
      key = "stringParam",
      value = DataEntry.Value.StringValue("{\"json_field\":\"strValue\"}")
    ),
    DataEntry(key = "binaryParam", value = DataEntry.Value.BinaryValue(byteString)),
    DataEntry(
      key = "booleanParam",
      value = DataEntry.Value.BoolValue(false)
    ),
    DataEntry(
      key = "optStringParam",
      value = DataEntry.Value.StringValue("optionalStringValue")
    )
  )

  "extractLongParam" in {
    val extractedLongRes = dataEntries.extractLongParam("longParam")
    extractedLongRes shouldBe 'right
    extractedLongRes.right.get shouldBe 1584022707912L
  }

  "extractStringParam" in {
    val extractedStringRes = dataEntries.extractStringParam("stringParam")
    extractedStringRes shouldBe 'right
    val json = Json.parse(extractedStringRes.right.get)
    (json \ "json_field").as[String] shouldBe "strValue"
  }

  "extractBinaryParam" in {
    val extractedBynaryRes = dataEntries.extractBinaryParam("binaryParam")
    extractedBynaryRes shouldBe 'right
    extractedBynaryRes.right.get shouldBe byteString
  }

  "extractBooleanParam" in {
    val extractedBooleanRes = dataEntries.extractBooleanParam("booleanParam")
    extractedBooleanRes shouldBe 'right
    extractedBooleanRes.right.get shouldBe false
  }

  "return Left when trying to extract nonexistent parameter" in {
    val extractedBooleanRes = dataEntries.extractStringParam("nonexistent")
    extractedBooleanRes shouldBe 'left
    extractedBooleanRes.left.get shouldBe VotingError.RequiredParamIsMissing("nonexistent")
  }

  "return Left when trying to extract parameter with wrong type" in {
    val extractedBooleanRes = dataEntries.extractStringParam("booleanParam")
    extractedBooleanRes shouldBe 'left
    extractedBooleanRes.left.get shouldBe VotingError.RequiredParamValueMissing("booleanParam")
  }

  "extractOptionalStringParam" in {
    val extractedOptionalStringRes = dataEntries.extractOptionalStringParam("optStringParam")
    extractedOptionalStringRes shouldBe Some("optionalStringValue")

    dataEntries.extractOptionalStringParam("booleanParam") shouldBe None
    dataEntries.extractOptionalStringParam("unexistsParam") shouldBe None
  }
}
