package com.example.authapi.service;

public class SecurityConfig {
}
package com.example.authapi.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Deshabilitar CSRF para las APIs REST, ya que no lo necesitamos en este caso
        http.csrf().requireCsrfProtectionMatcher(request -> false)  // Desactiva CSRF de forma explícita

                .authorizeRequests()
                // Permitimos acceso a /auth/login sin autenticación
                .antMatchers(HttpMethod.POST, "/auth/login").permitAll()
                // Aseguramos que todas las demás rutas requieren autenticación
                .anyRequest().authenticated();

        return http.build();
    }
}
