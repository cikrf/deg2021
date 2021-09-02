package com.wavesplatform.voting.contract.invocation.handlers

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.{ContractKeysResponse, ContractTransaction}
import com.wavesplatform.voting.contract.{StateKey, VotingError}
import com.wavesplatform.voting.contract.invocation.{CallHandler, VotingStateService}
import com.wavesplatform.voting.contract.util.ContractKeysResponseExtension._
import com.wavesplatform.voting.contract.validators.{ServerListValidator, VotingValidators}

import java.time.Instant
import scala.collection.Seq
import scala.concurrent.Future

/**
  * Проверки:
  *
  * Проверить что отправитель указан в ключе SERVERS
  * Если dateStart уже заполнен, транзакция должна отклоняться
  *
  * Запись:
  *
  * Сохранить текущее время по часам контракта (UTC) на ключ VOTING_BASE в соответствующий параметр dateStart
  */
object StartVotingHandler extends CallHandler {
  override def getContractState(
    contractTransaction: ContractTransaction,
    stateService: VotingStateService): Future[ContractKeysResponse] = {
    stateService.requestContractKeys(contractTransaction, Seq(StateKey.VotingBase, StateKey.Servers).map(_.entryName))
  }

  override def call(
    contractTransaction: ContractTransaction,
    contractState: ContractKeysResponse): Either[VotingError, Seq[DataEntry]] = {
    for {
      votingBase <- contractState.getVotingBase
      _          <- VotingValidators.validateStartDateNotInState(votingBase)
      servers    <- contractState.getServers
      _          <- ServerListValidator.containsSenderPubKey(servers, contractTransaction.senderPublicKey)
    } yield votingBase.copy(dateStart = Some(Instant.now())).toDataEntry :: Nil
  }

  override def operationName: String = "startvoting"
}
