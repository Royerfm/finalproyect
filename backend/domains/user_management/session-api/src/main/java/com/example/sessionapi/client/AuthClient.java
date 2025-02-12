package com.example.sessionapi.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import com.example.sessionapi.dto.AuthRequest;
import com.example.sessionapi.dto.AuthResponse;

@FeignClient(name = "auth-api", url = "http://localhost:8081")
public interface AuthClient {

    @PostMapping("/auth/validate-token")
    AuthResponse validateToken(@RequestHeader("Authorization") String token, @RequestBody AuthRequest request);
}
