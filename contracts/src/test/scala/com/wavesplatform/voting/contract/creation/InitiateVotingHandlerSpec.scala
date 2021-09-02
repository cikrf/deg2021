package com.wavesplatform.voting.contract.creation

import java.math.BigInteger
import java.time.Instant
import java.time.temporal.ChronoUnit

import com.google.protobuf.ByteString
import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.common.DataEntry.Value.{BinaryValue, BoolValue, StringValue}
import com.wavesplatform.protobuf.service.ContractTransaction
import com.wavesplatform.voting.contract.ParamKey._
import com.wavesplatform.voting.contract.util.DataEntriesExtension.DataEntryExtension
import com.wavesplatform.voting.contract.util.TestDateTime
import com.wavesplatform.voting.contract.util.TestDateTime._
import com.wavesplatform.voting.contract.{VotingBase, _}
import org.scalatest.freespec.AnyFreeSpec
import org.scalatest.matchers.should.Matchers

class InitiateVotingHandlerSpec extends AnyFreeSpec with Matchers {
  private val senderPublicKey = "senderPublicKey"
  private val votingBase = VotingBase(
    pollId = "pollIdValue",
    bulletinHash = "bulletinHashValue",
    dimension = Vector(Dim(1, 2, 2), Dim(0, 1, 2), Dim(1, 1, 2)),
    status = VotingStatus.Active,
    dateStart = Some(Instant.now().plus(1, ChronoUnit.DAYS).truncateToSeconds()),
    dateEnd = None,
    blindSigModulo = new BigInteger(
      "c8d503b962f15fcc18ae7ae2fba48eb472d8428ad6d496cf27520792a4fd4c7807e8549ef1563d8bf8fdf56e2669e3522ba1860cbc727c888cd2478ae4268929597dc8480ec570c1bb968191451c452e0dd4e651405ef5f0a76164d9715ac4739b7a440cdb7a58d82e5344be8a0ee2acde06c7af061cdb0c75958a755e4e6ddf8da24c1fea3886cb6aa2bfc9b2de8aee5a49250d2aee3a2e016bda701eba249819e78e9e27ac991842abe5075677d6b9eebb1a12d9614eaeaa6fdc2eefc2f0df73ff8955b7b6489c21c2cf8e116a5d2ce50a0cfb6d922d363758e35baee09b8f567a87ead72302d97ea2eb42eb61a619932d40b17e3787637028afb683a0ac99f5bdbfb0ab6f51622755ad04c05528a8aa267b3318e4f51e46c1a05afcd3392d3a7e83098317954207b44768b6da9eb4b39ee9b6b646dd9ba6256fb6a02e7aca2e52fd2a41b2edc2475e2744e417bb8d68e90a6eb3f7416892f185ae54e9251b6cdfb2368ca087d42a6bab9be57ed6dc299d778c76be0b3d2a8e186558a4689f",
      16
    ),
    blindSigExponent = new BigInteger("10001", 16),
    startDateIssueBallots = None,
    stopDateIssueBallots = None
  )

  private val servers: Seq[String] = Seq(senderPublicKey, "pubKey2", "pubKey3", "pubKey4")
  private val serverListDE         = DataEntry(StateKey.Servers, toJsonStr(servers))

  private val votersListRegistrator   = StringValue("voterPk")
  private val votersListRegistratorDE = DataEntry(StateKey.VotersListRegistrator, votersListRegistrator)

  private val issueBallotsRegistrator   = StringValue("issueBallotsPk")
  private val issueBallotsRegistratorDE = DataEntry(StateKey.IssueBallotsRegistrator, issueBallotsRegistrator)

  private val blindSigIssueRegistrator   = StringValue("blindSigPk")
  private val blindSigIssueRegistratorDE = DataEntry(StateKey.BlindSigIssueRegistrator, blindSigIssueRegistrator)

  private val jwtTokenRegistrator   = StringValue("jwtToken")
  private val jwtTokenRegistratorDE = DataEntry(StateKey.JwtTokenRegistrator, jwtTokenRegistrator)

  private val ballotReceivedCert   = StringValue("cert")
  private val ballotReceivedCertDE = DataEntry(StateKey.BallotReceivedCert, ballotReceivedCert)

  private def contractTransaction(withJwt: Boolean = false, withBallotReceivedCert: Boolean = false) =
    ContractTransaction(
      id = "id",
      `type` = 103,
      sender = "sender",
      senderPublicKey = senderPublicKey,
      contractId = "contractId",
      params = Seq(
        DataEntry(PollId, StringValue(votingBase.pollId)),
        DataEntry(BulletinHash, StringValue(votingBase.bulletinHash)),
        DataEntry(Dimension, toJsonStr(votingBase.dimension)),
        DataEntry(Servers, toJsonStr(servers)),
        DataEntry(BlindSigModulo, BinaryValue(ByteString.copyFrom(votingBase.blindSigModulo.toByteArray))),
        DataEntry(BlindSigExponent, BinaryValue(ByteString.copyFrom(votingBase.blindSigExponent.toByteArray))),
        DataEntry(VotersListRegistrator, votersListRegistrator),
        DataEntry(IssueBallotsRegistrator, issueBallotsRegistrator),
        DataEntry(BlindSigIssueRegistrator, blindSigIssueRegistrator),
        DataEntry("isRevoteBlocked", BoolValue(votingBase.isRevoteBlocked))
      ) ++ (if (withJwt) Seq(DataEntry(JwtTokenRegistrator, jwtTokenRegistrator)) else Nil)
        ++ (if (withBallotReceivedCert) Seq(DataEntry(BallotReceivedCert, ballotReceivedCert)) else Nil)
        ++ votingBase.dateStart.map(d => DataEntry(DateStart, StringValue(TestDateTime.toString(d)))),
      fee = 100000000L,
      version = 2,
      proofs = ByteString.EMPTY,
      timestamp = Instant.now().toEpochMilli,
      feeAssetId = None,
      data = ContractTransaction.Data.Empty
    )

  "validate initiateContractTransaction and extract parameters" in {
    InitiateVotingHandler.handle(contractTransaction()) shouldBe
      Right(
        Seq(
          votingBase.toDataEntry,
          serverListDE,
          votersListRegistratorDE,
          issueBallotsRegistratorDE,
          blindSigIssueRegistratorDE
        )
      )
  }

  "validate initiateContractTransaction and extract parameters with JWT" in {
    InitiateVotingHandler.handle(contractTransaction(withJwt = true)) shouldBe
      Right(
        Seq(
          votingBase.toDataEntry,
          serverListDE,
          votersListRegistratorDE,
          issueBallotsRegistratorDE,
          blindSigIssueRegistratorDE,
          jwtTokenRegistratorDE
        )
      )
  }

  "validate initiateContractTransaction and extract parameters with BallotReceivedCert" in {
    InitiateVotingHandler.handle(contractTransaction(withBallotReceivedCert = true)) shouldBe
      Right(
        Seq(
          votingBase.toDataEntry,
          serverListDE,
          votersListRegistratorDE,
          issueBallotsRegistratorDE,
          blindSigIssueRegistratorDE,
          ballotReceivedCertDE
        )
      )
  }
}
