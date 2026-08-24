# =============================================
# Smart Dairy — Backend Multi-Stage Dockerfile
# =============================================

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY smart-dairy-common/pom.xml smart-dairy-common/
COPY smart-dairy-core/pom.xml smart-dairy-core/
COPY smart-dairy-app/pom.xml smart-dairy-app/

# Download dependencies first (cached layer)
RUN mvn dependency:go-offline -B

# Copy source and build
COPY smart-dairy-common/src smart-dairy-common/src/
COPY smart-dairy-core/src smart-dairy-core/src/
COPY smart-dairy-app/src smart-dairy-app/src/
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

RUN addgroup -S dairy && adduser -S dairy -G dairy
USER dairy

COPY --from=build /app/smart-dairy-app/target/*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
