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
    	
    	System.out.println(user);
        return userRepository.save(user);
    }
    


}
