package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcSafesceneMapper {

	List<Map<String, Object>> selectSafesceneList(Map<String, Object> param);
 
	int createSafescene(Map<String, Object> param);

	int updateSafescene(Map<String, Object> param);

	int deleteSafescene(Map<String, Object> param);

}
