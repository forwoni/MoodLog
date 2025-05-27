package com.DevStream.MoodLogBe.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequestDto {
    @NotBlank
    private String username;

    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;
}
