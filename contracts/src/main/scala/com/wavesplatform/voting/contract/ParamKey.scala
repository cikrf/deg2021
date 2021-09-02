package com.wavesplatform.voting.contract

// TODO 01.02.2021 izhavoronkov: add types and converter to DataEntry/from JSON
sealed trait ParamKey {
  val name: String = {
    val n = this.getClass.getSimpleName.replaceAll("\\$", "")
    n.head.toLower + n.tail
  }
}

object ParamKey {
  implicit def paramToStr(param: ParamKey): String = param.name

  case object Operation                extends ParamKey
  case object PollId                   extends ParamKey
  case object BulletinHash             extends ParamKey
  case object Dimension                extends ParamKey
  case object BlindSigModulo           extends ParamKey
  case object BlindSig                 extends ParamKey
  case object BlindSigExponent         extends ParamKey
  case object DateStart                extends ParamKey
  case object DateEnd                  extends ParamKey
  case object Servers                  extends ParamKey
  case object VotersListRegistrator    extends ParamKey
  case object IssueBallotsRegistrator  extends ParamKey
  case object BlindSigIssueRegistrator extends ParamKey
  case object JwtTokenRegistrator      extends ParamKey
  case object MainKey                  extends ParamKey
  case object CommissionKey            extends ParamKey
  case object CommissionSecretKey      extends ParamKey
  case object DkgKey                   extends ParamKey
  case object VotersCount              extends ParamKey
  case object UserIdHashes             extends ParamKey
  case object Data                     extends ParamKey
  case object Results                  extends ParamKey
  case object StartDateIssueBallots    extends ParamKey
  case object StopDateIssueBallots     extends ParamKey
  case object BallotReceivedCert       extends ParamKey
}
