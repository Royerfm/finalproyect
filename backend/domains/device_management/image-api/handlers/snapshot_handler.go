package handlers

import (
	"image-api/utils"
	"log"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

// Maneja la solicitud GET /snapshot
func SnapshotHandler(c *gin.Context) {
	rtspURL := c.Query("rtsp_url")
	if rtspURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Se requiere el parámetro rtsp_url"})
		return
	}

	// Decodificar la URL RTSP por si tiene caracteres especiales (&, ?, etc.)
	decodedURL, err := url.QueryUnescape(rtspURL)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error al decodificar la URL RTSP"})
		return
	}

	log.Println("🔹 Capturando snapshot de:", decodedURL)

	// Captura snapshot
	imageData, err := utils.CaptureSnapshot(decodedURL)
	if err != nil {
		log.Println("❌ Error capturando snapshot:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo generar el snapshot"})
		return
	}

	// Enviar la imagen como respuesta
	c.Header("Content-Type", "image/jpeg")
	c.Writer.Write(imageData)
}
