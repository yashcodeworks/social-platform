package com.yash.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="comment")
public class Comment {

	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	 @Column(nullable = false, length = 500)
	private String content;
	
	 @ManyToOne
	    @JoinColumn(name = "user_id")
	    private User user;

	    // 🔗 Many comments → One post
	    @ManyToOne
	    @JoinColumn(name = "post_id")
	    private Post post;

	    private LocalDateTime createdAt;

	    public Comment() {}
	    
		public Comment(Long id, String content, User user, Post post, LocalDateTime createdAt) {
			super();
			this.id = id;
			this.content = content;
			this.user = user;
			this.post = post;
			this.createdAt = createdAt;
		}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getContent() {
			return content;
		}

		public void setContent(String content) {
			this.content = content;
		}

		public User getUser() {
			return user;
		}

		public void setUser(User user) {
			this.user = user;
		}

		public Post getPost() {
			return post;
		}

		public void setPost(Post post) {
			this.post = post;
		}

		public LocalDateTime getCreatedAt() {
			return createdAt;
		}

		public void setCreatedAt(LocalDateTime createdAt) {
			this.createdAt = createdAt;
		}
	    
		
	    
}
