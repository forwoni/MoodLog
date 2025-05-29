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

    private final Path rootPath = Paths.get("/Users/namhawon/uploads"); // 저장할 로컬 디렉토리 경로

    /**
     * 파일 업로드
     * @param file 업로드할 파일
     * @param filename 저장할 파일명
     * @return 저장된 파일의 가상 URL
     * @throws IOException
     */

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

    /**
     * 파일 삭제
     * @param filePath 삭제할 파일의 경로 (예: "/Users/yourusername/uploads/파일명")
     * @throws IOException
     */
    public void deleteFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        Files.deleteIfExists(path);
    }
}
