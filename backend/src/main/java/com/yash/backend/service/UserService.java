package com.yash.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.yash.backend.dto.UpdateProfileDTO;
import com.yash.backend.dto.UserProfileDTO;
import com.yash.backend.entity.User;
import com.yash.backend.repository.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/";
	
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

    public UserProfileDTO uploadProfilePicture(MultipartFile file) throws IOException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed.");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("File size must be less than 5MB.");
        }

        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename to avoid collisions
        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String newFilename = UUID.randomUUID().toString() + extension;

        // Save file to disk
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Store the public URL path in the database
        String publicUrl = "/uploads/" + newFilename;
        user.setProfilePicture(publicUrl);
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
