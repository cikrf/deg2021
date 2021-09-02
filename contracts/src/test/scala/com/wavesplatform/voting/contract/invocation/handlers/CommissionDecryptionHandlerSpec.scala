package com.wavesplatform.voting.contract.invocation.handlers

import java.math.BigInteger
import java.time.Instant
import java.time.temporal.ChronoUnit

import com.google.protobuf.ByteString
import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.common.DataEntry.Value.StringValue
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.VotingError.{InvalidCommissionSecretKey, RequiredParamIsMissing}
import com.wavesplatform.voting.contract.util.DataEntriesExtension.DataEntryExtension
import com.wavesplatform.voting.contract.util.TestDateTime._
import com.wavesplatform.voting.contract.{toJsonStr, Dim, ParamKey, StateKey, VotingBase, VotingError, VotingStatus}
import org.scalatest.freespec.AnyFreeSpec
import org.scalatest.matchers.should.Matchers

class CommissionDecryptionHandlerSpec extends AnyFreeSpec with Matchers {
  private val senderPublicKey = "senderPublicKey"

  private val contractTransaction = ContractTransaction(
    id = "id",
    `type` = 104,
    sender = "sender",
    senderPublicKey = senderPublicKey,
    contractId = "contractId",
    params = Seq.empty,
    fee = 22L,
    version = 2,
    proofs = ByteString.EMPTY,
    timestamp = Instant.now().toEpochMilli,
    feeAssetId = None,
    data = ContractTransaction.Data.Empty
  )

  private val keyPairs =
    Seq(
      (
        "03f8b11d49d669f3d9a52f135a54e2750c56ee9f0c170a3ce89f7bbdf8a39c941b",
        "daefacee0ec3eac752d277a608faecae97271b6ef6e20b73bce0152caf2c6b16"),
      (
        "022d62c8a67aa71119c43121d99971c10725ef68e9bb0f0817e5562d3342bc49de",
        "5e35feff827465fbde7f3057337dfef25b3b63f12b07f908bd8110099c2f82eb"),
      (
        "03f8b11d49d669f3d9a52f135a54e2750c56ee9f0c170a3ce89f7bbdf8a39c941b",
        "daefacee0ec3eac752d277a608faecae97271b6ef6e20b73bce0152caf2c6b16"),
      (
        "02456853c8fe569bacd5df5fc0c1078a7143d469a7c14f403ac5d3a8ce0ac3c955",
        "5ea4be56f38e0cc090e4aa788237d13596ed0d0c16a55807d7d5385fa2680a5c"),
      (
        "03f4dcb6c7a7bdf712e42953acb7c776553b33f198b02e6d349f68c140b73df04d",
        "19384c8367ee8b252ec7ae558cd4662a211a0d5486908a2ef3e5c672769811de"),
      (
        "0305161c005a4169e9c2b5a8befc1f77e4ca28b3e2267adcf88a2a180dd73113ea",
        "e2e4aa59ac57273aeae9691f57857f8a3891f6a9f251f018878ae6d4df429168"),
      (
        "021ad954541bbffbfb4b0949e35226e50215e1afddd52f870d4437f8691a607a0d",
        "deb707e728c60714c30b71f6ecaf1f0c61c4c46ec53ad8c0838122e89db856a6"),
      (
        "02ac6c1b8512059d6642b790c83a461f588efa0fb63272b79023a0a1ca670adfc6",
        "daf6d2ed352d8f47698e0184f3d80daab71a2d7986b2ebf76c19f3c067b3c641"),
      (
        "02c50dd0315d84994c8cbbbc17df3bce091b04b101879ec011c988cd334f7738a7",
        "f595d21ce5e9e45c607d6bbf134f54a99a355b9e3f87cb4807bb155dcb88b9ee"),
      (
        "024064193a9c042e3e88efe8b06523890ec5862462e7bd110ee980e3a6bb4ba518",
        "10e60db8d5d9e7640a56ad8b773bade9214e94de2e386097d308348de2702d47")
    )

  private def contractTransactionWithKey(commissionSecretKey: String) =
    contractTransaction.copy(params = Seq(DataEntry(ParamKey.CommissionSecretKey, StringValue(commissionSecretKey))))

