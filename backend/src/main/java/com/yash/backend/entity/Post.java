package com.yash.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="posts")

public class Post {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(nullable = false, length = 1000)
	private String content;
	
	private String image_url;
	
	 private LocalDateTime createdAt;
	 
	 @ManyToOne
	    @JoinColumn(name = "user_id", nullable = false)
	    private User user;

	 public long getId() {
		 return id;
	 }

	 public void setId(long id) {
		 this.id = id;
	 }

	 public String getContent() {
		 return content;
	 }

	 public void setContent(String content) {
		 this.content = content;
	 }

	 public String getImage_url() {
		 return image_url;
	 }

	 public void setImage_url(String image_url) {
		 this.image_url = image_url;
	 }

	 public LocalDateTime getCreatedAt() {
		 return createdAt;
	 }

	 public void setCreatedAt(LocalDateTime createdAt) {
		 this.createdAt = createdAt;
	 }

	 public User getUser() {
		 return user;
	 }

	 public void setUser(User user) {
		 this.user = user;
	 }
	 
	 

}
