package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CalculateMapper {

	public List<Map<String, Object>> getCalTarget(Map<String, Object> map);
	
	public int saveCalculate(Map<String, Object> map);
	
	public List<Map<String, Object>> getCalculate(Map<String, Object> map);

	public int updateContractStatus(Map<String, Object> param);
}
