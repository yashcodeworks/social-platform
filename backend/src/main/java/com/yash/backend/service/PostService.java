package com.yash.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.yash.backend.dto.PostDTO;
import com.yash.backend.entity.Post;
import com.yash.backend.entity.User;
import com.yash.backend.repository.LikeRepository;
import com.yash.backend.repository.PostRepository;
import com.yash.backend.repository.UserRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

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

    public List<PostDTO> getFeed(Long currentUserId) {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(post -> {
                    long likeCount = likeRepository.countByPostId(post.getId());
                    boolean liked = currentUserId != null &&
                            likeRepository.findByUserIdAndPostId(currentUserId, post.getId()).isPresent();
                    return new PostDTO(post, likeCount, liked);
                })
                .collect(Collectors.toList());
    }

    public List<PostDTO> getMyPosts() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return postRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(post -> {
                    long likeCount = likeRepository.countByPostId(post.getId());
                    boolean liked = likeRepository.findByUserIdAndPostId(user.getId(), post.getId()).isPresent();
                    return new PostDTO(post, likeCount, liked);
                })
                .collect(Collectors.toList());
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

    public List<PostDTO> getUserPosts(Long userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(post -> {
                    long likeCount = likeRepository.countByPostId(post.getId());
                    boolean liked = likeRepository.findByUserIdAndPostId(userId, post.getId()).isPresent();
                    return new PostDTO(post, likeCount, liked);
                })
                .collect(Collectors.toList());
    }
}