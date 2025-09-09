package com.configuration.jwt.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.configuration.jwt.dto.UserDto;
import com.configuration.jwt.entity.User;
import com.configuration.jwt.exception.DuplicateMemberException;
import com.configuration.jwt.exception.NotFoundMemberException;
import com.configuration.jwt.repository.UserRepository;
import com.configuration.jwt.util.SecurityUtil;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public UserDto signup(UserDto userDto) {
		if (userRepository.findOneWithAuthoritiesByUsername(userDto.getUsername()).orElse(null) != null) {
			throw new DuplicateMemberException("이미 가입되어 있는 유저입니다.");
		}

		User user = User.builder().username(userDto.getUsername())
				.password(passwordEncoder.encode(userDto.getPassword())).nickname(userDto.getNickname()).activated("Y")
				.build();

		return UserDto.from(userRepository.save(user));
	}

	@Transactional(readOnly = true)
	public UserDto getUserWithAuthorities(String username) {
		return UserDto.from(userRepository.findOneWithAuthoritiesByUsername(username).orElse(null));
	}

	@Transactional(readOnly = true)
	public UserDto getMyUserWithAuthorities() {
		return UserDto.from(SecurityUtil.getCurrentUsername().flatMap(userRepository::findOneWithAuthoritiesByUsername)
				.orElseThrow(() -> new NotFoundMemberException("Member not found")));
	}
}
