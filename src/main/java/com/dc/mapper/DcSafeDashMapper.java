package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcSafeDashMapper {

	List<Map<String, Object>> selectSafeDashList(Map<String, Object> param);

}
