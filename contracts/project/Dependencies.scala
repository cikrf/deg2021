import sbt._

object Dependencies {

  lazy val akkaVersion     = "2.6.3"
  lazy val akkaGrpcVersion = "0.7.3"

  lazy val akka = Seq(
    "com.typesafe.akka" %% "akka-discovery" % akkaVersion
  )

  lazy val json = Seq(
    "com.typesafe.play" %% "play-json"                % "2.8.1",
    "org.julienrf"      %% "play-json-derived-codecs" % "7.0.0",
    "com.beachape"      %% "enumeratum-play-json"     % "1.5.17"
  )

  lazy val cats = Seq("org.typelevel" %% "cats-core" % "2.0.0")

  lazy val protobuf = Seq(
    "com.thesamet.scalapb" %% "scalapb-runtime" % scalapb.compiler.Version.scalapbVersion % "protobuf")

  lazy val scalatest =
    Seq("org.scalatest" %% "scalatest" % "3.1.1" % Test, "org.scalamock" %% "scalamock" % "4.4.0" % Test)

  lazy val logging =
    Seq("ch.qos.logback" % "logback-classic" % "1.2.3", "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2")

  lazy val bouncyCastle = Seq(
    "org.bouncycastle" % "bcprov-jdk15on" % "1.60",
    "org.bouncycastle" % "bcpkix-jdk15on" % "1.60"
  )
}
