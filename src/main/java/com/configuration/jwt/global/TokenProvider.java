package com.configuration.jwt.global;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.configuration.jwt.service.CustomUserDetailsService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class TokenProvider implements InitializingBean {

	private final Logger logger = LoggerFactory.getLogger(TokenProvider.class);
	private final CustomUserDetailsService customUserDetailsService;
	private static final String AUTHORITIES_KEY = "auth";
	private final String secret;
	private final long tokenValidityInMilliseconds;
	private Key key;

	public TokenProvider(@Value("${jwt.secret}") String secret,
			@Value("${jwt.token-validity-in-seconds}") long tokenValidityInSeconds,
			CustomUserDetailsService customUserDetailsService) {
		this.secret = secret;
		this.customUserDetailsService = customUserDetailsService;
		this.tokenValidityInMilliseconds = tokenValidityInSeconds * 1000;
	}

	@Override
	public void afterPropertiesSet() {
		byte[] keyBytes = Decoders.BASE64.decode(secret);
		this.key = Keys.hmacShaKeyFor(keyBytes);
	}

	public String createToken(Authentication authentication, Map<String, Object> userInfo) {
		String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.collect(Collectors.joining(","));

		long now = (new Date()).getTime();
		Date validity = new Date(now + this.tokenValidityInMilliseconds);

		Map<String, Object> user = (Map<String, Object>) userInfo.get("dataList");
		
		return Jwts.builder()
				.claim("user_id", authentication.getName())
				.claim("account_code", user.get("compkey"))
				.claim("user_type", user.get("usertyp"))
				.claim("owner_code", user.get("ownerky"))
				.claim("partner_code", user.get("ptnrkey"))
				.claim("group_code", user.get("rgroup_id"))
				.signWith(key, SignatureAlgorithm.HS512).setExpiration(validity).compact();
	}

	public Authentication getAuthentication(String token) {
		Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();

		/*
		 * Collection<? extends GrantedAuthority> authorities = Arrays
		 * .stream(claims.get(AUTHORITIES_KEY).toString().split(",")).map(
		 * SimpleGrantedAuthority::new) .collect(Collectors.toList());
		 */
		UserDetails userDetails = customUserDetailsService.loadUserByUsername(claims.get("user_id").toString());

		return new UsernamePasswordAuthenticationToken(userDetails, token, null);
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return true;
		} catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
			logger.info("잘못된 JWT 서명입니다.");
		} catch (ExpiredJwtException e) {
			logger.info("만료된 JWT 토큰입니다.");
		} catch (UnsupportedJwtException e) {
			logger.info("지원되지 않는 JWT 토큰입니다.");
		} catch (IllegalArgumentException e) {
			logger.info("JWT 토큰이 잘못되었습니다.");
		}
		return false;
	}
}
