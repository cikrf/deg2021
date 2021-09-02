package com.wavesplatform.voting.contract.invocation.handlers

import com.google.protobuf.ByteString
import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.common.DataEntry.Value.BinaryValue
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.QuestionVoteJsonSpec.QuestionVoteJsonExample
import com.wavesplatform.voting.contract.util.DataEntriesExtension.DataEntryExtension
import com.wavesplatform.voting.contract.util.TestDateTime._
import com.wavesplatform.voting.contract.util.TestKeysGenerator
import com.wavesplatform.voting.contract.validators.BlindSignatureVerifier.BlindSigPublicKey
import com.wavesplatform.voting.contract.{VotingBase, _}
import org.bouncycastle.jce.provider.BouncyCastleProvider
import org.scalatest.freespec.AnyFreeSpec
import org.scalatest.matchers.should.Matchers
import play.api.libs.json.Json

import java.math.BigInteger
import java.security.Security
import java.security.interfaces.RSAPublicKey
import java.time.Instant
import java.time.temporal.ChronoUnit

class VoteHandlerSpec extends AnyFreeSpec with Matchers {

  Security.addProvider(new BouncyCastleProvider)

  private val senderPublicKey =
    "3fFhTr9uaB87VC1RJJzNu2vo3VYmAN8TrktJFFKLkhZTTbb14khvQ1avowpvAFTNZEjK7rqFH8jaxaGG4TVtcBhE"

  private val votes = Json.parse(s"""
                                    |[
                                    |  $QuestionVoteJsonExample,
                                    |  $QuestionVoteJsonExample
                                    |]
                                    |""".stripMargin)

  private val dimension = Vector(Dim(1, 2, 3), Dim(1, 1, 3))

  private val keys       = TestKeysGenerator.generateKeys()
  private val blindSigPK = BlindSigPublicKey(keys.getPublic.asInstanceOf[RSAPublicKey])
  private val blindSig   = TestKeysGenerator.makeBlindSignature(keys, senderPublicKey)

  private val contractTransaction = ContractTransaction(
    id = "id",
    `type` = 104,
    sender = "sender",
    senderPublicKey = senderPublicKey,
    contractId = "contractId",
    params = Seq(
      DataEntry("vote", toJsonStr(votes)),
      DataEntry(ParamKey.BlindSig, BinaryValue(ByteString.copyFrom(blindSig.toByteArray)))
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

  private val servers: Seq[String] = Seq(senderPublicKey, "pubKey")
  private val serversDE: DataEntry = DataEntry(StateKey.Servers, toJsonStr(servers))

  private def fail(error: VotingError): DataEntry =
    DataEntry(
      StateKey.VoteFail(contractTransaction.sender, contractTransaction.id),
      toJsonStr(FailReason(error.errorMessage, senderPublicKey)))

  "all validations passed" in {
    val contractState: ContractKeysResponse =
      ContractKeysResponse(serversDE +: Seq(votingBase.toDataEntry))
    val callRes = VoteHandler.call(contractTransaction, contractState)
    callRes shouldBe 'right
    callRes.right.get should contain theSameElementsAs Seq(
      VoteWrapper(contractTransaction.id, blindSig).toDataEntry(contractTransaction.senderPublicKey))
  }

  "should fail re-voting if revote is blocked" in {
    val contractState: ContractKeysResponse =
      ContractKeysResponse(
        serversDE +: Seq(
          votingBase.copy(isRevoteBlocked = true).toDataEntry,
          DataEntry(s"VOTE_${contractTransaction.senderPublicKey}", DataEntry.Value.StringValue(contractTransaction.id))
        ))

    val callRes = VoteHandler.call(contractTransaction, contractState)
    callRes shouldBe 'right
    callRes.right.get shouldBe Seq(fail(VotingError.RevoteIsBlockedError))
  }

  "blind signature verification failed" in {
    val contractState: ContractKeysResponse =
      ContractKeysResponse(serversDE +: Seq(votingBase.toDataEntry))

    val invalidBlindSig = blindSig.add(BigInteger.TWO)
    val invalidTx = contractTransaction.copy(params = Seq(
      DataEntry("vote", toJsonStr(votes)),
      DataEntry(ParamKey.BlindSig, BinaryValue(ByteString.copyFrom(invalidBlindSig.toByteArray)))
    ))

    val callRes = VoteHandler.call(invalidTx, contractState)
    callRes shouldBe 'right
    callRes.right.get shouldBe Seq(fail(VotingError.InvalidBlindSig(invalidBlindSig)))
  }

  "voting is in progress" - {
    "voting not started yet" in {
      val startDate                 = Instant.now().plus(1, ChronoUnit.DAYS)
      val votingBaseWithUpdatedTime = votingBase.copy(dateStart = Some(startDate))
      val contractState: ContractKeysResponse =
        ContractKeysResponse(serversDE +: Seq(votingBaseWithUpdatedTime.toDataEntry))
      val callRes = VoteHandler.call(contractTransaction, contractState)
      callRes shouldBe 'right
      callRes.right.get shouldBe Seq(fail(VotingError.StartDateHasNotComeYet(startDate)))
    }

    "voting already ended" in {
      val votingBaseWithUpdatedTime =
        votingBase.copy(status = VotingStatus.Completed, dateEnd = Some(Instant.now().minus(1, ChronoUnit.DAYS)))
      val contractState: ContractKeysResponse =
        ContractKeysResponse(serversDE +: Seq(votingBaseWithUpdatedTime.toDataEntry))
      val callRes = VoteHandler.call(contractTransaction, contractState)
      callRes shouldBe 'right
      callRes.right.get shouldBe Seq(fail(VotingError.VotingIsNotInProgress))
    }
  }

  "should fail when start date is not in state" in {
    val contractState: ContractKeysResponse =
      ContractKeysResponse(serversDE +: Seq(votingBase.copy(dateStart = None).toDataEntry))
    val callRes = VoteHandler.call(contractTransaction, contractState)
    callRes shouldBe 'right
    callRes.right.get shouldBe Seq(fail(VotingError.EmptyStartDateError(VoteHandler.operationName)))
  }
}
