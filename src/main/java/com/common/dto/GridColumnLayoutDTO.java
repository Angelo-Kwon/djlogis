package com.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GridColumnLayoutDTO {
	
	private String compkey;		//Company Key
	private String useract;		//유저 ID
	private String progrid;		//프로그램 ID
	private String pgridid;		//그리드 ID
	private String dataidx;		//컬럼 인덱스
	
	private int sortnum;	//컬럼 순서
	private Boolean phidden;	//숨김 여부
	private String pqalign;		//위치조절(왼쪽,가운데,오른쪽)
	private String datatyp;		//컬럼 타입
	private int pqwidth;	//컬럼 너비
	
	private String credate;
	private String cretime;
	private String creuser;
	private String lmodate;
	private String lmotime;
	private String lmouser;
	private String indibzl;
	private String indiarc;
	private int updtchk;
	
}
