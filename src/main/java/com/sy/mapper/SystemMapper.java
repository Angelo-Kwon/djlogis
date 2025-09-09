package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SystemMapper {

	List<Map<String, Object>> selectOpSystemList(Map<String, Object> param);

	int insertOpSystemInfo(Map<String, Object> dataMap);

	int updateOpSystemUseYn(Map<String, Object> insertMap);

}
