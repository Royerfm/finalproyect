package services

import (
	"fmt"
	"net/http"
	"os"

	"github.com/go-resty/resty/v2"
)

func ValidateUserEmail(email string) bool {
	client := resty.New()
	url := fmt.Sprintf("%s/%s", os.Getenv("USER_SERVICE_URL"), email)

	resp, err := client.R().Get(url)

	if err != nil {

		return false
	}

	fmt.Println("📡 Respuesta del microservicio de usuarios - Código de estado:", resp.StatusCode())

	if resp.StatusCode() != http.StatusOK {

		return false
	}

	return true
}
