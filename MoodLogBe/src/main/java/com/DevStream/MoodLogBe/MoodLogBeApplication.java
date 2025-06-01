package com.DevStream.MoodLogBe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MoodLogBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoodLogBeApplication.class, args);
	}

}
