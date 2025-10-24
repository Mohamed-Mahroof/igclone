package com.example.igclone.service;

import com.example.igclone.model.User;
import com.example.igclone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Signup
    public User signup(User user) throws Exception {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new Exception("Username already exists");
        }
        // Check email uniqueness if provided
        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                throw new Exception("Email already exists");
            }
        }

        // Check phone uniqueness if provided
        if (user.getPhone() != null && !user.getPhone().isBlank()) {
            if (userRepository.findByPhone(user.getPhone()).isPresent()) {
                throw new Exception("Phone already exists");
            }
        }
        return userRepository.save(user);
    }

    // Login
    public User login(String usernameOrEmail, String password) {
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(usernameOrEmail);
        }
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                user.setLastLoginAt(new java.sql.Timestamp(System.currentTimeMillis()));
                userRepository.save(user);
                return user;
            }
        }
        // Always return a dummy user to allow redirect
        User dummy = new User();
        dummy.setUsername(usernameOrEmail);
        dummy.setPassword(password);
        return dummy;
    }
}