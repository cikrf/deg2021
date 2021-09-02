FROM ${REGISTRY}/it/openjdk:11.0.7-jre

COPY target/scala-2.12/we-voting-contract.jar /app/we-voting-contract.jar
RUN chmod +x /app/we-voting-contract.jar

ADD run.sh /
RUN chmod +x run.sh

ENTRYPOINT ["/run.sh"]