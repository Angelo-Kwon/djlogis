package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcCarMapper {

	List<Map<String, Object>> getDelv(Map<String, Object> param);

	Map<String, Object> getDelvDtl(Map<String, Object> param);
	
	List<Map<String, Object>> getSend(Map<String, Object> param);

	Map<String, Object> getSendDtl(Map<String, Object> param);

	List<Map<String, Object>> getRealDelv(Map<String, Object> param);

	Map<String, Object> getRealDelvCount(Map<String, Object> param);
	
	List<Map<String, Object>> selectCenterList(Map<String, Object> param);
	
	List<Map<String, Object>> getPathButton(Map<String, Object> param);
	
	Map<String, Object> getStateCount(Map<String, Object> param);
	
	List<Map<String, Object>> carGridList(Map<String, Object> param);	
}
