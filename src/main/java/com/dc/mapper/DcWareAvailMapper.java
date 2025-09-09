package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcWareAvailMapper {

	List<Map<String, Object>> selectDcWareAvailList(Map<String, Object> param);
	
	int updateWareAvailInfo(Map<String, Object> map);
	
	String getLatestDate(Map<String, Object> param);
}
