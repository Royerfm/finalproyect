package com.example.authapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.security.crypto.bcrypt.BCrypt;

@SpringBootApplication
@EnableFeignClients
public class AuthApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(AuthApiApplication.class, args);

	}
}
