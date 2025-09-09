package com.common.dto;

import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;

@Data
public class UserVO implements UserDetails {
	/**
	*
	*/
	private static final long serialVersionUID = 1L;
	Date time = new Date();
	SimpleDateFormat formatDate = new SimpleDateFormat("yyyyMMdd");

	private String compkey; // VARCHAR(20) Company Key
	private String useract; // VARCHAR(60) User Account ID
	private String passwrd; // VARCHAR(100) Password
	private String usernam; // VARCHAR(60) User name
	private String address; // VARCHAR(100) Address
	private String citycod; // VARCHAR(20) City
	private String rsonkey; // VARCHAR(10) Region
	private String postcod; // VARCHAR(10) Postal code
	private String natn2ky; // VARCHAR(3) Country key
	private String telphnm; // VARCHAR(20) Telephone number
	private String emailad; // VARCHAR(50) Electric mail address
	private String departm; // VARCHAR(50) Department
	private String emploid; // VARCHAR(50) Employee identifier in a company
	private String acapdoc; // VARCHAR(50) Account approval document

	private String usertyp; // VARCHAR(10) User Type
	private String ownerky; // VARCHAR(20) 사용자가 속한 화주사
	private String ptnrkey; // VARCHAR(20) 사용자가 속한 물류파트너
	private String custkey; // VARCHAR(20) 사용자가 속한 거래처

	private String usergr1; // VARCHAR(20) User group1
	private String usergr2; // VARCHAR(20) User group2
	private String usergr3; // VARCHAR(20) User group3
	private String langkey; // VARCHAR(2) Language key
	private String datefmt; // VARCHAR(20) Date format
	private String timefmt; // VARCHAR(20) Time format
	private String decifmt; // VARCHAR(20) Decimal format
	private String utimzon; // NUMERIC(10,3) Time zone by user

	private String idexpdt; // VARCHAR(8) 계정 만료일
	private String pwexpdt; // VARCHAR(8) 비밀번호 만료일자
	private int pwercnt; // number(10,3) 비밀번호 오류횟수
	private String alocked; // VARCHAR(1) Act Locked 계정잠금여부
	private String alockmo; // VARCHAR(100) Act Locked memo

	private String rolgkey; // 권한그룹 키

	private String polpryn; // 개인정보동의
	private String polsvyn; // 이용약관동의여부
	private String polsmyn; // 문자수신동의
	private String polemyn; // 이메일수신동의
	private String poldate; // 서비스동의날자
	private String poltime; // 서비스동의시간
	private String approyn; // 사용자승인여부

	private String sotapyn; // VARCHAR(1) 탈퇴요청여부
	private String sotdate; // VARCHAR(8) 탈퇴요청날짜
	private String sottime; // VARCHAR(6) 탈퇴요청시간
	private String themety; // VARCHAR(10) 메인테마타입
	private String favoryn; // VARCHAR(1) 즐겨찾기 자동Open YN

	private String credate; // VARCHAR(8) Creation date
	private String cretime; // VARCHAR(6) Creation time
	private String creuser; // VARCHAR(20) Created by
	private String lmodate; // VARCHAR(8) Last modified date
	private String lmotime; // VARCHAR(6) Last modified time
	private String lmouser; // VARCHAR(20) Last modified by

	private String usertyptx;

	/* 사용자가 가지고 있는 롤 : 메뉴 연결 */
	// private List<UserRoleAssign> userRoleAssignList; //사용안함
	// private List<UserRoleProgramDTO> userRoleVOList; /* 사용안함 map*/
	private List<UserMenuDTO> userMenuVOList; /* 메뉴 list(bookmark포함) */
	private Map<String, String> userMenubookmarkMap; /* 메뉴 list - bookmark */
	private List<Map<String, Object>> userWarehousr; /* 창고권한 */
	private Map<String, UserRoleProgramDTO> userRoleVOMap; /* 프로그램 권한 */

	// public void setUserRoleVOList(List<UserRoleProgramDTO> userRoleVOList) { /*
	// 사용안함 map*/
	// this.userRoleVOList = userRoleVOList;
	// }
	public void setUserMenuVOList(List<UserMenuDTO> userMenuVOList) {
		this.userMenuVOList = userMenuVOList;
	}

	public void setUserMenubookmarkMap(Map<String, String> userMenubookmarkMap) {
		this.userMenubookmarkMap = userMenubookmarkMap;
	}

	public void setUserWarehousr(List<Map<String, Object>> userWarehousr) {
		this.userWarehousr = userWarehousr;
	}

	public void setUserRoleVOMap(Map<String, UserRoleProgramDTO> userRoleVOMap) {
		this.userRoleVOMap = userRoleVOMap;
	}

	// 사용자 권한 강제 셋팅 : 일반, 관리자
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// return Collections.singletonList(new SimpleGrantedAuthority(this.userAuth));
		return Collections.singletonList(new SimpleGrantedAuthority("USER"));
	}

	// 시큐리티의 기본 : getUsername --> useract key
	// -> 따라서 얘는 인증할 때 id를 봄
	@Override
	public String getUsername() {
		return this.useract;
	}

	@Override
	// 시큐리티의 기본 : getPassword --> passwrd
	public String getPassword() {
		return this.passwrd;
	}

	/*
	 * 계정이 만료되지 않음 = true : 계정사용기간이 지났는지
	 */
	@Override
	public boolean isAccountNonExpired() {

		String toDate = formatDate.format(time);
		String expdDate = (idexpdt == null ? toDate : idexpdt);

		int compare1 = toDate.compareTo(expdDate); // 크다(1), 같다(0), 작다(-1)

		if (compare1 < 0) {
			return true;
		} else {
			return false;
		}

	}

	/*
	 * 계정이 잠겨있지 않음 = true : 비번5회 오류시 false
	 */
	@Override
	public boolean isAccountNonLocked() {
		if (this.pwercnt >= 5)
			return false;
		else
			return true;
	}

	/*
	 * 패스워드가 만료되지 않음 = true : 비번 변경기간 이내
	 */
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	/*
	 * 계정 사용 = true : 계정삭제 = false
	 */
	@Override
	public boolean isEnabled() {
		if (this.alocked.equals("Y"))
			return false;
		else
			return true;
	}

}