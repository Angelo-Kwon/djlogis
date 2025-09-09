package com.configuration.jwt.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.configuration.jwt.dto.LoginDto;
import com.configuration.jwt.exception.NotFoundMemberException;
import com.configuration.jwt.global.TokenProvider;
import com.sy.service.LogService;
import com.sy.service.UserManageService;

@RestController
@RequestMapping("/api")
public class AuthController {

	@Autowired
	private UserManageService userManageService;
	
	@Autowired
	private LogService logService;

	private final TokenProvider tokenProvider;
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	private Authentication authentication;

	public AuthController(TokenProvider tokenProvider, AuthenticationManagerBuilder authenticationManagerBuilder) {
		this.tokenProvider = tokenProvider;
		this.authenticationManagerBuilder = authenticationManagerBuilder;
	}

	@PostMapping("/authenticate")
	public ResponseEntity<Map<String, Object>> authorize(@Valid @RequestBody LoginDto loginDto, HttpServletRequest request) {

		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
				loginDto.getUsername(), loginDto.getPassword());

		try {
			authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
		} catch (Exception e) {
			throw new NotFoundMemberException("비밀번호가 다릅니다.");
		}

		Map<String, Object> userInfo = userManageService.selectUserInfoDetail(loginDto.getUsername());
		
		SecurityContextHolder.getContext().setAuthentication(authentication);

		String jwt = tokenProvider.createToken(authentication, userInfo);

//		ResponseCookie responseCookie = ResponseCookie.from("token", jwt).httpOnly(true).secure(false)
//				.domain("13.209.166.180").path("/").build();
//		ResponseCookie tokenValueCookie = ResponseCookie.from("tokenValue", jwt).httpOnly(true).secure(false)
//				.domain("13.209.166.180").path("/").build();

		ResponseCookie responseCookie = ResponseCookie.from("token", jwt).httpOnly(true).secure(false)
				.domain("localhost").path("/").build();
		ResponseCookie tokenValueCookie = ResponseCookie.from("tokenValue", jwt).httpOnly(true).secure(false)
				.domain("localhost").path("/").build();

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.SET_COOKIE, responseCookie.toString());
		headers.add(HttpHeaders.SET_COOKIE, tokenValueCookie.toString());
		
		// body에 token 추가. - Bearer + 한칸 공백 + token
		userInfo.put("token", "Bearer " + jwt);
		
		Map<String, Object> logData = new HashMap<String, Object>();
		logData.put("log_div", "LOGIN");
		
		// 로그 등록
 		Map<String, Object> userLog = logService.insertLog(logData, request);
 		
		// 로그인 일시 userInfo에 put
 	 	userInfo.put("loginDt" ,userLog.get("cre_dt"));

		return ResponseEntity.ok().headers(headers).body(userInfo);
	}
}
