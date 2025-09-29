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
        if (userRepository.findByEmailOrPhone(user.getEmailOrPhone()).isPresent()) {
            throw new Exception("Email or Phone already exists");
        }
        return userRepository.save(user);
    }

    // Login
    public User login(String usernameOrEmail, String password) throws Exception {
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmailOrPhone(usernameOrEmail);
        }
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return user;
            } else {
                throw new Exception("Incorrect password");
            }
        } else {
            throw new Exception("User not found");
        }
    }
}