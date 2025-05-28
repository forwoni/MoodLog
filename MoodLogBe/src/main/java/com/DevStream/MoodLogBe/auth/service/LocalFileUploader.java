package com.DevStream.MoodLogBe.auth.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalFileUploader {

    private final Path rootPath = Paths.get("/Users/yourusername/uploads"); // 저장할 로컬 디렉토리 경로

    public String uploadFile(MultipartFile file, String filename) throws IOException {
        // 디렉토리가 없으면 생성
        if (!Files.exists(rootPath)) {
            Files.createDirectories(rootPath);
        }

        // 파일 저장
        Path target = rootPath.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // 저장된 파일의 "가상 URL" 반환 (예: "/uploads/파일명")
        return "/uploads/" + filename;
    }
}
