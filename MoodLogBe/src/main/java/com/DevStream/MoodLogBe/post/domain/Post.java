package com.DevStream.MoodLogBe.post.domain;

import com.DevStream.MoodLogBe.auth.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor

public class Post {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "user_id")
    private User author;
    private String content;
    private Boolean autoSaved;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private int viewCount = 0;

    public void update(String title, String content, Boolean autoSaved){
        this.title = title;
        this.content = content;
        this.autoSaved = autoSaved;
    }
    public void increaseViewCount() {
        this.viewCount++;
    }
}
