package com.example.sessionapi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_logs")
public class SessionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String ipAddress;
    private LocalDateTime loginTime; // Verifica que esta variable exista

    // Constructor vacío
    public SessionLog() {}

    // Constructor con parámetros
    public SessionLog(String email, String ipAddress, LocalDateTime loginTime) {
        this.email = email;
        this.ipAddress = ipAddress;
        this.loginTime = loginTime;
    }

    // Getters y Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDateTime getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(LocalDateTime loginTime) {
        this.loginTime = loginTime;
    }
}
