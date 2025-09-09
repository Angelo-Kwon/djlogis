package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

/* xml mapper :  mybatis header */
@Mapper
public interface AtctMapper {
	/**
	 * MC09 : 어카운트 업체 마스터 Mapper
	 **/
	// MC09 : 어카운트 업체 마스터
	List<Map<String, Object>> selectAtctList(Map<String, Object> paramMap);

	// MC09 : 어카운트 = 업체 마스터
	List<Map<String, Object>> selectAtctActList(Map<String, Object> paramMap);

	// MC09 : 어카운트 업체 마스터 INSERT
	int insertAtct(Map<String, Object> paramMap);

	// MC09 : 어카운트 업체 마스터 UPDATE
	int updateAtct(Map<String, Object> paramMap);

	// MC09 : 어카운트 업체 마스터 DELETE
	int deleteAtct(Map<String, Object> paramMap);

	List<Map<String, Object>> selectCustList(Map<String, Object> paramMap);

}