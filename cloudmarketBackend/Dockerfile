# ---------- build ----------
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# baixa dependências numa camada separada (cache)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
# no Windows o mvnw pode vir com CRLF e sem permissão de execução
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw -q -B dependency:go-offline

COPY src/ src/
RUN ./mvnw -q -B -DskipTests package && cp target/*.jar app.jar

# ---------- runtime ----------
FROM eclipse-temurin:25-jre
WORKDIR /app
RUN useradd --system --uid 1001 spring
USER spring

COPY --from=build /app/app.jar app.jar

# plano gratuito do Render tem 512MB: limita o heap a ~70% do container
ENV JAVA_OPTS="-XX:MaxRAMPercentage=70 -XX:+UseSerialGC -Xss512k"
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
