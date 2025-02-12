package com.example.sessionapi.controller;

import com.example.sessionapi.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/session")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> request) {
        boolean success = sessionService.registerSession(token, request.get("email"), request.get("ip"));
        if (success) {
            return ResponseEntity.ok("Inicio de sesión registrado");
        }
        return ResponseEntity.badRequest().body("Sesión activa detectada o token inválido");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        sessionService.logout(request.get("email"));
        return ResponseEntity.ok("Sesión cerrada");
    }
}
