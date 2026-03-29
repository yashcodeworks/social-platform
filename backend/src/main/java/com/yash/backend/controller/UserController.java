package com.yash.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {
    // Note: User registration is now handled securely in AuthController (/auth/register)
}
