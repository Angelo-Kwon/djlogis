package com.configuration.jwt.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.configuration.jwt.dto.UserDto;
import com.configuration.jwt.service.UserService;
import com.sy.service.LogService;

@RestController
@RequestMapping("/api")
public class UserController {
	private final UserService userService;
	private final LogService logService;

	public UserController(UserService userService, LogService logService) {
		this.userService = userService;
		this.logService = logService;
	}

	@PostMapping("/signup")
	public ResponseEntity<UserDto> signup(@Valid @RequestBody UserDto userDto) {
		return ResponseEntity.ok(userService.signup(userDto));
	}

	@GetMapping("/user")
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	public ResponseEntity<UserDto> getMyUserInfo(HttpServletRequest request) {
		return ResponseEntity.ok(userService.getMyUserWithAuthorities());
	}

	@GetMapping("/user/{username}")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<UserDto> getUserInfo(@PathVariable String username) {
		return ResponseEntity.ok(userService.getUserWithAuthorities(username));
	}

	@PostMapping("/logout")
	@ResponseBody
	public ResponseEntity<String> logout(@RequestBody Map<String, Object> param, HttpServletRequest request, HttpServletResponse response) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication != null) {
			// 로그에 로그아웃 시간 수정
			Map<String, Object> userLog = logService.updateLog(param, request);
						
			new SecurityContextLogoutHandler().logout(request, response, authentication);
		}

		ResponseCookie responseCookie = ResponseCookie.from("token", "").maxAge(0).httpOnly(true).secure(false)
				.path("/").build();
		ResponseCookie tokenValueCookie = ResponseCookie.from("tokenValue", "").maxAge(0).httpOnly(true).secure(false)
				.path("/").build();
		
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.SET_COOKIE, responseCookie.toString());
		headers.add(HttpHeaders.SET_COOKIE, tokenValueCookie.toString());

		return ResponseEntity.ok().headers(headers).body("");
	}
}
