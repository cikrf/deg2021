package com.wavesplatform.voting.contract.invocation.handlers

import com.google.protobuf.ByteString
import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.common.DataEntry.Value.StringValue
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract._
import com.wavesplatform.voting.contract.util.DataEntriesExtension.DataEntryExtension
import com.wavesplatform.voting.contract.util.TestDateTime.InstantExtension
import com.wavesplatform.voting.contract.util.TestKeysGenerator
import com.wavesplatform.voting.contract.validators.BlindSignatureVerifier.BlindSigPublicKey
import org.scalatest.freespec.AnyFreeSpec
import org.scalatest.matchers.should.Matchers

import java.security.interfaces.RSAPublicKey
import java.time.Instant
import java.time.temporal.ChronoUnit

class BlindSigIssueHandlerSpec extends AnyFreeSpec with Matchers {

  private val senderPublicKey = "senderPublicKey"
  private val dimension       = Vector(Dim(1, 2, 3), Dim(1, 1, 3))
  private val keys            = TestKeysGenerator.generateKeys()
  private val blindSigPK      = BlindSigPublicKey(keys.getPublic.asInstanceOf[RSAPublicKey])
  private val servers         = Seq(senderPublicKey, "pubKey1", "pubKey2", "pubKey3")
  private val serversDE       = DataEntry(StateKey.Servers, toJsonStr(servers))
  private val registrator     = DataEntry(StateKey.BlindSigIssueRegistrator, StringValue(senderPublicKey))
  private val baseDE          = Seq(serversDE, registrator)

  private val userIdMaskedSigs =
    Seq(
      UserIdMaskedSig("user_1", "sig1"),
      UserIdMaskedSig("user_2", "sig2"),
      UserIdMaskedSig("user_2", "sig2")
    )

  private val contractTransaction = ContractTransaction(
    id = "id",
    `type` = 104,
    sender = "sender",
    senderPublicKey = senderPublicKey,
    contractId = "contractId",
    params = Seq(
      DataEntry(key = ParamKey.Data, value = toJsonStr(userIdMaskedSigs))
    ),
    fee = 22L,
    version = 2,
    proofs = ByteString.EMPTY,
    timestamp = Instant.now().toEpochMilli,
    feeAssetId = None,
    data = ContractTransaction.Data.Empty
  )

  private val votingBase = VotingBase(
    pollId = "pollIdValue",
    bulletinHash = "bulletinHashValue",
    dimension = dimension,
    status = VotingStatus.Active,
    dateStart = Some(Instant.now().minus(1, ChronoUnit.DAYS).truncateToSeconds()),
    dateEnd = None,
    blindSigModulo = blindSigPK.modulo,
    blindSigExponent = blindSigPK.exp,
    startDateIssueBallots = None,
    stopDateIssueBallots = None
  )

  private def fail(error: VotingError): DataEntry =
    DataEntry(StateKey.BlindSigFail(contractTransaction.id), StringValue(error.errorMessage))

  "all validations passed" in {
    val key    = StateKey.BlindSig(contractTransaction.id).entryName
    val value  = toJsonStr(userIdMaskedSigs)
    val state  = ContractKeysResponse(baseDE :+ votingBase.toDataEntry)
    val result = BlindSigIssueHandler.call(contractTransaction, state)
    result shouldBe Right(Seq(DataEntry(key, value)))
  }

  "data param is missing" in {
    val state  = ContractKeysResponse(baseDE :+ votingBase.toDataEntry)
    val result = BlindSigIssueHandler.call(contractTransaction.copy(params = Seq.empty), state)
    result shouldBe Right(Seq(fail(VotingError.RequiredParamIsMissing(ParamKey.Data))))
  }

  "should fail when start date is not in state" in {
    val state  = ContractKeysResponse(baseDE :+ votingBase.copy(dateStart = None).toDataEntry)
    val result = BlindSigIssueHandler.call(contractTransaction.copy(params = Seq.empty), state)
    result shouldBe Right(Seq(fail(VotingError.EmptyStartDateError(BlindSigIssueHandler.operationName))))
  }

  "should fail when start date is expired" in {
    val startDate = Instant.now().plus(1, ChronoUnit.DAYS).truncateToSeconds()
    val state     = ContractKeysResponse(baseDE :+ votingBase.copy(dateStart = Some(startDate)).toDataEntry)
    val result    = BlindSigIssueHandler.call(contractTransaction.copy(params = Seq.empty), state)
    result shouldBe Right(Seq(fail(VotingError.StartDateHasNotComeYet(startDate))))
  }

  "should fail when sender is not the blind sig issue registrator" in {
    val otherRegistrator = DataEntry(StateKey.BlindSigIssueRegistrator, StringValue("otherPk"))
    val state            = ContractKeysResponse(Seq(serversDE, otherRegistrator, votingBase.toDataEntry))
    val result           = BlindSigIssueHandler.call(contractTransaction, state)
    result shouldBe Right(Seq(fail(VotingError.SenderIsNotBlindSigIssueRegistrator(senderPublicKey))))
  }

  "should fail when blind sig issue registrator is empty" in {
    val state  = ContractKeysResponse(Seq(serversDE, votingBase.toDataEntry))
    val result = BlindSigIssueHandler.call(contractTransaction, state)
    result shouldBe Right(Seq(fail(VotingError.RequiredParamIsMissing(StateKey.BlindSigIssueRegistrator.entryName))))
  }
}
