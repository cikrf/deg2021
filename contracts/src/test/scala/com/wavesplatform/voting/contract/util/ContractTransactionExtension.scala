package com.wavesplatform.voting.contract.util

import com.wavesplatform.protobuf.common.DataEntry
import com.wavesplatform.protobuf.service.ContractTransaction

object ContractTransactionExtension {
  implicit class ContractTransactionExtensionRealisation(val value: ContractTransaction) extends AnyVal {
    def replaceDataEntryParam(paramName: String, replaceWith: DataEntry.Value): ContractTransaction = {
      val paramsWithout = value.params.filterNot(p => p.key == paramName)
      value.copy(params = DataEntry(paramName, replaceWith) +: paramsWithout)
    }
  }
}
