package com.yash.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yash.backend.entity.Post;
import com.yash.backend.service.PostService;


@RestController
@RequestMapping("/api")
public class PostController {
	
	@Autowired
	private PostService postService;
	
	@PostMapping("/posts")
	public Post createPost(@RequestBody Post post) {
		return postService.createPost(post);
		
	}
	
	@GetMapping("/feed")
	public List<Post> getFeed() {
	    return postService.getFeed();
	}
	
	@GetMapping("/my-posts")
	public List<Post> getMyPosts() {
	    return postService.getMyPosts();
	}
	
	@DeleteMapping("/posts/{id}")
	public ResponseEntity<?> deletePost(@PathVariable Long id) {
	    postService.deletePost(id);
	    return ResponseEntity.ok("Deleted successfully");
	}

	@GetMapping("/posts/user/{userId}")
	public List<Post> getUserPosts(@PathVariable Long userId) {
	    return postService.getUserPosts(userId);
	}
}
