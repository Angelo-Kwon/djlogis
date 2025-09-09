package com.rs.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ApvMatchMapper {

	// 수요자 아이디 조회(창고)
	public List<Map<String, Object>> getConId(Map<String, Object> map);

	// 공유매칭요청 조회(창고)
	public List<Map<String, Object>> getMatReqWhouse(Map<String, Object> map);

	// 공유매칭요청 조회(차량)
	public List<Map<String, Object>> getMatReqCar(Map<String, Object> map);

	// 공유매칭요청 조회(기자재)
	public List<Map<String, Object>> getMatReqEquip(Map<String, Object> map);

	// 공유매칭요청 조회(인력)
	public List<Map<String, Object>> getMatReqManpw(Map<String, Object> map);

	// 공유매칭승인(창고)
	public int updateCmWhouse(Map<String, Object> map);
	public int updateShWhouse(Map<String, Object> map);

	// 공유매칭승인(차량)
	public int updateCmCar(Map<String, Object> map);
	public int updateShCar(Map<String, Object> map);

	// 공유매칭승인(기자재)
	public int updateCmFklift(Map<String, Object> map);
	public int updateCmKart(Map<String, Object> map);
	public int updateCmPlt(Map<String, Object> map);
	public int updateShEquip(Map<String, Object> map);

	// 공유매칭승인(인력)
	public int updateCmManpw(Map<String, Object> map);
	public int updateShManpw(Map<String, Object> map);

	// 공유매칭승인(매칭)
	public int updateShMat(Map<String, Object> map);

	// 공유매칭이력
	public int insertShMatHist(Map<String, Object> map);
	
	// 모바일 공유매칭요청 조회 및 건 수(창고)
	public int getMoMatReqWhouseCnt(Map<String, Object> param);
	public List<Map<String, Object>> getMoMatReqWhouse(Map<String, Object> param);

	// 모바일 공유매칭요청 조회 및 건 수(차량)
	public int getMoMatReqCarCnt(Map<String, Object> param);
	public List<Map<String, Object>> getMoMatReqCar(Map<String, Object> param);

	// 모바일 공유매칭요청 조회 및 건 수(기자재)
	public int getMoMatReqEquipCnt(Map<String, Object> param);
	public List<Map<String, Object>> getMoMatReqEquip(Map<String, Object> param);

	// 모바일 공유매칭요청 조회 및 건 수(인력)
	public int getMoMatReqManpwCnt(Map<String, Object> param);
	public List<Map<String, Object>> getMoMatReqManpw(Map<String, Object> param);

	// 공유매칭승인(매칭)
	public int updateMoShMatchYn(Map<String, Object> map);
	// 공유매칭승인(매칭)
	public int insertMoShMatchHist(Map<String, Object> map);// 공유매칭승인(매칭)
	
	//공유자원사용신청 - 창고 사용신청
	public int updateShWhouseApply(Map<String, Object> map);
	//공유자원사용신청 - 차량 사용신청
	public int updateShCarApply(Map<String, Object> map);
	// 공유자원사용신청 - 기자재 사용신청
	public int updateShEquipApply(Map<String, Object> map);
	// 공유자원사용신청 - 매칭 저장
	public int insertShMatch(Map<String, Object> map);
	
	// 공유매칭승인(기자재)
	public int updateMoCmWhouseShYn(Map<String, Object> map);
	public int updateMoCmCarShYn(Map<String, Object> map);
	public int updateMoCmFkliftShYn(Map<String, Object> map);
	public int updateMoCmKartShYn(Map<String, Object> map);
	public int updateMoCmPltShYn(Map<String, Object> map);
	public int updateMoShWhouseShUseYn(Map<String, Object> map);
	// 공유매칭승인(매칭)
	public int updateMoShCarShUseYn(Map<String, Object> map);
	// 공유매칭승인(매칭)
	public int updateMoShEquipShUseYn(Map<String, Object> map);
	// 공유매칭승인(매칭)
	public int updateMoShManpwShUseYn(Map<String, Object> map);

	//사용자 전화번호 조회
	public String getUserPhone(Map<String, Object> map);
}
