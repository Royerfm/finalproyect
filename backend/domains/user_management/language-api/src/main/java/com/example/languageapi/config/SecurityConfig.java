package com.example.languageapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()  // Desactivar CSRF si no lo necesitas
                .authorizeRequests()
                .antMatchers("/language/update").permitAll()  // Permitir acceso sin autenticación a /language/update
                .anyRequest().authenticated()  // Requiere autenticación para el resto de los endpoints
                .and()
                .httpBasic();  // Usa autenticación básica para el ejemplo, o puedes usar JWT si lo prefieres
    }
}