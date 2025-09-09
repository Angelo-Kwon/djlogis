package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcMonitorMapper {

	List<Map<String, Object>> selectMonitorList(Map<String, Object> param);

	List<Map<String, Object>> selectMonitorDtlList(Map<String, Object> param);

}
