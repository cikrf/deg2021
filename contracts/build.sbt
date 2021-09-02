enablePlugins(GitVersioning, BuildInfoPlugin)

git.baseVersion := "1.0.0"
git.useGitDescribe := true
version in ThisBuild := {
  val suffix         = git.makeUncommittedSignifierSuffix(git.gitUncommittedChanges.value, Some("DIRTY"))
  val releaseVersion = git.releaseVersion(git.gitCurrentTags.value, git.gitTagToVersionNumber.value, suffix)
  lazy val describedExtended = git.gitDescribedVersion.value.map { described =>
    val commitHashLength                          = 7
    val (tagVersionWithoutCommitHash, commitHash) = described.splitAt(described.length - commitHashLength)
    val tagVersionWithCommitsAhead                = tagVersionWithoutCommitHash.dropRight(2)
    s"$tagVersionWithCommitsAhead-$commitHash" + suffix
  }
  releaseVersion.orElse(describedExtended).getOrElse(git.formattedDateVersion.value)
}

lazy val commonSettings = Seq(
  name := "we-voting-contract",
  organization := "com.wavesplatform",
  organizationName := "Waves Enterprise",
  scalaVersion := "2.12.10",
  scalafmtOnCompile := true,
  scalacOptions ++= Seq(
    "-feature",
    "-deprecation",
    "-language:higherKinds",
    "-language:implicitConversions",
    "-Ywarn-unused:-implicits",
    "-Yresolve-term-conflict:object",
    "-Ypartial-unification",
    "-Xlint",
  )
)

akkaGrpcGeneratedLanguages := Seq(AkkaGrpc.Scala)
akkaGrpcGeneratedSources := Seq(AkkaGrpc.Client)

lazy val app = project
  .in(file("."))
  .enablePlugins(AkkaGrpcPlugin)
  .settings(
    test in assembly := {},
    buildInfoKeys := Seq[BuildInfoKey](name, version),
    buildInfoPackage := "com.wavesplatform.voting.contract",
    PB.deleteTargetDirectory := false,
    mainClass in assembly := Some("com.wavesplatform.voting.contract.Main"),
    assemblyJarName in assembly := "we-voting-contract.jar",
    assemblyMergeStrategy in assembly := {
      case PathList("com", "google", "protobuf", xs @ _*) => MergeStrategy.first
      case "application.conf"                             => MergeStrategy.concat
      case "module-info.class"                            => MergeStrategy.discard
      case x =>
        val oldStrategy = (assemblyMergeStrategy in assembly).value
        oldStrategy(x)
    },
    libraryDependencies ++=
      Dependencies.akka ++
        Dependencies.json ++
        Dependencies.cats ++
        Dependencies.protobuf ++
        Dependencies.scalatest ++
        Dependencies.logging ++
        Dependencies.bouncyCastle
  )
  .settings(commonSettings: _*)

libraryDependencies ++= Seq(
  compilerPlugin("com.github.ghik" % "silencer-plugin" % "1.4.3" cross CrossVersion.full),
  "com.github.ghik" % "silencer-lib" % "1.4.3" % Provided cross CrossVersion.full
)

scalacOptions += "-P:silencer:globalFilters=Marked as deprecated in proto file"
