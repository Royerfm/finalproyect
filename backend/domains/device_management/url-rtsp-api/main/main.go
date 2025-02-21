package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	_ "strings" // Importar strings para limpiar deviceId

	"github.com/gin-contrib/cors" // Middleware de CORS
	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"github.com/joho/godotenv"
)

// Estructura del dispositivo (coincide con devices-crud)
type Device struct {
	ID             uint   `json:"id"`
	SerialNumber   string `json:"serial_number"`
	UserDevice     string `json:"user_device"`
	PasswordDevice string `json:"password_device"`
	NameDevice     string `json:"name_device"`
	IPAddress      string `json:"ip_address"`
	RTSPPort       int    `json:"rtsp_port"`
	EmailUser      string `json:"email_user"`
}

// Respuesta del API
type RTSPResponse struct {
	RTSPURL string `json:"rtsp_url"`
}

func getRTSPURL(c *gin.Context) {
	// Obtener y limpiar deviceId
	deviceID := strings.TrimSpace(c.Param("deviceId"))

	// Obtener la URL base del servicio devices-crud
	devicesCrudURL := os.Getenv("DEVICES_CRUD_URL")
	if devicesCrudURL == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se ha configurado DEVICES_CRUD_URL"})
		return
	}

	// Crear cliente HTTP con Resty
	client := resty.New()
	var device Device

	// Generar la URL correctamente
	requestURL := fmt.Sprintf("%s/%s", devicesCrudURL, deviceID)
	log.Printf("📡 URL de solicitud a devices-crud: %s", requestURL)

	// Realizar la petición GET a devices-crud
	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetResult(&device). // Intenta deserializar la respuesta en `device`
		Get(requestURL)

	// Manejar errores en la petición
	if err != nil {
		log.Printf("❌ Error en la solicitud HTTP: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error en la comunicación con devices-crud"})
		return
	}

	// Verificar el código de estado de la respuesta
	if resp.StatusCode() != http.StatusOK {
		log.Printf("⚠️ Respuesta no esperada de devices-crud: %d - %s", resp.StatusCode(), resp.String())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo obtener la información del dispositivo", "status": resp.StatusCode(), "body": resp.String()})
		return
	}

	// Si `device` está vacío, registrar el error
	if device.ID == 0 {
		log.Printf("⚠️ Dispositivo no encontrado o respuesta inválida: %v", resp.String())
		c.JSON(http.StatusNotFound, gin.H{"error": "Dispositivo no encontrado"})
		return
	}

	// Construir la URL RTSP
	rtspURL := fmt.Sprintf("rtsp://%s:%s@%s:%d", device.UserDevice, device.PasswordDevice, device.IPAddress, device.RTSPPort)

	// Enviar la respuesta con la URL RTSP
	c.JSON(http.StatusOK, RTSPResponse{RTSPURL: rtspURL})
}

func main() {
	// Cargar variables de entorno desde .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error cargando el archivo .env")
	}

	// Inicializar router Gin
	r := gin.Default()

	// Configurar CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Permitir todas las solicitudes desde local host
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Definir rutas
	r.GET("/rtsp/:deviceId", getRTSPURL)

	// Iniciar servidor en el puerto 8085
	port := "8085"

	r.Run(":" + port)
}
