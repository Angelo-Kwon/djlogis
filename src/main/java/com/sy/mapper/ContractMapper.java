package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ContractMapper {

	/*
	 * 계약등록 - 시스템 목록 조회
	 */
	public List<Map<String, Object>> getSystemList(Map<String, Object> map);

	/*
	 * 계약등록 - 업체정보 목록 조회
	 */
	public List<Map<String, Object>> getCustInfoList(Map<String, Object> map);

	/*
	 * 계약등록 - 계약기간 시스템 중복 조회
	 */
	public Map<String, Object> getContractTerm(Map<String, Object> param);

	/*
	 * 계약등록 - 계약 목록 조회
	 */
	public List<Map<String, Object>> getContractList(Map<String, Object> map);

	/*
	 * 계약등록 - 계약ID 중복검사
	 */
	public String checkIdDup(Map<String, Object> map);

	/*
	 * 계약등록 - 사용자 입력
	 */
	public int saveUser(Map<String, Object> map);

	/*
	 * 계약등록 - 사용자 그룹 입력
	 */
	public int saveUserGroup(Map<String, Object> map);

	/*
	 * 계약등록 - 어카운트 업체마스터 입력
	 */
	public int saveAtct(Map<String, Object> map);

	/*
	 * 계약등록 - 계약키 조회
	 */
	public String getContractId();

	/*
	 * 계약등록 - 업체별 계약정보 입력
	 */
	public int saveContract(Map<String, Object> map);

	/*
	 * 계약등록 - 업체별 계약정보 상세 입력
	 */
	public int saveContractDetail(Map<String, Object> map);

}
