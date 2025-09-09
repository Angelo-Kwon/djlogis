package com.common.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.common.dto.GridColumnLayoutDTO;
import com.common.dto.GridSettingLayoutDTO;

@Mapper
public interface CommonMapper {

	/*
	 * 공통코드 조회
	 */
	public List<Map<String, Object>> getCommCode(Map<String, Object> map);

	/*
	 * 공통코드 조회
	 */
	public List<Map<String, Object>> getCorpCode(Map<String, Object> map);

	/*
	 * 로그인 사용자 조회
	 */
	public Map<String, Object> getUser(Map<String, Object> param);

	/*
	 * 사용자 Grid Setting Layout 조회
	 */
	List<GridSettingLayoutDTO> selectGridSettingLayout(Map<String, Object> params);

	/*
	 * 사용자 Grid Column Layout 조회
	 */
	List<GridColumnLayoutDTO> selectGridColumnLayout(Map<String, Object> params);

	/*
	 * 사용자 Grid Setting Layout 저장
	 */
	int mergeSettingLayout(GridSettingLayoutDTO dto);

	/*
	 * 사용자 Grid Column Layout 저장
	 */
	int mergeColumnLayout(HashMap<String, Object> map);

	/*
	 * 사용자 Grid Setting Layout 삭제
	 */
	void deleteColumnLayout(HashMap<String, Object> map);

	/*
	 * 사용자 Grid Column Layout 삭제
	 */
	void deleteSettingLayout(HashMap<String, Object> map);
}
