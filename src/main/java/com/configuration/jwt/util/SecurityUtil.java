package com.configuration.jwt.util;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.configuration.jwt.entity.UserCustom;

public class SecurityUtil {

	private static final Logger logger = LoggerFactory.getLogger(SecurityUtil.class);

	private SecurityUtil() {
	}

	public static Optional<String> getCurrentUsername() {
		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null) {
			logger.debug("Security Context에 인증 정보가 없습니다.");
			return Optional.of("");
		}

		String username = null;
		if (authentication.getPrincipal() instanceof UserDetails) {
			UserDetails springSecurityUser = (UserDetails) authentication.getPrincipal();
			username = springSecurityUser.getUsername();
		} else if (authentication.getPrincipal() instanceof String) {
			username = (String) authentication.getPrincipal();
		}

		return Optional.ofNullable(username);
	}

	public static Optional<String> getCurrentUserId() {
		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null) {
			logger.debug("Security Context에 인증 정보가 없습니다.");
			return Optional.of("");
		}

		String userId = null;
		if (authentication.getPrincipal() instanceof UserCustom) {
			UserCustom springSecurityUser = (UserCustom) authentication.getPrincipal();
			userId = springSecurityUser.getUserId();
		}

		return Optional.ofNullable(userId);
	}

	public static Optional<String> getCurrentAccountId() {
		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null) {
			logger.debug("Security Context에 인증 정보가 없습니다.");
			return Optional.of("");
		}

		String accountId = null;
		if (authentication.getPrincipal() instanceof UserCustom) {
			UserCustom springSecurityUser = (UserCustom) authentication.getPrincipal();
			accountId = springSecurityUser.getAccountId();
		}

		return Optional.ofNullable(accountId);
	}
	
	public static Optional<String> getCurrentRgroupId() {
		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null) {
			logger.debug("Security Context에 인증 정보가 없습니다.");
			return Optional.of("");
		}

		String accountId = null;
		if (authentication.getPrincipal() instanceof UserCustom) {
			UserCustom springSecurityUser = (UserCustom) authentication.getPrincipal();
			accountId = springSecurityUser.getRgroupId();
		}

		return Optional.ofNullable(accountId);
	}
}
