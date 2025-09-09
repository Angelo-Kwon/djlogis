package com.configuration.jwt.global;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException {
		// 유효한 자격증명을 제공하지 않고 접근하려 할때 401
//		response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
		String url = request.getRequestURL().toString();
		url = url.replaceAll(request.getRequestURI().toString(), "");

		response.sendRedirect(url + "/com/login");
	}
}
