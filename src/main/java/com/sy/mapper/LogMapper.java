package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LogMapper {

	int selectLogCnt(Map<String, Object> param);

	List<Map<String, Object>> selectLogList(Map<String, Object> param);

	int insertLog(Map<String, Object> param);

	int updateLog(Map<String, Object> param);

}
