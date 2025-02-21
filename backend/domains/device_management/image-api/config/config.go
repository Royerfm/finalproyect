package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Configuración global
type Config struct {
	Port               string
	CorsAllowedOrigins string
	FFmpegPath         string
}

var AppConfig Config

// Carga las variables de entorno desde `.env`
func LoadConfig() {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No se encontró el archivo .env, usando valores predeterminados")
	}

	AppConfig = Config{
		Port:               getEnv("PORT", "8087"),
		CorsAllowedOrigins: getEnv("CORS_ALLOWED_ORIGINS", "*"),
		FFmpegPath:         getEnv("FFMPEG_PATH", "/usr/bin/ffmpeg"),
	}
}

// Obtiene una variable de entorno con un valor por defecto
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
