package com.example.igclone.repository;

import com.example.igclone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
        Optional<User> findByEmail(String email);
        Optional<User> findByPhone(String phone);
        Optional<User> findByEmailOrPhone(String email, String phone);
}