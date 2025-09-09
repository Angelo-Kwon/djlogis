package com.rs.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ChargeMapper {

	// 수요자 아이디 조회
	public List<Map<String, Object>> getConId(Map<String, Object> map);
	
	// 수요자 이름 조회
	public List<Map<String, Object>> getConNm(Map<String, Object> map);

	// 공유매칭 조회(창고)
	public List<Map<String, Object>> getMatWhouse(Map<String, Object> map);

	// 공유매칭 조회(차량)
	public List<Map<String, Object>> getMatCar(Map<String, Object> map);

	// 공유매칭 조회(기자재)
	public List<Map<String, Object>> getMatEquip(Map<String, Object> map);

	// 공유매칭 조회(인력)
	public List<Map<String, Object>> getMatManpw(Map<String, Object> map);

	// 공유매칭이력
	public int insertCmCharge(Map<String, Object> map);
}
