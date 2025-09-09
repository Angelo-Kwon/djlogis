package com.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

//import javax.persistence.Column;
//import javax.persistence.Table;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserMenuDTO {
	
	private String rowkey;	//Row Key
	private String compkey; //VARCHAR(20)	Company Key
	private String menukey; //VARCHAR(20)	Menu Key
	private String menuiky; //VARCHAR(10)	메뉴아이템키
	private String menugbn; //VARCHAR(10)	메뉴구분 FLD PGM
	private String progrid; //VARCHAR(20)	프로그램ID
	private String menulky; //VARCHAR(20)	메뉴명 라벨키
	private int menulvl; //NUMERIC(10,3)	메뉴레벨
	private String menunam; //VARCHAR(30)	메뉴명칭_참고용
	private int menuord; //NUMERIC(10,3)	메뉴순서번호
	private String menuico; //VARCHAR(100)	메뉴아이콘
	private String opentyp; //VARCHAR(20)	페이지 Open방법 (DEFAULT, SINGLEPAGE, POPUPPAGE, TABPAGE) 
	private String progcmd; //VARCHAR2(100) 프로그램 실행 경로 
	private String credate; //VARCHAR(8)	Creation date
    private String cretime; //VARCHAR(6)	Creation time
    private String creuser; //VARCHAR(20)	Created by
    private String lmodate; //VARCHAR(8)	Last modified date
    private String lmotime; //VARCHAR(6)	Last modified time
    private String lmouser; //VARCHAR(20)	Last modified by
    private String indibzl;	//biz logic indicator
	private String indiarc;	//Archive indicator
	private int updtchk; //Update check
}
