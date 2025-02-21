# Usa una imagen base de Golang
FROM golang:1.21 AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia el código fuente
COPY . .

# Descarga las dependencias y compila
RUN go mod tidy
RUN go build -o channels-api ./cmd/main.go

# Imagen final
FROM debian:latest

# Instala FFmpeg (necesario para probar los streams RTSP)
RUN apt-get update && apt-get install -y ffmpeg

# Copia el binario desde la imagen builder
COPY --from=builder /app/channels-api /channels-api

# Define el puerto y ejecuta el API
EXPOSE 8086
CMD ["/channels-api"]
