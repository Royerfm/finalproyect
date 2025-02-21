package internal

import (
	"fmt"
	"net"
	"net/url"
	"time"
)

// ScanChannels obtiene las rutas RTSP de un DVR/NVR
func ScanChannels(rtspURL string) []string {
	fmt.Printf("🔍 Escaneando canales en: %s\n", rtspURL)

	host, port, err := extractHostPort(rtspURL)
	if err != nil {
		fmt.Printf("❌ Error al extraer host y puerto: %v\n", err)
		return nil
	}

	fmt.Printf("🌐 Conectando a DVR -> Host: %s, Puerto: %s\n", host, port)

	conn, err := net.DialTimeout("tcp", net.JoinHostPort(host, port), 5*time.Second)
	if err != nil {
		fmt.Printf("❌ No se pudo conectar al DVR RTSP (%s:%s): %v\n", host, port, err)
		return nil
	}
	defer conn.Close()

	fmt.Println("✅ Conexión RTSP exitosa. Estimando número de canales...")

	// Número estimado de canales (se puede personalizar)
	estimatedChannels := 4
	fmt.Printf("🎯 Estimación de canales: %d\n", estimatedChannels)

	// Generar rutas RTSP de los canales
	var routes []string
	for i := 1; i <= estimatedChannels; i++ {
		channelURL := fmt.Sprintf("%s/channel%d", rtspURL, i)
		routes = append(routes, channelURL)
	}

	return routes
}

// extractHostPort obtiene host y puerto desde la URL RTSP
func extractHostPort(rtspURL string) (string, string, error) {
	parsedURL, err := url.Parse(rtspURL)
	if err != nil {
		return "", "", err
	}

	host := parsedURL.Hostname()
	port := parsedURL.Port()

	if port == "" {
		port = "554"
	}

	return host, port, nil
}
