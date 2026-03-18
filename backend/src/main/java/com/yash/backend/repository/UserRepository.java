package com.yash.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yash.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
