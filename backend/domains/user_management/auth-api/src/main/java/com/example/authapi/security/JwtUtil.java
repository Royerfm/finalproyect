package com.example.authapi.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    // Método para generar un token JWT
    public String generateToken(String email) {
        System.out.println("SECRET KEY: " + secretKey); // 👀 Verifica la clave secreta
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationTime))
                .sign(algorithm);
    }

    // Método para obtener los "claims" del token JWT
    public DecodedJWT getClaims(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        JWTVerifier verifier = JWT.require(algorithm)
                .build();
        return verifier.verify(token);
    }

    // Método para validar un token JWT
    // Método para validar un token JWT
    public boolean validateToken(String token) {
        try {
            System.out.println("Token recibido: " + token);  // Verifica el token recibido

            // Eliminar 'Bearer ' si está presente
            if (token.startsWith("Bearer ")) {
                token = token.replace("Bearer ", "");
            }

            // Intentar decodificar el token
            DecodedJWT decodedJWT = getClaims(token);

            // Verificar si el token ha expirado
            boolean isValid = decodedJWT.getExpiresAt().after(new Date());
            System.out.println("Token válido? " + isValid);

            return isValid;
        } catch (Exception e) {
            System.out.println("Error al validar el token: " + e.getMessage());
            return false;
        }
    }

}
