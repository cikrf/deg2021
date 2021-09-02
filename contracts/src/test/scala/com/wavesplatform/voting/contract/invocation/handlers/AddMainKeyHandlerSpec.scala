package com.wavesplatform.voting.contract.invocation.handlers

import com.google.protobuf.ByteString
import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.util.ContractTransactionExtension._
import com.wavesplatform.voting.contract.util.DataEntriesExtension.DataEntryExtension
import com.wavesplatform.voting.contract.util.TestDateTime._
import com.wavesplatform.voting.contract.{VotingBase, _}
import org.scalatest.freespec.AnyFreeSpec
import org.scalatest.matchers.should.Matchers

import java.math.BigInteger
import java.time.Instant
import java.time.temporal.ChronoUnit

class AddMainKeyHandlerSpec extends AnyFreeSpec with Matchers {
  private val senderPublicKey    = "senderPublicKey"
  private val mainKeyValue       = "mainKey_value"
  private val commissionKeyValue = "commissionKey_value"
  private val dkgKeyValue        = "dkgKey_value"

  private val contractTransaction = ContractTransaction(
    id = "id",
    `type` = 104,
    sender = "sender",
    senderPublicKey = senderPublicKey,
    contractId = "contractId",
    params = Seq(
      DataEntry(ParamKey.MainKey, DataEntry.Value.StringValue(mainKeyValue)),
      DataEntry(ParamKey.CommissionKey, DataEntry.Value.StringValue(commissionKeyValue)),
      DataEntry(ParamKey.DkgKey, DataEntry.Value.StringValue(dkgKeyValue))
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
    dimension = Vector(Dim(1, 1, 2), Dim(0, 1, 2), Dim(1, 2, 2)),
    status = VotingStatus.Active,
    dateStart = Some(Instant.now().plus(1, ChronoUnit.DAYS).truncateToSeconds()),
    dateEnd = None,
    blindSigModulo = new BigInteger(
      "c8d503b962f15fcc18ae7ae2fba48eb472d8428ad6d496cf27520792a4fd4c7807e8549ef1563d8bf8fdf56e2669e3522ba1860cbc727c888cd2478ae4268929597dc8480ec570c1bb968191451c452e0dd4e651405ef5f0a76164d9715ac4739b7a440cdb7a58d82e5344be8a0ee2acde06c7af061cdb0c75958a755e4e6ddf8da24c1fea3886cb6aa2bfc9b2de8aee5a49250d2aee3a2e016bda701eba249819e78e9e27ac991842abe5075677d6b9eebb1a12d9614eaeaa6fdc2eefc2f0df73ff8955b7b6489c21c2cf8e116a5d2ce50a0cfb6d922d363758e35baee09b8f567a87ead72302d97ea2eb42eb61a619932d40b17e3787637028afb683a0ac99f5bdbfb0ab6f51622755ad04c05528a8aa267b3318e4f51e46c1a05afcd3392d3a7e83098317954207b44768b6da9eb4b39ee9b6b646dd9ba6256fb6a02e7aca2e52fd2a41b2edc2475e2744e417bb8d68e90a6eb3f7416892f185ae54e9251b6cdfb2368ca087d42a6bab9be57ed6dc299d778c76be0b3d2a8e186558a4689f",
      16),
    blindSigExponent = new BigInteger("10001", 16),
    startDateIssueBallots = None,
    stopDateIssueBallots = None
  )

  private val servers: Seq[String] = Seq(senderPublicKey, "pubKey1", "pubKey2", "pubKey3")
  private val serversDE: DataEntry = DataEntry(StateKey.Servers, toJsonStr(servers))

  "all validations passed" in {
    val contractState: ContractKeysResponse =
      ContractKeysResponse(serversDE +: Seq(votingBase.toDataEntry))
    val callRes = AddMainKeyHandler.call(contractTransaction, contractState)
    callRes shouldBe 'right
    callRes.right.get should contain theSameElementsAs Seq(
      DataEntry(StateKey.MainKey, DataEntry.Value.StringValue(mainKeyValue)),
      DataEntry(StateKey.CommissionKey, DataEntry.Value.StringValue(commissionKeyValue)),
      DataEntry(StateKey.DKGKey, DataEntry.Value.StringValue(dkgKeyValue))
    )
  }

  "there is no 'mainKey' in contractTransaction" in {
    val contractState: ContractKeysResponse =
      ContractKeysResponse(serversDE +: Seq(votingBase.toDataEntry))
    val contractTransactionWithoutMainKey =
      contractTransaction.replaceDataEntryParam(ParamKey.MainKey, DataEntry.Value.Empty)
    val callRes = AddMainKeyHandler.call(contractTransactionWithoutMainKey, contractState)
    callRes shouldBe 'left
    callRes.left.get shouldBe VotingError.RequiredParamIsMissing(ParamKey.MainKey)
  }

  "voting already started" in {
    val votingBaseWithUpdatedTime = votingBase.copy(dateStart = Some(Instant.now().minus(1, ChronoUnit.DAYS)))
    val contractState: ContractKeysResponse =
      ContractKeysResponse(serversDE +: Seq(votingBaseWithUpdatedTime.toDataEntry))
    val callRes = AddMainKeyHandler.call(contractTransaction, contractState)
    callRes shouldBe 'left
    callRes.left.get shouldBe VotingError.VotingAlreadyStarted
  }
}
