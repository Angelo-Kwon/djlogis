package com.configuration.jwt.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.SecondaryTable;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "OP_USER", catalog = "GJ_OP")
@SecondaryTable(name = "OP_USER_ROLE_GROUP", catalog = "GJ_OP", pkJoinColumns = {@PrimaryKeyJoinColumn(name = "USER_ID")})
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

	@Id
	@Column(name = "USER_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private String userId;

	@Column(name = "LOGIN_ID", length = 50, unique = true)
	private String username;

	@Column(name = "LOGIN_PWD", length = 100)
	private String password;

	@Column(name = "USER_NM", length = 50)
	private String nickname;

	@Column(name = "COMPANY", length = 100)
	private String company;
	
	@Column(table="OP_USER_ROLE_GROUP", name = "RGROUP_ID", length = 50)
	private String rgroupId;

	@Column(name = "USE_YN")
	private String activated;

	@Column(name = "ACCOUNT_ID", length = 50)
	private String accountId;
}
