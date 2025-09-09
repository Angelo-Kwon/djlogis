package com.configuration.jwt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.configuration.jwt.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findOneWithAuthoritiesByUsername(String username);
}
