package com.rs.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SupMatchMapper {

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

	// 공유매칭종료(창고)
	public int updateCmWhouse(Map<String, Object> map);
	public int updateShWhouse(Map<String, Object> map);

	// 공유매칭종료(차량)
	public int updateCmCar(Map<String, Object> map);
	public int updateShCar(Map<String, Object> map);

	// 공유매칭종료(기자재)
	public int updateCmFklift(Map<String, Object> map);
	public int updateCmKart(Map<String, Object> map);
	public int updateCmPlt(Map<String, Object> map);
	public int updateShEquip(Map<String, Object> map);

	// 공유매칭종료(인력)
	public int updateCmManpw(Map<String, Object> map);
	public int updateShManpw(Map<String, Object> map);

	// 공유매칭종료(매칭)
	public int updateShMat(Map<String, Object> map);

	// 공유매칭이력
	public int insertShMatHist(Map<String, Object> map);
	
	// 모바일 공유매칭 조회(창고)
	public int getMoMatWhouseCnt(Map<String, Object> param);
	public List<Map<String, Object>> getMoMatWhouse(Map<String, Object> param);
	
	// 모바일 공유매칭 조회(차량)
	public int getMoMatCarCnt(Map<String, Object> param);
	public List<Map<String, Object>> getMoMatCar(Map<String, Object> param);

	// 모바일 공유매칭 조회(기자재)
	public int getMoMatEquipCnt(Map<String, Object> param);
	public List<Map<String, Object>> getMoMatEquip(Map<String, Object> param);
	
	// 모바일 공유매칭 조회(인력)
	public int getMoMatManpwCnt(Map<String, Object> param);
	public List<Map<String, Object>> getMoMatManpw(Map<String, Object> param);
	
}
