FROM openjdk:17-jdk-slim

COPY target/language-api-0.0.1-SNAPSHOT.jar language-api.jar

# Exponer el puerto en el que corre la app
EXPOSE 8083

# Comando para ejecutar el microservicio
ENTRYPOINT ["java", "-jar", "/language-api.jar"]
