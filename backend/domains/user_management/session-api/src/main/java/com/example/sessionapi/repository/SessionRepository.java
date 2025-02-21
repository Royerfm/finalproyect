package com.example.sessionapi.repository;

import com.example.sessionapi.model.SessionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<SessionLog, Long> {
}
