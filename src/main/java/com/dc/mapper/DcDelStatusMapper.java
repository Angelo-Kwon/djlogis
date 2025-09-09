package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcDelStatusMapper {

	List<Map<String, Object>> selectDelStatusList(Map<String, Object> param);
	
	List<Map<String, Object>> selectDelCompleteList(Map<String, Object> param);

}
