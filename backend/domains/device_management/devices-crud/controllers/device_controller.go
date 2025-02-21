package controllers

import (
	"bytes"
	"devices-crud/config"
	"devices-crud/models"
	"devices-crud/services"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateDevice(c *gin.Context) {
	var device models.Device

	// Leer y registrar los datos recibidos
	body, _ := c.GetRawData()

	// Volver a asignar el body para que pueda ser leído nuevamente
	c.Request.Body = io.NopCloser(bytes.NewBuffer(body))

	// Intentar enlazar el JSON a la estructura
	if err := c.ShouldBindJSON(&device); err != nil {
		fmt.Println("Error al enlazar JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	// Validar si el usuario existe en el microservicio de usuarios
	if !services.ValidateUserEmail(device.EmailUser) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El usuario no existe"})
		return
	}

	// Guardar en la base de datos
	if err := config.DB.Create(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo guardar el dispositivo"})
		return
	}

	c.JSON(http.StatusCreated, device)
}

func GetDevices(c *gin.Context) {
	var devices []models.Device
	config.DB.Find(&devices)
	c.JSON(http.StatusOK, devices)
}

func GetDevicesByUserEmail(c *gin.Context) {
	email := c.Query("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Se requiere un email para la búsqueda"})
		return
	}

	var devices []models.Device
	if err := config.DB.Where("email_user = ?", email).Find(&devices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener dispositivos"})
		return
	}

	c.JSON(http.StatusOK, devices)
}

func UpdateDevice(c *gin.Context) {
	deviceID := c.Param("id")
	var updatedDevice models.Device

	// Obtener el email del usuario desde la solicitud
	email := c.Query("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El email del usuario es obligatorio"})
		return
	}

	// Buscar el dispositivo
	var device models.Device
	if err := config.DB.Where("id = ? AND email_user = ?", deviceID, email).First(&device).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dispositivo no encontrado o sin permisos"})
		return
	}

	// Leer el JSON del request
	if err := c.ShouldBindJSON(&updatedDevice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	// Actualizar los valores permitidos
	device.SerialNumber = updatedDevice.SerialNumber
	device.UserDevice = updatedDevice.UserDevice
	device.PasswordDevice = updatedDevice.PasswordDevice
	device.NameDevice = updatedDevice.NameDevice
	device.IPAddress = updatedDevice.IPAddress
	device.RTSPPort = updatedDevice.RTSPPort

	// Guardar los cambios en la BD
	if err := config.DB.Save(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el dispositivo"})
		return
	}

	c.JSON(http.StatusOK, device)
}

func DeleteDevice(c *gin.Context) {
	deviceID := c.Param("id")

	// Obtener el email del usuario desde la solicitud
	email := c.Query("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El email del usuario es obligatorio"})
		return
	}

	// Buscar el dispositivo
	var device models.Device
	if err := config.DB.Where("id = ? AND email_user = ?", deviceID, email).First(&device).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dispositivo no encontrado o sin permisos"})
		return
	}

	// Eliminar el dispositivo
	if err := config.DB.Delete(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el dispositivo"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dispositivo eliminado correctamente"})
}

func GetDeviceByID(c *gin.Context) {
	deviceID := c.Param("id")

	var device models.Device

	// Buscar el dispositivo en la base de datos
	if err := config.DB.Where("id = ?", deviceID).First(&device).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}

	// Retornar el dispositivo encontrado
	c.JSON(http.StatusOK, device)
}
