package com.example.languageapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.example.languageapi.repository")
@EntityScan(basePackages = "com.example.languageapi.model")// Asegúrate de que el repositorio esté siendo escaneado
public class LanguageApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(LanguageApiApplication.class, args);
	}
}
