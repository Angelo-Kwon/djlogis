# ---- build ----
FROM gradle:7.6.4-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle clean bootJar -x test

# ---- run ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/build/libs/gj_op-0.0.1.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75.0","-jar","/app/app.jar"]
