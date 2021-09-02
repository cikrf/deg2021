package com.wavesplatform.voting.contract.invocation.handlers

import com.google.protobuf.ByteString
import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.util.DataEntriesExtension.DataEntryExtension
import com.wavesplatform.voting.contract.util.TestKeysGenerator
import com.wavesplatform.voting.contract.validators.BlindSignatureVerifier.BlindSigPublicKey
import com.wavesplatform.voting.contract.{
  parseJson,
  toJsonStr,
  Dim,
  ParamKey,
  StateKey,
  VotingBase,
  VotingError,
  VotingStatus
}
import org.scalatest.freespec.AnyFreeSpec
import org.scalatest.matchers.should.Matchers

import java.security.interfaces.RSAPublicKey
import java.time.Instant

class StartVotingHandlerSpec extends AnyFreeSpec with Matchers {
  private val senderPublicKey = "senderPublicKey"
  private val dimension       = Vector(Dim(1, 2, 3), Dim(1, 1, 3))
  private val keys            = TestKeysGenerator.generateKeys()
  private val blindSigPK      = BlindSigPublicKey(keys.getPublic.asInstanceOf[RSAPublicKey])
  private val servers         = Seq(senderPublicKey, "pubKey1", "pubKey2", "pubKey3")
  private val serversDE       = DataEntry(StateKey.Servers, toJsonStr(servers))

  private val contractTransaction = ContractTransaction(
    id = "id",
    `type` = 104,
    sender = "sender",
    senderPublicKey = senderPublicKey,
    contractId = "contractId",
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
    dateStart = None,
    dateEnd = None,
    blindSigModulo = blindSigPK.modulo,
    blindSigExponent = blindSigPK.exp,
    startDateIssueBallots = None,
    stopDateIssueBallots = None
  )

  "all validations passed" in {
    val contractState = ContractKeysResponse(serversDE +: Seq(votingBase.toDataEntry))
    val callRes       = StartVotingHandler.call(contractTransaction, contractState)
    callRes shouldBe 'right

    val entries = callRes.right.get
    entries.size shouldBe 1
    entries.head.key shouldBe StateKey.VotingBase.entryName
    val resultVotingBase = parseJson[VotingBase](entries.head.value.stringValue.get)
    resultVotingBase shouldBe 'right
    resultVotingBase.right.get.dateStart should not be None
  }

  "fail if start date is already in state" in {
    val contractState =
      ContractKeysResponse(serversDE +: Seq(votingBase.copy(dateStart = Some(Instant.now())).toDataEntry))
    val callRes = StartVotingHandler.call(contractTransaction, contractState)
    callRes shouldBe Left(VotingError.StartDateAlreadyInStateError)
  }

  "sender primary key should be among servers" in {
    val serversWithoutSender   = servers.tail
    val serversDEWithoutSender = DataEntry(ParamKey.Servers, toJsonStr(serversWithoutSender))
    val wrongTx                = contractTransaction.copy(params = serversDEWithoutSender :: Nil)
    val contractState          = ContractKeysResponse(serversDE +: Seq(votingBase.toDataEntry))
    val callRes                = UpdateServerListHandler.call(wrongTx, contractState)

    callRes shouldBe 'left
    callRes.left.get shouldBe VotingError.ServersDoNotContainSenderPubKey(senderPublicKey)
  }
}
