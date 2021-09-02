package com.wavesplatform.voting.contract.util

import java.time.{Instant, ZoneOffset}
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

object TestDateTime {
  private val dateFormatPattern = "dd-MM-yyyy HH:mm:ss"
  private val dateTimeFormatter: DateTimeFormatter =
    DateTimeFormatter.ofPattern(dateFormatPattern).withZone(ZoneOffset.UTC)

  def toString(instant: Instant): String = {
    dateTimeFormatter.format(instant)
  }

  def parse(str: String): Instant = {
    Instant.from(dateTimeFormatter.parse(str))
  }

  implicit class InstantExtension(val value: Instant) extends AnyVal {
    def truncateToSeconds(): Instant = {
      value.truncatedTo(ChronoUnit.SECONDS)
    }
  }
}
