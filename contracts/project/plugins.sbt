Seq(
  "com.typesafe.sbt"        % "sbt-git"       % "1.0.0",
  "org.scalameta"           % "sbt-scalafmt"  % "2.2.0",
  "com.eed3si9n"            % "sbt-buildinfo" % "0.9.0",
  "com.lightbend.akka.grpc" % "sbt-akka-grpc" % "0.7.3",
  "com.eed3si9n"            % "sbt-assembly"  % "0.14.10"
).map(addSbtPlugin)
