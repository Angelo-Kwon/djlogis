package com.rs.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CarMapper {

	/*
	 * SEQ 조회
	 */
	public String getSeq(String str);

	/*
	 * 차량 기본정보 목록 조회
	 */
	public List<Map<String, Object>> getCarBasicInfoList(Map<String, Object> map);
	/*
	 * 차량 규격 목록 조회
	 */
	public List<Map<String, Object>> getMdCarList(Map<String, Object> map);
	public List<Map<String, Object>> getMoMdCarList(Map<String, Object> map);

	/*
	 * 차량 부가정보 저장
	 */
	public int insertAdCar(Map<String, Object> map);
	public int updateAdCar(Map<String, Object> map);
	public int insertMoShCar(Map<String, Object> map);
	public int updateMoShCar(Map<String, Object> map);
	/*
	 * 차량 부가정보 저장
	 */
	public int updateMoCarShYn(Map<String, Object> map);

	public int insertCmCar(Map<String, Object> map);

	public int updateCmCar(Map<String, Object> map);

	public int deleteCmCar(Map<String, Object> map);

	/*
	 * 차량 기본정보 목록 조회
	 */
	public List<Map<String, Object>> getShCarList(Map<String, Object> map);

	/*
	 * 차량 공유정보 저장
	 */
	public int saveCarShareInfo(Map<String, Object> map);

	/*
	 * 차량 기본정보 공유여부 저장
	 */
	public int updateCarShareInfo(Map<String, Object> map);

	/*
	 * 차량 공유정보 종료 대상 목록 조회
	 */
	public List<Map<String, Object>> getCarShareEndTrgtList(Map<String, Object> map);

	/*
	 * 차량 공유정보 공유 종료
	 */
	public int endCarShareSh(Map<String, Object> map);

	/*
	 * 차량 기본정보 공유 종료
	 */
	public int endCarShareCm(Map<String, Object> map);

	/*
	 * 차량 모바일 기본정보 목록 조회
	 */
	public List<Map<String, Object>> getMoCarBasicInfoList(Map<String, Object> param);
}
