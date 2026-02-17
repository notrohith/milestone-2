package com.rideshare.controller;

import com.rideshare.dto.FullRegistrationRequest;
import com.rideshare.dto.SyncUserRequest;
import com.rideshare.model.User;
import com.rideshare.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/sync")
    public ResponseEntity<User> syncUser(@RequestBody SyncUserRequest request) {
        return ResponseEntity.ok(authService.syncUser(request));
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody FullRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerUser(request));
    }
}
