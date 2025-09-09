package com.rs.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EquipMapper {

	public List<Map<String, Object>> getEquipList(Map<String, Object> map); // 리스트

	public List<Map<String, Object>> getAdEquipList(Map<String, Object> map); // 리스트

	public List<Map<String, Object>> getShEquipList(Map<String, Object> map); // 리스트

	public List<Map<String, Object>> selectShEndEquipInfo(Map<String, Object> map); // 리스트

	public int insertEquipBasicInfo(Map<String, Object> map); // 생성
	public int insertCmEquip(Map<String, Object> map); // 기자재 생성
	public int updateCmEquip(Map<String, Object> map); // 기자재 저장
	public int deleteCmEquip(Map<String, Object> map); // 기자재 삭제

	public int insertAdEquip(Map<String, Object> map); // 기자재 부가정보 등록
	public int updateAdEquip(Map<String, Object> map); // 기자재 부가정보 수정
	public int saveAdEquip(Map<String, Object> map); // 기자재 부자정보 저장
	
	public int insertMoShEquip(Map<String, Object> map); // 기자재 공유정보 등록
	public int updateMoShEquip(Map<String, Object> map); // 기자재 공유정보 수정
	public int updateMoEquipShYn(Map<String, Object> map); // 기자재 공유상태 수정

	public int insertAdEquipBasicInfo(Map<String, Object> map); // 부기자재 생성

	public int insertShEquipBasicInfo(Map<String, Object> map); // 부기자재 생성

	public int updateEquipBasicInfo(Map<String, Object> map); // 수정

	public int updateEquipInfo(Map<String, Object> map); // 수정

	public int upShdateEquipBasicInfo(Map<String, Object> map); // 수정

	public int upAddateEquipBasicInfo(Map<String, Object> map); // 수정

	public int insertShEquip(Map<String, Object> map);

	public int updateShEquip(Map<String, Object> map);

	public int updateCmEquipShYn(Map<String, Object> map);

	public int deleteEquipBasicInfo(Map<String, Object> map); // 삭제

	public int deleteShEndEquipBasicInfo(List<Map<String, Object>> map); // 삭제

	public int deleteShEquipBasicInfo(Map<String, Object> map); // 삭제

	public String makeFileSeqName(); // 파일이름만들기

	public String getEqUseYn(Map<String, Object> map); // 파일이름만들기

	public Map<String, Object> selectEquipId(); // 최근 EQ ID

	public Map<String, Object> getEquipInfo(Map<String, Object> map); // 최근 EQ ID

	public Map<String, Object> getAdEquipInfo(Map<String, Object> map); // 최근 EQ ID

	public Map<String, Object> getShEquipInfo(Map<String, Object> map); // 최근 EQ ID

	public Map<String, Object> getShEquipSeq(Map<String, Object> map); // 최근 EQ ID

	public int selectMoEquipCnt(Map<String, Object> map); // 모바일 리스트 건 수

	public List<Map<String, Object>> selectMoEquipList(Map<String, Object> map); // 모바일 리스트

}
