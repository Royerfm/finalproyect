# Imagen base
FROM golang:1.20

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos al contenedor
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Construir la aplicación
RUN go build -o image-api

# Exponer puerto
EXPOSE 8087

# Comando de inicio
CMD ["./image-api"]
