package com.yash.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yash.backend.entity.User;
import com.yash.backend.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	
	private UserRepository userRepository;
	
	 public User createUser(User user) {

	        // ✅ check email already exists
	        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
	            throw new RuntimeException("Email already exists ❌");
	        }

	        // 👉 save user
	        return userRepository.save(user);
	    }

	 public boolean existsByEmail(String email) {
	        return userRepository.findByEmail(email).isPresent();
	    }   


}
