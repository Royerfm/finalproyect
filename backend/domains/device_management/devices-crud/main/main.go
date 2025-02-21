package main

import (
	"devices-crud/config"
	"devices-crud/controllers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

func main() {
	config.ConnectDatabase()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Permite peticiones desde el frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.POST("/devices", controllers.CreateDevice)
	r.GET("/devices", controllers.GetDevices)
	r.GET("/devices/user", controllers.GetDevicesByUserEmail)
	r.PUT("/devices/:id", controllers.UpdateDevice)
	r.DELETE("/devices/:id", controllers.DeleteDevice)
	r.GET("/devices/:id", controllers.GetDeviceByID)

	r.Run(":8084")
}
