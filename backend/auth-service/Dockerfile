FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

ENTRYPOINT ["sh", "-c", "java -jar target/*.jar"]
