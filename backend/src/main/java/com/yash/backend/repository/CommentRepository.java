package com.yash.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yash.backend.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

	List<Comment> findByPostId(Long postId);
}
