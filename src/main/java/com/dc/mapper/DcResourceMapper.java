package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcResourceMapper {

	List<Map<String, Object>> selectDcResourceList(Map<String, Object> param);

	int insertDcResourceInfo(Map<String, Object> param);

	int saveDcResourceInfo(Map<String, Object> dataItem);

	int deleteDcResourceInfo(Map<String, Object> dataMap);

}
