package com.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserRoleProgramDTO {
	
	private String rowkey;	//Row Key
	private String compkey; //VARCHAR(20)	Company Key
	private String rolekey; //VARCHAR(20)	Role Key
	private String progrid; //VARCHAR(20)	프로그램ID
	private String posactv; //VARCHAR(1)	POST생성권한
	private String getactv; //VARCHAR(1)	GET조회권한
	private String putactv; //VARCHAR(1)	PUT수정권한
	private String delactv; //VARCHAR(1)	DELETE삭제권한 
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
