package com.wavesplatform.voting.contract.invocation.handlers

import java.security.interfaces.RSAPublicKey
import java.time.Instant

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.common.DataEntry.Value.StringValue
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.StateKey.IssueBallotsRegistrator
import com.wavesplatform.voting.contract._
import com.wavesplatform.voting.contract.util.DataEntriesExtension.DataEntryExtension
import com.wavesplatform.voting.contract.util.{InstantUtil, TestKeysGenerator}
import com.wavesplatform.voting.contract.validators.BlindSignatureVerifier.BlindSigPublicKey
import org.scalatest.freespec.AnyFreeSpec
import org.scalatest.matchers.should.Matchers

class StartIssueBallotsHandlerSpec extends AnyFreeSpec with Matchers {
  private val senderPublicKey = "senderPublicKey"
  private val dimension       = Vector(Dim(1, 2, 3), Dim(1, 1, 3))
  private val keys            = TestKeysGenerator.generateKeys()
  private val blindSigPK      = BlindSigPublicKey(keys.getPublic.asInstanceOf[RSAPublicKey])
  private val serversDE       = DataEntry(IssueBallotsRegistrator, StringValue(senderPublicKey))

  private val sendingStartDateIssueBallots   = InstantUtil.toString(Instant.now())
  private val expectingStartDateIssueBallots = InstantUtil.parse(sendingStartDateIssueBallots).right.get

  private val contractTransaction = ContractTransaction(
    id = "id",
    `type` = 104,
    sender = "sender",
    senderPublicKey = senderPublicKey,
    contractId = "contractId",
    fee = 22L,
    params = Seq(DataEntry(ParamKey.StartDateIssueBallots.name, StringValue(sendingStartDateIssueBallots)))
  )

  private val votingBase = VotingBase(
    pollId = "pollIdValue",
    bulletinHash = "bulletinHashValue",
    dimension = dimension,
    status = VotingStatus.Active,
    dateStart = None,
    dateEnd = None,
    blindSigModulo = blindSigPK.modulo,
    blindSigExponent = blindSigPK.exp,
    startDateIssueBallots = None,
    stopDateIssueBallots = None
  )

  "all validations passed" in {
    val state  = ContractKeysResponse(serversDE +: Seq(votingBase.toDataEntry))
    val result = StartIssueBallotsHandler.call(contractTransaction, state)

    val entries = result.right.get
    entries.size shouldBe 1
    entries.head.key shouldBe StateKey.VotingBase.entryName

    val resultVotingBase = parseJson[VotingBase](entries.head.value.stringValue.get)
    resultVotingBase shouldBe Right(votingBase.copy(startDateIssueBallots = Some(expectingStartDateIssueBallots)))
  }

  "fail if sender is not the issue ballots registrator" in {
    val otherRegistrator = DataEntry(IssueBallotsRegistrator, StringValue("other"))
    val state            = ContractKeysResponse(otherRegistrator +: Seq(votingBase.toDataEntry))
    val result           = StartIssueBallotsHandler.call(contractTransaction, state)
    result shouldBe Left(VotingError.SenderIsNotIssueBallotsRegistrator(senderPublicKey))
  }

  "fail if startDateIssueBallots is already in the state" in {
    val time   = expectingStartDateIssueBallots
    val state  = ContractKeysResponse(serversDE +: Seq(votingBase.copy(startDateIssueBallots = Some(time)).toDataEntry))
    val result = StartIssueBallotsHandler.call(contractTransaction, state)
    result shouldBe Left(VotingError.IssueBallotsAlreadyStarted(time))
  }
}
