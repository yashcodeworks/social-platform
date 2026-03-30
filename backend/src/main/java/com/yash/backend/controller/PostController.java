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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yash.backend.dto.PostDTO;
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
	
	// currentUserId optional — used to compute "liked" per post
	@GetMapping("/feed")
	public List<PostDTO> getFeed(@RequestParam(required = false) Long userId) {
	    return postService.getFeed(userId);
	}
	
	@GetMapping("/my-posts")
	public List<PostDTO> getMyPosts() {
	    return postService.getMyPosts();
	}
	
	@DeleteMapping("/posts/{id}")
	public ResponseEntity<?> deletePost(@PathVariable Long id) {
	    postService.deletePost(id);
	    return ResponseEntity.ok("Deleted successfully");
	}

	@GetMapping("/posts/user/{userId}")
	public List<PostDTO> getUserPosts(@PathVariable Long userId) {
	    return postService.getUserPosts(userId);
	}
}
