package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcDashMapper {

	List<Map<String, Object>> selectInTypeList(Map<String, Object> param);

	List<Map<String, Object>> selectOutTypeList(Map<String, Object> param);

	List<Map<String, Object>> selectInCountList(Map<String, Object> param);

	List<Map<String, Object>> selectOutCountList(Map<String, Object> param);

	List<Map<String, Object>> selectWareList(Map<String, Object> param);

	List<Map<String, Object>> selectOwnerList(Map<String, Object> param);
}
