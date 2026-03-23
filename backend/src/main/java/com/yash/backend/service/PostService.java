package com.yash.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.yash.backend.entity.Post;
import com.yash.backend.entity.User;
import com.yash.backend.repository.PostRepository;
import com.yash.backend.repository.UserRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

   
    public Post createPost(Post post) {

        
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

       
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        
        post.setUser(user);
        
        post.setCreatedAt(LocalDateTime.now());

       
        return postRepository.save(post);
    }

    
    public List<Post> getFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Post> getMyPosts() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return postRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
    

    public void deletePost(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

       
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can delete only your own post ❌");
        }

        postRepository.delete(post);
    }
}