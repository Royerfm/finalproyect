package handlers

import (
	"channels-api/internal"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Estructura del request JSON
type ScanRequest struct {
	RTSPUrl string `json:"rtsp_url"`
}

// Estructura de la respuesta JSON
type ScanResponse struct {
	Routes []string `json:"routes"`
}

// ScanHandler maneja la solicitud para escanear canales RTSP
func ScanHandler(c *gin.Context) {
	var request ScanRequest

	// Validar la solicitud JSON
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Formato JSON inválido"})
		return
	}

	if request.RTSPUrl == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "La URL RTSP es obligatoria"})
		return
	}

	// Obtener las rutas RTSP de los canales
	routes := internal.ScanChannels(request.RTSPUrl)

	if len(routes) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No se encontraron canales RTSP"})
		return
	}

	c.JSON(http.StatusOK, ScanResponse{Routes: routes})
}
