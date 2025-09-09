package com.rs.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface WhouseMapper {

	public String getSeq(String str);

	/*
	 * 창고 기본
	 */
	public List<Map<String, Object>> getWhouseBasicInfoList(Map<String, Object> map);

	public int insertCmWhouse(Map<String, Object> map);
	public int updateCmWhouse(Map<String, Object> map);
	public int deleteCmWhouse(Map<String, Object> map);
	
	public int insertAdWhouse(Map<String, Object> map);
	public int updateAdWhouse(Map<String, Object> map);
	public int saveAdWhouse(Map<String, Object> map);
	/*
	 * public List<Map<String, Object>> getAdWhouseList(Map<String, Object> param);
	 * 
	 * 창고 부가
	 * 
	 * public List<Map<String, Object>> selectAdWhouseInfoList(Map<String, Object>
	 * param);
	 * 
	 * public int saveAdWhouse(Map<String, Object> param);
	 */
	/*
	 * 창고 공유
	 */
	public List<Map<String, Object>> selectShWhouseDetailInfo(Map<String, Object> param);

	public String getShSeq();

	public int saveShWhouseDetailInfo(Map<String, Object> param);

	public int updateShRegCmWhouse(Map<String, Object> param);

	public int updateShWhouseInfo(Map<String, Object> param);
	public int insertMoShWhouse(Map<String, Object> param);
	public int updateMoShWhouse(Map<String, Object> param);
	public int updateMoWhouseShYn(Map<String, Object> param);

	public int deleteShWhouseInfo(Map<String, Object> param);

	public List<Map<String, Object>> selectShWhouseEndlInfo(Map<String, Object> param);

	public int updateShEndWhouseInfo(Map<String, Object> param);

	public int updateShChangCmWhouse(Map<String, Object> param);

	public List<Map<String, Object>> selectMoWhouseList(Map<String, Object> param);
}
