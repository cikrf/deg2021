package com.wavesplatform.voting.contract.invocation

import com.wavesplatform.protobuf.service._
import com.wavesplatform.voting.contract._

import scala.concurrent.{ExecutionContext, Future}

class VotingStateService(client: ContractServiceClient, authToken: String)(implicit ec: ExecutionContext) {

  def requestContractKeys(contractTransaction: ContractTransaction, keys: Seq[String]): Future[ContractKeysResponse] = {
    client
      .getContractKeys()
      .withAuth(authToken)
      .invoke(ContractKeysRequest(contractTransaction.contractId, keysFilter = Some(KeysFilter(keys))))
  }
}

object VotingStateService {
  val EmptyContractKeysResponse: Future[ContractKeysResponse] = Future.successful(ContractKeysResponse())
}
