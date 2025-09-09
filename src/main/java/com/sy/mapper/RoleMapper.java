package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RoleMapper {
	public List<Map<String, Object>> getRoleList(Map<String, Object> param);

	public void insRole(Map<String, Object> param);

	public void updRole(Map<String, Object> param);

	public void delRole(Map<String, Object> param);

	public List<Map<String, Object>> getRoleMenuList(Map<String, Object> param);
	
	public List<Map<String, Object>> getRoleWhouseList(Map<String, Object> param);

	public void insRoleMenu(List<Map<String, Object>> param);

	public void delRoleMenu(List<Map<String, Object>> param);

	public int insRoleWhouse(Map<String, Object> param);

	public String getRgroupId(String userId);
}
