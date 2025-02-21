# Imagen base de Golang
FROM golang:1.20

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Compilar el programa
RUN go build -o main .

# Exponer el puerto
EXPOSE 8085

# Ejecutar la aplicación
CMD ["./main"]
