package com.yash.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.yash.backend.dto.UpdateProfileDTO;
import com.yash.backend.dto.UserProfileDTO;
import com.yash.backend.entity.User;
import com.yash.backend.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	 public User createUser(User user) {
	        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
	            throw new RuntimeException("Email already exists ❌");
	        }
	        return userRepository.save(user);
	    }

	 public boolean existsByEmail(String email) {
	        return userRepository.findByEmail(email).isPresent();
	    }   

    public UserProfileDTO getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new UserProfileDTO(
            user.getId(), 
            user.getUsername(), 
            user.getEmail(), 
            user.getBio(), 
            user.getProfilePicture()
        );
    }

    public UserProfileDTO updateProfile(UpdateProfileDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getBio() != null) user.setBio(dto.getBio());
        if (dto.getProfilePicture() != null) user.setProfilePicture(dto.getProfilePicture());

        userRepository.save(user);

        return new UserProfileDTO(
            user.getId(), 
            user.getUsername(), 
            user.getEmail(), 
            user.getBio(), 
            user.getProfilePicture()
        );
    }
}
