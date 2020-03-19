FROM openjdk:8-jdk-alpine
ENV ElasticsearchHost ${ElasticsearchHost}
ADD troubleshooting/troubleshootingtool/build/libs/troubleshootingtool-0.0.1.jar troubleshootingtool-0.0.1.jar
EXPOSE 4343
ENTRYPOINT ["java","-jar","troubleshootingtool-0.0.1.jar"]
