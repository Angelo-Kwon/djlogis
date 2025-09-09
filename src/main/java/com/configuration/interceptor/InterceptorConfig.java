package com.configuration.interceptor;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {

	private final MenuInterceptor menuInterceptor;

	public InterceptorConfig(MenuInterceptor menuInterceptor) {
		this.menuInterceptor = menuInterceptor;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(menuInterceptor).addPathPatterns("/rs/*", "/dc/*", "/sy/*", "/md/*", "/dw/**");
	}
}
