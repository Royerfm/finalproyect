package com.example.sessionapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class SessionApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(SessionApiApplication.class, args);
	}
}