package com.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GridSettingLayoutDTO {
	
	private String compkey;		//Company Key
	private String useract;		//유저 ID
	private String progrid;		//프로그램 ID
	private String pgridid;		//그리드 ID
	
	private Boolean nubrcel;	//numberCell
	private String hovermd;		//hoverMode
	private int frezcol;	//freezeCols
	private int frezrow;	//freezeRows
	private Boolean colbodr;	//columnBorders
	private Boolean rowbodr;	//rowBorders
	private Boolean strprow;	//stripeRows
	private int gheight;	//Grid height
	
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
