package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

/* xml mapper :  mybatis header */
@Mapper
public interface CommcdMapper {

	/**
	 * MC07 : 공통코드 마스터 Mapper
	 **/
	// MC07 : 공통코드 마스터
	List<Map<String, Object>> selectCommcdList(Map<String, Object> paramMap);

	// MC07 : 공통코드 마스터 INSERT
	int insertCommcd(Map<String, Object> paramMap);

	// MC07 : 공통코드 마스터 UPDATE
	int updateCommcd(Map<String, Object> paramMap);

	// MC07 : 공통코드 마스터 DELETE
	int deleteCommcd(Map<String, Object> paramMap);

}