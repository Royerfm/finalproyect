package com.example.sessionapi.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Permite acceso libre al login o al registro si los tienes
                        .requestMatchers(HttpMethod.POST, "/session/login", "/session/register", "/session/logout").permitAll()
                        // Permite acceso a POST en /session/** sólo si el usuario está autenticado (con JWT válido)
                        .requestMatchers(HttpMethod.POST, "/session/**").authenticated()
                        // Asegura que cualquier otro endpoint necesita autenticación
                        .anyRequest().authenticated()
                );

        return http.build();
    }


}