  private val votingBase = VotingBase(
    pollId = "pollIdValue",
    bulletinHash = "bulletinHashValue",
    dimension = Vector(Dim(1, 1, 2), Dim(0, 1, 2), Dim(1, 2, 2)),
    status = VotingStatus.Completed,
    dateStart = Some(Instant.now().minus(2, ChronoUnit.DAYS).truncateToSeconds()),
    dateEnd = Some(Instant.now()),
    blindSigModulo = new BigInteger(
      "c8d503b962f15fcc18ae7ae2fba48eb472d8428ad6d496cf27520792a4fd4c7807e8549ef1563d8bf8fdf56e2669e3522ba1860cbc727c888cd2478ae4268929597dc8480ec570c1bb968191451c452e0dd4e651405ef5f0a76164d9715ac4739b7a440cdb7a58d82e5344be8a0ee2acde06c7af061cdb0c75958a755e4e6ddf8da24c1fea3886cb6aa2bfc9b2de8aee5a49250d2aee3a2e016bda701eba249819e78e9e27ac991842abe5075677d6b9eebb1a12d9614eaeaa6fdc2eefc2f0df73ff8955b7b6489c21c2cf8e116a5d2ce50a0cfb6d922d363758e35baee09b8f567a87ead72302d97ea2eb42eb61a619932d40b17e3787637028afb683a0ac99f5bdbfb0ab6f51622755ad04c05528a8aa267b3318e4f51e46c1a05afcd3392d3a7e83098317954207b44768b6da9eb4b39ee9b6b646dd9ba6256fb6a02e7aca2e52fd2a41b2edc2475e2744e417bb8d68e90a6eb3f7416892f185ae54e9251b6cdfb2368ca087d42a6bab9be57ed6dc299d778c76be0b3d2a8e186558a4689f",
      16
    ),
    blindSigExponent = new BigInteger("10001", 16),
    startDateIssueBallots = None,
    stopDateIssueBallots = None
  )

  private val servers: Seq[String] = Seq(senderPublicKey, "pubKey1", "pubKey2", "pubKey3")
  private val serversDE: DataEntry = DataEntry(StateKey.Servers, toJsonStr(servers))

  "all validations passed when commissionSecretKey is not specified" in {
    val state  = ContractKeysResponse(Seq(serversDE, votingBase.toDataEntry))
    val result = CommissionDecryptionHandler.call(contractTransaction, state)
    result shouldBe Right(Seq(DataEntry(StateKey.CommissionDecryption, StringValue(contractTransaction.id))))
  }

  "all validations passed when commissionSecretKey is specified" in {
    keyPairs.foreach {
      case (publicKey, privateKey) =>
        val key    = DataEntry(StateKey.CommissionKey, StringValue(publicKey))
        val state  = ContractKeysResponse(Seq(key, serversDE, votingBase.toDataEntry))
        val result = CommissionDecryptionHandler.call(contractTransactionWithKey(privateKey), state)
        result shouldBe Right(Seq(DataEntry(StateKey.CommissionDecryption, StringValue(contractTransaction.id))))
    }
  }

  "fail if commissionSecretKey is passed but commissionKey is wrong" in {
    val key    = DataEntry(StateKey.CommissionKey, StringValue("aaaa"))
    val state  = ContractKeysResponse(Seq(key, serversDE, votingBase.toDataEntry))
    val result = CommissionDecryptionHandler.call(contractTransactionWithKey("aaaa"), state)
    result shouldBe Left(InvalidCommissionSecretKey)
  }

  "fail if commissionSecretKey is passed when commissionKey is not saved in the state" in {
    val state  = ContractKeysResponse(Seq(serversDE, votingBase.toDataEntry))
    val result = CommissionDecryptionHandler.call(contractTransactionWithKey("aaaa"), state)
    result shouldBe Left(RequiredParamIsMissing(StateKey.CommissionKey.entryName))
  }

  "fail if servers are empty" in {
    val state  = ContractKeysResponse(Seq(votingBase.toDataEntry))
    val result = CommissionDecryptionHandler.call(contractTransaction, state)
    result shouldBe Left(VotingError.RequiredParamIsMissing(StateKey.Servers.entryName))
  }

  "fail if servers are not contain sender" in {
    val servers = DataEntry(StateKey.Servers, toJsonStr(Seq("otherPk")))
    val state   = ContractKeysResponse(Seq(servers, votingBase.toDataEntry))
    val result  = CommissionDecryptionHandler.call(contractTransaction, state)
    result shouldBe Left(VotingError.ServersDoNotContainSenderPubKey(senderPublicKey))
  }
}
