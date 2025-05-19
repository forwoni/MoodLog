package com.DevStream.MoodLogBe.auth.repository;

import com.DevStream.MoodLogBe.auth.domain.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User createTestUser(){
        return User.builder()
                .username("testUser")
                .email("test@hufs.ac.kr")
                .password("1234")
                .roles(Set.of("ROLE_USER"))
                .build();
    }

    @Test
    @DisplayName("save() 후 findById()로 저장된 User 조회")
    void saveAndFindById(){
        // given
        User user = createTestUser();

        // when
        User saved = userRepository.save(user);

        // then
        Optional<User> found = userRepository.findById(saved.getId());
        assertThat(found)
                .isPresent()
                .get()
                .satisfies(u ->{
                    assertThat(u.getUsername()).isEqualTo("testUser");
                    assertThat(u.getEmail()).isEqualTo("test@hufs.ac.kr");
                    assertThat(u.getRoles()).containsExactly("ROLE_USER");
                });
    }

    @Test
    @DisplayName("findByUsername() 메소드 검증")
    void findByUsername() {
        //given
        User user = createTestUser();
        userRepository.save(user);

        //when
        Optional<User> byName = userRepository.findByUsername("testUser");

        //then
        assertThat(byName)
                .isPresent()
                .get()
                .extracting(User::getEmail)
                .isEqualTo("test@hufs.ac.kr");

    }

}