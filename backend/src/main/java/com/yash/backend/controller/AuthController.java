package com.yash.backend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yash.backend.dto.LoginRequest;
import com.yash.backend.entity.User;
import com.yash.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	private UserRepository userRepository;
	
	@PostMapping("/login")
	private String login(@RequestBody LoginRequest request) {
		
		 User user = userRepository.findByEmail(request.getEmail());
		 
		 	if (user == null) {
	            return "User not found";
	        }

	        if (!user.getPassword().equals(request.getPassword())) {
	            return "Invalid password";
	        }
		
		return "Login Successfull";
	}

}
