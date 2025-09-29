package com.example.igclone.controller;

import com.example.igclone.model.User;
import com.example.igclone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    // Signup API
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User savedUser = userService.signup(user);
            return ResponseEntity.ok(Map.of("message", "Signup successful"));
        } catch (Exception e) {
            String field = e.getMessage().contains("Username") ? "username" : "email";
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "field", field));
        }
    }

    // Login API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        try {
            String usernameOrEmail = payload.get("username");
            String password = payload.get("password");
            User user = userService.login(usernameOrEmail, password);
            return ResponseEntity.ok(Map.of("message", "Login successful"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }
}