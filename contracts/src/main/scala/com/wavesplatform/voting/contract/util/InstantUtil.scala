package com.wavesplatform.voting.contract.util

import cats.syntax.either.{catsSyntaxEither, catsSyntaxEitherObject}
import com.wavesplatform.voting.contract.VotingError

import java.time.{Instant, ZoneOffset}
import java.time.format.DateTimeFormatter
import play.api.libs.json.{Format, Reads, Writes}

object InstantUtil {
  val DateFormatPattern: String = "dd-MM-yyyy HH:mm:ss"

  private val dateTimeFormatter: DateTimeFormatter =
    DateTimeFormatter.ofPattern(DateFormatPattern).withZone(ZoneOffset.UTC)

  def toString(instant: Instant): String = {
    dateTimeFormatter.format(instant)
  }

  def parse(str: String): Either[VotingError.WrongDateFormat, Instant] = {
    Either
      .catchNonFatal(Instant.from(dateTimeFormatter.parse(str)))
      .leftMap(err => VotingError.WrongDateFormat(str, err.getMessage))
  }

  trait InstantJsonFormat {
    implicit val dateFormat: Format[Instant] = Format[Instant](
      Reads.instantReads[DateTimeFormatter](dateTimeFormatter),
      Writes.temporalWrites[Instant, DateTimeFormatter](dateTimeFormatter)
    )
  }
}
