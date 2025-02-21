package com.example.authapi.service;

import com.example.authapi.client.UserClient;
import com.example.authapi.dto.UserDTO;
import com.example.authapi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserClient userClient;

    @Autowired
    private JwtUtil jwtUtil;

    public String login(String email, String password) {
        System.out.println("Password recibida: [" + password + "]");
        boolean result = BCrypt.checkpw("45678", "$2a$10$KdJLundT.O6zdfTgLRt4mOyQiK.g4Xbi6rqkINl2OuGQsPBGy6UFe");
        System.out.println("Resultado de checkpw: " + result);
        String testHash = BCrypt.hashpw("45678", BCrypt.gensalt());
        boolean resultado = BCrypt.checkpw("45678", testHash);
        System.out.println("Resultado de checkpw en prueba: " + resultado);


        UserDTO user = userClient.getUserByEmail(email);
        if (user != null && BCrypt.checkpw(password, user.getPassword())) {
            return jwtUtil.generateToken(email);
        }
        throw new RuntimeException("Credenciales inválidas");
    }




    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

}
