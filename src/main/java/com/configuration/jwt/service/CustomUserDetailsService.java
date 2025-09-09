package com.configuration.jwt.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.configuration.jwt.entity.User;
import com.configuration.jwt.entity.UserCustom;
import com.configuration.jwt.exception.NotFoundMemberException;
import com.configuration.jwt.repository.UserRepository;

@Component("userDetailsService")
public class CustomUserDetailsService implements UserDetailsService {
	private final UserRepository userRepository;
	boolean enabled = true;
	boolean accountNonExpired = true;
	boolean credentialsNonExpired = true;
	boolean accountNonLocked = true;

	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	@Transactional
	public UserDetails loadUserByUsername(final String username) {
		return userRepository.findOneWithAuthoritiesByUsername(username).map(user -> createUser(username, user))
				.orElseThrow(() -> new NotFoundMemberException("아이디를 찾을 수 없습니다."));
	}

	private org.springframework.security.core.userdetails.User createUser(String username, User user) {

		if (!("Y").equals(user.getActivated())) {
			throw new NotFoundMemberException("비활성화된 계정입니다.");
		}

		List<GrantedAuthority> roles = new ArrayList<>();

		// 권한은 메뉴에서 설정.
		roles.add(new SimpleGrantedAuthority("ROLE_USER"));

		UserCustom userCustom = new UserCustom(user.getUsername(), user.getPassword(), enabled, accountNonExpired,
				credentialsNonExpired, accountNonLocked, roles, user.getUserId(), user.getNickname() // 이름
				, user.getCompany(), user.getUsername(), user.getRgroupId(), user.getAccountId());

		return userCustom;
	}
}
