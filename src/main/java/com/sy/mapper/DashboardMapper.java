package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DashboardMapper {
	public List<Map<String, Object>> getShipGridData(Map<String, Object> param);

	public List<Map<String, Object>> getWhouseGridData(Map<String, Object> param);

	public List<Map<String, Object>> getCarGridData(Map<String, Object> param);

	public List<Map<String, Object>> getEquipGridData(Map<String, Object> param);

	public List<Map<String, Object>> getManpwGridData(Map<String, Object> param);

	public List<Map<String, Object>> getNewsGridData(Map<String, Object> param);

	public List<Map<String, Object>> getNoticeGridData(Map<String, Object> param);
	
	public List<Map<String, Object>> getShList(Map<String, Object> param);
	
	public List<Map<String, Object>> getSrList(Map<String, Object> param);

	public List<Map<String, Object>> selectStockBarList(Map<String, Object> map);

	public List<Map<String, Object>> selectStockDouList(Map<String, Object> map);

	public List<Map<String, Object>> selectDeliveryBarList(Map<String, Object> map);

	public List<Map<String, Object>> selectDeliveryDouList(Map<String, Object> map);
	
	public List<Map<String, Object>> selectWorkerDouList(Map<String, Object> map);
	
	public List<Map<String, Object>> selectWorkerBarList(Map<String, Object> map);	
	
	public Map<String, Object> getDownManual(Map<String, Object> param);

	public List<Map<String, Object>> getWhRoleGroup(Map<String, Object> param);

	public List<Map<String, Object>> getWhRoleGroup(String rip);
}
