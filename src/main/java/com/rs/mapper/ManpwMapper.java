package com.rs.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ManpwMapper {

	/*
	 * SEQ 조회
	 */
	public String getSeq(String str);
	
	/*
	 * 차량 기본정보 목록 조회
	 */
	public List<Map<String, Object>> getManpwBasicInfoList(Map<String, Object> map);
	
	/*
	 * 차량 기본정보 저장
	 */

	public int insertCmManpw(Map<String, Object> map);

	public int updateCmManpw(Map<String, Object> map);

	public int deleteCmManpw(Map<String, Object> map);
	
	
	/*
	 * 차량 부가정보 저장
	 */
	public int insertAdManpw(Map<String, Object> map);
	
	public int updateAdManpw(Map<String, Object> map);
	
	public int saveAdManpw(Map<String, Object> map);

	public int insertMoShManpw(Map<String, Object> map);

	public int updateMoShManpw(Map<String, Object> map);
	public int updateMoManpwShYn(Map<String, Object> map);

	public int insertMoCmManpw(Map<String, Object> map);
	public int insertMoAdManpw(Map<String, Object> map);
	public int updateMoCmManpw(Map<String, Object> map);
	public int updateMoAdManpw(Map<String, Object> map);
	public int deleteMoCmManpw(Map<String, Object> map);


	// 인력 공유 조회
	public List<Map<String, Object>> getSh(Map<String, Object> map);

	// 인력 공유 셍성
	public int createSh(Map<String, Object> map);

	// 인력 공유 수정
	public int updateSh(Map<String, Object> map);

	// 인력 공유 삭제
	public int deleteSh(Map<String, Object> map);

	// 인력 공유 종료
	public int endSh(Map<String, Object> map);

	// 인력구분 조회
	public List<Map<String, Object>> getWrkCd(Map<String, Object> map);

	// 인력번호 조회
	public List<Map<String, Object>> getManpwNo(Map<String, Object> map);

	// 인력업체 조회
	public List<Map<String, Object>> getCpCd(Map<String, Object> map);

	// 사업자등록번호 조회
	public List<Map<String, Object>> getBrNo(Map<String, Object> map);

	// 모바일 인력 공유 조회 건 수
	public int getMoShCnt(Map<String, Object> param);
	
	// 모바일 인력 공유 조회
	public List<Map<String, Object>> getMoSh(Map<String, Object> param);
}
