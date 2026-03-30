package com.yash.backend.dto;

import com.yash.backend.entity.Post;
import com.yash.backend.entity.User;

public class PostDTO {

    private long id;
    private String content;
    private String image_url;
    private String createdAt;
    private long likeCount;
    private boolean liked;
    private UserSummary user;

    // Nested user summary (only the fields we need in the feed)
    public static class UserSummary {
        private Long id;
        private String username;
        private String email;
        private String profilePicture;

        public UserSummary(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.email = user.getEmail();
            this.profilePicture = user.getProfilePicture();
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getProfilePicture() { return profilePicture; }
    }

    public PostDTO(Post post, long likeCount, boolean liked) {
        this.id = post.getId();
        this.content = post.getContent();
        this.image_url = post.getImage_url();
        this.createdAt = post.getCreatedAt() != null ? post.getCreatedAt().toString() : null;
        this.likeCount = likeCount;
        this.liked = liked;
        this.user = post.getUser() != null ? new UserSummary(post.getUser()) : null;
    }

    public long getId() { return id; }
    public String getContent() { return content; }
    public String getImage_url() { return image_url; }
    public String getCreatedAt() { return createdAt; }
    public long getLikeCount() { return likeCount; }
    public boolean isLiked() { return liked; }
    public UserSummary getUser() { return user; }
}
