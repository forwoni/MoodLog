package com.DevStream.MoodLogBe.auth.domain;

import com.DevStream.MoodLogBe.post.domain.Post;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.List;

@Entity
public class User {
    @Id @GeneratedValue
    private Long id;
    private String username;
    private String email;
    private String password;

    private List<Post> posts;
}
