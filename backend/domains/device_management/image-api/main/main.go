package main

import (
	"image-api/config"
	"image-api/handlers"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()
	r := gin.Default()

	// Configurar CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{config.AppConfig.CorsAllowedOrigins},
		AllowMethods:     []string{"GET"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Rutas
	r.GET("/snapshot", handlers.SnapshotHandler)

	// Iniciar servidor
	port := ":" + config.AppConfig.Port
	log.Println("🚀 Servidor corriendo en http://localhost" + port)
	r.Run(port)
}
