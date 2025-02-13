package com.example.authapi.controller;

import com.example.authapi.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String token = authService.login(credentials.get("email"), credentials.get("password"));
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido o ausente"));
        }

        String token = authHeader.substring(7); // Extraer el token sin "Bearer "
        boolean isValid = authService.validateToken(token);

        if (isValid) {
            return ResponseEntity.ok(Map.of("valid", true, "message", "Token válido"));
        } else {
            return ResponseEntity.status(401).body(Map.of("valid", false, "message", "Token inválido o expirado"));
        }
    }
}
