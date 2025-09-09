package com.rs.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardMapper {

	List<Map<String, Object>> selectShBoardList(Map<String, Object> param);

	Map<String, Object> selectShBoardDetailInfo(Map<String, Object> param);

	int insertShBoardInfo(Map<String, Object> param);

	int deleteShBoardInfo(Map<String, Object> param);

	int updateShConBoardInfo(Map<String, Object> param);
	
	int updateShSupBoardInfo(Map<String, Object> param);
	
	String selectWhouseNm(Map<String, Object> param);
	String selectCarFullNo(Map<String, Object> param);
	String selectEquipNm(Map<String, Object> param);
	int insertMoShBoard(Map<String, Object> param);
	int updateMoShBoardResMark(Map<String, Object> param);

	List<Map<String, Object>> selectMoShBoardList(Map<String, Object> param);

	String getUserPhone(Map<String, Object> param);

}
