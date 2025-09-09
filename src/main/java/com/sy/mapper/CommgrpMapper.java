package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommgrpMapper {
	// MC06 : 공통그룹코드 마스터
	List<Map<String, Object>> selectCommgrpList(Map<String, Object> paramMap);

	// MC06 : 공통그룹코드 마스터 INSERT
	int insertCommgrp(Map<String, Object> paramMap);

	// MC06 : 공통그룹코드 마스터 UPDATE
	int updateCommgrp(Map<String, Object> paramMap);

	// MC06 : 공통그룹코드 마스터 DELETE
	int deleteCommgrp(Map<String, Object> paramMap);

}