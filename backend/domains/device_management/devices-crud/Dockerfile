# Usa una imagen base de Golang
FROM golang:1.20

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Compilar la aplicación
RUN go build -o main .

# Exponer el puerto
EXPOSE 8084

# Ejecutar la aplicación
CMD ["./main"]
