package com.configuration.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

import com.configuration.jwt.global.JwtAccessDeniedHandler;
import com.configuration.jwt.global.JwtAuthenticationEntryPoint;
import com.configuration.jwt.global.JwtSecurityConfig;
import com.configuration.jwt.global.TokenProvider;

@EnableWebSecurity
@EnableMethodSecurity
@Configuration
public class SecurityConfig {
	private final TokenProvider tokenProvider;
	private final CorsFilter corsFilter;
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

	public SecurityConfig(TokenProvider tokenProvider, CorsFilter corsFilter,
			JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint, JwtAccessDeniedHandler jwtAccessDeniedHandler) {
		this.tokenProvider = tokenProvider;
		this.corsFilter = corsFilter;
		this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
		this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				// token을 사용하는 방식이기 때문에 csrf를 disable.
				.csrf(csrf -> csrf.disable())

				.addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
				.exceptionHandling(exceptionHandling -> exceptionHandling.accessDeniedHandler(jwtAccessDeniedHandler)
						.authenticationEntryPoint(jwtAuthenticationEntryPoint))
				.anonymous().disable()
				.authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests
						.antMatchers("/assets/**", "/css/**", "/fonts/**", "/js/**", "/vender/**", "/fragment/**",
								"/layout/**", "com/js/**", "/**/js/**", "/font/**", "/dc/safestaus/**")
						.permitAll()
						.antMatchers("/api/authenticate", "/api/signup", "/getMenuList",
								"/common/**", "/sy/join/**", "/www", "/www/**", "/sy/board/**", "/com/js/*", 
								"/com/dc_dt", "/com/join", "/com/login", "/com/pause", "/com/service", "/com/info", "/com/location", "/dc/safescene/selectSafesceneList")
						.permitAll().antMatchers("/swagger-ui/**").permitAll() // swagger ui 권한을 설정합니다.
						.antMatchers("/v3/api-docs").permitAll() // swagger 문서 접근 권한을 설정합니다.
						.antMatchers("/v3/api-docs/swagger-config").permitAll() // swagger 문서 설정 접근 권한을 설정합니다.
						.anyRequest().authenticated())

				// 세션을 사용하지 않기 때문에 STATELESS로 설정.
				.sessionManagement(
						sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				.headers(headers -> headers.frameOptions(options -> options.sameOrigin()))

				.apply(new JwtSecurityConfig(tokenProvider));
		return http.build();
	}
}