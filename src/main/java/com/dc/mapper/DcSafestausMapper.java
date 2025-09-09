package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcSafestausMapper {

	List<Map<String, Object>> selectSafestausList(Map<String, Object> param);

	List<Map<String, Object>> getStoreData();

	List<Map<String, Object>> getReleaseData();

	Map<String, Object> getProductInfo(Map<String, Object> param);
	
	int insertSafeEvent(Map<String, Object> param);
}
