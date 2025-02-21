package utils

import (
	"bytes"
	"fmt"
	"os/exec"
	"runtime"
)

// Detecta la ruta de ffmpeg automáticamente dependiendo del SO
func getFFmpegPath() string {
	if runtime.GOOS == "windows" {
		// Windows - usa la ruta absoluta si es necesario
		return "C:\\Users\\DETPC\\ffmpeg\\ffmpeg-2025-02-13-git-19a2d26177-full_build\\bin\\ffmpeg.exe"
	}
	// En Linux/Docker, ffmpeg suele estar en /usr/bin/ffmpeg o en el $PATH
	return "ffmpeg"
}

// Captura un snapshot del stream RTSP usando ffmpeg
func CaptureSnapshot(rtspURL string) ([]byte, error) {
	ffmpegPath := getFFmpegPath()

	cmd := exec.Command(ffmpegPath, "-y", "-rtsp_transport", "tcp", "-i", rtspURL, "-frames:v", "1", "-q:v", "2", "-update", "1", "-f", "image2", "pipe:1")

	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr // Captura errores de FFmpeg

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("error ejecutando ffmpeg: %v, detalles: %s", err, stderr.String())
	}

	return out.Bytes(), nil
}
