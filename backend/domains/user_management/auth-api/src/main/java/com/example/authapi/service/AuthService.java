package com.example.authapi.service;

import com.example.authapi.client.UserClient;
import com.example.authapi.dto.UserDTO;
import com.example.authapi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserClient userClient;

    @Autowired
    private JwtUtil jwtUtil;

    public String login(String email, String password) {
        UserDTO user = userClient.getUserByEmail(email);

        if (user != null && BCrypt.checkpw(password, user.getPassword())) {
            return jwtUtil.generateToken(email);
        }
        throw new RuntimeException("Credenciales inválidas");
    }
}
