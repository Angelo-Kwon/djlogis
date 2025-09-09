package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserManageMapper {

	public List<Map<String, Object>> selectUserInfoList(Map<String, Object> param);

	public List<Map<String, Object>> selectCompkeyList();

	public List<Map<String, Object>> selectOwnerkyList();

	public List<Map<String, Object>> selectPtnrkeyList();

	public int updateUserInfo(Map<String, Object> param);

	public int updateUserRoleGrp(Map<String, Object> param);

	public String selectNewUserId();

	public int userInsertInfo(Map<String, Object> param);

	public int insertUserRoleGrp(Map<String, Object> param);

	public Map<String, Object> selectUserInfoDetail(String username);

	public Map<String, Object> selectUserLastUrl(Map<String, Object> param);

	public int updLastUrl(Map<String, Object> param);

}
