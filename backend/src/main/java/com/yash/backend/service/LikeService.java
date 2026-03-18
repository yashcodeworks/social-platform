package com.yash.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yash.backend.entity.Like;
import com.yash.backend.entity.Post;
import com.yash.backend.entity.User;
import com.yash.backend.repository.LikeRepository;
import com.yash.backend.repository.PostRepository;
import com.yash.backend.repository.UserRepository;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    // 🔥 TOGGLE LIKE (LIKE / UNLIKE)
    public String toggleLike(Long userId, Long postId) {

        Optional<Like> existingLike =
                likeRepository.findByUserIdAndPostId(userId, postId);

        // 👉 already liked → UNLIKE
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return "Post unliked ❌";
        }

        // 👉 else → LIKE
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Like like = new Like();
        like.setUser(user);
        like.setPost(post);

        likeRepository.save(like);

        return "Post liked ❤️";
    }

    // ❤️ COUNT LIKES
    public long getLikeCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }
}