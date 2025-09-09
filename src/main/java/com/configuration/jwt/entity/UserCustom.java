package com.configuration.jwt.entity;

import java.util.Collection;

import org.springframework.security.core.SpringSecurityCoreVersion;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// lombok 사용
// Security 에서 사용되는 User 에서 파라미터를 추가함.
//@Data         // constructor 도중 에러가 발생하므로 사용하지 않음
@Getter
@Setter
@ToString
public class UserCustom extends User {
	private static final long serialVersionUID = SpringSecurityCoreVersion.SERIAL_VERSION_UID;

	// 유저의 정보를 더 추가하고 싶다면 이곳과, 아래의 생성자 파라미터를 조절해야 한다.
	private String userId;
	private String nickname;
	private String company;
	private String userName;
	private String rgroupId;
	private String accountId;

	public UserCustom(String username, String password, boolean enabled, boolean accountNonExpired,
			boolean credentialsNonExpired, boolean accountNonLocked, Collection authorities, String userId,
			String nickname, String company, String userName, String rgroupId, String accountId) {
		super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
		this.userId = userId;
		this.nickname = nickname;
		this.company = company;
		this.userName = userName;
		this.rgroupId = rgroupId;
		this.accountId = accountId;
	}
}
