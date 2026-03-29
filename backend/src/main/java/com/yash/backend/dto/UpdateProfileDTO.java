package com.yash.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileDTO {
    @Size(max = 500, message = "Bio must be at most 500 characters")
    private String bio;
    private String profilePicture;
}
