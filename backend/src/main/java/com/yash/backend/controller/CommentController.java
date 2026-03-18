package com.yash.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yash.backend.entity.Comment;
import com.yash.backend.service.CommentService;

@RestController
@RequestMapping("/api")
public class CommentController {

	@Autowired
	private CommentService commentService;
	
	  @PostMapping("/comments")
	    public Comment createComment(@RequestBody Comment comment) {
	        return commentService.createComment(comment);
	    }

	    
	    @GetMapping("/comments/post/{postId}")
	    public List<Comment> getCommentsByPost(@PathVariable Long postId) {
	        return commentService.getCommentsByPost(postId);
	    }

	    
	    @DeleteMapping("/comments/{id}")
	    public String deleteComment(@PathVariable Long id) {
	        commentService.deleteComment(id);
	        return "Comment deleted successfully";
	    }

	    
	    @GetMapping("/comments")
	    public List<Comment> getAllComments() {
	        return commentService.getAllComments();
	    }
	
}
