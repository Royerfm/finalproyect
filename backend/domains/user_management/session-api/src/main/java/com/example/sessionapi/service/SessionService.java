package com.example.sessionapi.service;

import com.example.sessionapi.client.AuthClient;
import com.example.sessionapi.dto.AuthRequest;
import com.example.sessionapi.dto.AuthResponse;
import com.example.sessionapi.model.SessionLog;
import com.example.sessionapi.repository.SessionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private AuthClient authClient;

    @Autowired
    private StringRedisTemplate redisTemplate;

    public boolean registerSession(String token, String email, String ipAddress) {
        // Validar token con auth-api
        AuthRequest authRequest = new AuthRequest();
        authRequest.setEmail(email);


        AuthResponse authResponse = authClient.validateToken("Bearer " + token, authRequest);
        boolean isValid = authResponse.isValid();

        if (!isValid) {
            System.out.println("Token inválido para el usuario: " + email);
            return false;
        }

        // Revisar si el usuario ya tiene una sesión activa
        String activeSession = redisTemplate.opsForValue().get(email);
        if (activeSession != null) {
            System.out.println("Ya existe una sesión activa para el usuario: " + email);
            return false; // No permite múltiples sesiones
        }

        // Registrar en MySQL
        SessionLog sessionLog = new SessionLog();
        sessionLog.setEmail(email);
        sessionLog.setIpAddress(ipAddress);
        sessionLog.setLoginTime(LocalDateTime.now());
        sessionRepository.save(sessionLog);

        // Guardar en Redis con TTL de 1 hora
        redisTemplate.opsForValue().set(email, token, 1, TimeUnit.HOURS);

        return true;
    }

    public void logout(String email) {
        redisTemplate.delete(email); // Eliminar sesión activa
    }
}
