package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcWhouseMapper {

	List<Map<String, Object>> selectDcWhouseList(Map<String, Object> param);

}
