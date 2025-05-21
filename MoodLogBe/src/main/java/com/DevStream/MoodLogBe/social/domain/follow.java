package com.DevStream.MoodLogBe.social.domain;

import com.DevStream.MoodLogBe.auth.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class follow {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "follwer_id")
    private User follower;

    @ManyToOne(optional = false)
    @JoinColumn(name = "following_id")
    private User following;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
