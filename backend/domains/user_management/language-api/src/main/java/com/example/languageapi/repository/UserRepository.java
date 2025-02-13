package com.example.languageapi.repository;

import com.example.languageapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    // Consultar por email
    User findByEmail(String email);
}