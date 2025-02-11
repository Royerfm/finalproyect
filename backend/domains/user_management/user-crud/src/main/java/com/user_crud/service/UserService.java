package com.user_crud.service;

import com.user_crud.model.User;
import com.user_crud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Obtener todos los usuarios
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Obtener un usuario por ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Crear un nuevo usuario
    public User createUser(User user) {
        // Encriptar la contraseña antes de guardar
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword); // Actualiza la contraseña con la versión encriptada
        return userRepository.save(user);
    }

    // Actualizar un usuario existente
    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            // Encriptar la nueva contraseña si se proporciona
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                String encryptedPassword = passwordEncoder.encode(userDetails.getPassword());
                user.setPassword(encryptedPassword);
            }
            return userRepository.save(user);
        }).orElse(null);
    }

    // Obtener un usuario por email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Eliminar un usuario
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
