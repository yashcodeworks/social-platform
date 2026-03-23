package com.yash.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yash.backend.entity.Role;
import com.yash.backend.entity.User;
import com.yash.backend.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	
	@PostMapping("/users")
	public User createUser(@RequestBody User user) {

	    if (userService.existsByEmail(user.getEmail())) {
	        throw new RuntimeException("Email already exists ❌");
	    }

	    user.setPassword(passwordEncoder.encode(user.getPassword()));

	    // 🔥 Always set default role
	    user.setRole(Role.USER);

	    return userService.createUser(user);
	}
	}
