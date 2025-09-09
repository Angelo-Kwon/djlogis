package com.rs.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ShareUseMapper {

	/*
	 * SEQ 조회
	 */
	public String getSeq(String str);

	/*
	 * 공유자원사용신청 - 창고정보 조회
	 */
	public List<Map<String, Object>> getWhouseList(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 차량정보 조회
	 */
	public List<Map<String, Object>> getCarList(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 지게차 목록조회
	 */
	public List<Map<String, Object>> getFkliftList(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 카트 목록조회
	 */
	public List<Map<String, Object>> getKartList(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 파렛트 목록조회
	 */
	public List<Map<String, Object>> getPltList(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 창고 사용신청
	 */
	public int updateShWhouseApply(Map<String, Object> map);
	/*
	 * 공유자원사용신청 - 차량 사용신청
	 */
	public int updateShCarApply(Map<String, Object> map);
	/*
	 * 공유자원사용신청 - 기자재 사용신청
	 */
	public int updateShEquipApply(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 기자재 사용신청
	 */
	public int insertShMatch(Map<String, Object> map);


	/*
	 * 공유자원사용신청 - 창고 사용신청
	 */
	public int setWhouseUse(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 차량 사용신청
	 */
	public int setCarUse(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 기자재 사용신청
	 */
	public int setEquipUse(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 인력 사용신청
	 */
	public int setManpwUse(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 매칭 입력
	 */
	public int saveMatch(Map<String, Object> map);

	/*
	 * 공유자원사용신청 - 매칭 이력 입력
	 */
	public int saveMatchHist(Map<String, Object> map);

	/*
	 * 모바일 공유자원사용신청 - 창고정보 조회
	 */
	public List<Map<String, Object>> getMoWhouseList(Map<String, Object> map);

	/*
	 * 모바일 공유자원사용신청 - 차량정보 조회
	 */
	public List<Map<String, Object>> getMoCarList(Map<String, Object> map);

	/*
	 * 모바일 공유자원사용신청 - 기자재(지게차) 정보 조회
	 */
	public List<Map<String, Object>> getMoEquipFList(Map<String, Object> map);

	/*
	 * 모바일 공유자원사용신청 - 기자재(대차) 정보 조회
	 */
	public List<Map<String, Object>> getMoEquipKList(Map<String, Object> map);

	/*
	 * 모바일 공유자원사용신청 - 기자재(파렛트) 정보 조회
	 */
	public List<Map<String, Object>> getMoEquipPList(Map<String, Object> map);

	public int saveMoShareWhouseShUseYn(Map<String, Object> param);
	public int saveMoShareCarShUseYn(Map<String, Object> param);
	public int saveMoShareEquipShYn(Map<String, Object> param);
	public int saveMoShareManpwShUseYn(Map<String, Object> param);

	public int saveMoCmWhouseShYn(Map<String, Object> param);
	public int saveMoCmCarShYn(Map<String, Object> param);
	public int saveMoCmEquipShYn(Map<String, Object> param);
	public int saveMoCmManpwShYn(Map<String, Object> param);

}
