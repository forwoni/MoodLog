package com.DevStream.MoodLogBe.auth.repository;

import com.DevStream.MoodLogBe.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existByUsername(String username);
    boolean existByEmail(String email);
}
