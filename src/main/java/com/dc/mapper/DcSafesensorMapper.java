package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcSafesensorMapper {

	List<Map<String, Object>> selectSafesensorList(Map<String, Object> param);

	int createSafesensor(Map<String, Object> map);

	int updateSafesensor(Map<String, Object> map);

	int deleteSafesensor(Map<String, Object> map);

}
