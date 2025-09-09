package com.common.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping(value = "/common")
public class FileUploadController {

	@GetMapping("/fileUploadSample")
	public String uploadForm() {
		return "fileUploadSample";
	}

	@PostMapping("/fileUpload")
	@ResponseBody
	public String uploadSubmit(@RequestParam("files") MultipartFile[] files) {
		try {
			for (MultipartFile file : files) {
				byte[] bytes = file.getBytes();
				String rootPath = System.getProperty("user.dir");
				File dir = new File(rootPath + File.separator + "uploads");
				if (!dir.exists()) {
					dir.mkdirs();
				}
				String originalFilename = file.getOriginalFilename();
				// String extension =
				// originalFilename.substring(originalFilename.lastIndexOf('.'));
				// String savedFilename = UUID.randomUUID().toString() + extension;
				// File uploadedFile = new File(dir.getAbsolutePath() + File.separator +
				// savedFilename);
				File uploadedFile = new File(dir.getAbsolutePath() + File.separator + originalFilename);
				try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(uploadedFile))) {
					stream.write(bytes);
				}

				log.info("File uploaded successfully! " + originalFilename);
			}
			return "File uploaded successfully!";
		} catch (Exception e) {
			e.printStackTrace();
			return "File upload failed: " + e.getMessage();
		}
	}
}
