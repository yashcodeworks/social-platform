package com.yash.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.yash.backend.service.LikeService;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    // 🔁 LIKE / UNLIKE (TOGGLE)
    @PostMapping
    public String toggleLike(@RequestParam Long userId,
                             @RequestParam Long postId) {
        return likeService.toggleLike(userId, postId);
    }

    // ❤️ GET TOTAL LIKES
    @GetMapping("/count/{postId}")
    public long getLikeCount(@PathVariable Long postId) {
        return likeService.getLikeCount(postId);
    }
}