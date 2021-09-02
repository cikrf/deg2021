package com.wavesplatform.voting.contract.invocation.handlers

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension._
import com.wavesplatform.voting.contract.validators.ServerListValidator
import com.wavesplatform.voting.contract.{StateKey, VotingError, VotingStatus}

import java.time.Instant
import scala.collection.Seq
import scala.concurrent.Future

/**
  * Проверки:
  *
  * Проверить, что отправитель указан в ключе SERVERS (новое требование)
  * Проверить что VOTING_BASE.status равно active
  *
  * Запись:
  *
  * Если VOTING_BASE.dateStart позже текущего времени (UTC по часам смарт-контракта) установить VOTING_BASE.status в значение halted
  * Если VOTING_BASE.dateStart ранее текущего времени (UTC по часам смарт-контракта) установить VOTING_BASE.status в значение completed
  * Сохранить текужее время в параметр VOTING_BASE.dateEnd
  */
object FinishVotingHandler extends CallHandler {

  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse] = {
    stateService.requestContractKeys(contractTransaction, Seq(StateKey.VotingBase, StateKey.Servers).map(_.entryName))
  }

  override def call(
    contractTransaction: ContractTransaction,
    contractState: ContractKeysResponse): Either[VotingError, Seq[DataEntry]] = {
    for {
      server     <- contractState.getServers
      _          <- ServerListValidator.containsSenderPubKey(server, contractTransaction.senderPublicKey)
      votingBase <- contractState.getVotingBase
    } yield {
      val now    = Instant.now()
      val status = if (votingBase.dateStart.exists(_.isBefore(now))) VotingStatus.Completed else VotingStatus.Halted
      votingBase.copy(status = status, dateEnd = Some(now)).toDataEntry :: Nil
    }
  }

  override def operationName: String = "finishvoting"
}
