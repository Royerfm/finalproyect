package com.example.languageapi.service;

import com.example.languageapi.dto.UserDTO;
import com.example.languageapi.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class LanguageService {

    @Autowired
    private RestTemplate restTemplate;

    private final String userCrudBaseUrl = "http://localhost:8080/users"; // URL base de user-crud

    public String updateLanguage(UserDTO userDTO) {
        // Realizar la solicitud GET al microservicio user-crud
        String url = userCrudBaseUrl + "/email/" + userDTO.getEmail();
        ResponseEntity<User> response = restTemplate.getForEntity(url, User.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            // El usuario fue encontrado, ahora se actualiza el idioma
            User user = response.getBody();
            user.setLanguage(userDTO.getLanguage());

            // Guardar el usuario actualizado en la base de datos de language-api (aquí podrías llamar a otro repositorio)
            // Suponiendo que tienes un repositorio de user en language-api
            // userRepository.save(user);

            return "Idioma actualizado a " + userDTO.getLanguage();
        } else {
            return "Usuario no encontrado";
        }
    }
}