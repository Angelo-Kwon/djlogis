package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcSafemonitorMapper {

	List<Map<String, Object>> selectSafemonitorList(Map<String, Object> param);

	List<Map<String, Object>> selectSafemonitorDtlList(Map<String, Object> param);

}
