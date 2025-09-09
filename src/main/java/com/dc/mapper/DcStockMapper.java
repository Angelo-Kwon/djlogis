package com.dc.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DcStockMapper {

	List<Map<String, Object>> selectStockList(Map<String, Object> param);

	List<Map<String, Object>> selectStockDtlList(Map<String, Object> param);

}
