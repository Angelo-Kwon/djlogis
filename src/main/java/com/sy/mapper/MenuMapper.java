package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MenuMapper {
	public List<Map<String, Object>> getMainMenuList(Map<String, Object> param);

	public Map<String, Object> getMenuInfo(Map<String, Object> param);

	public List<Map<String, Object>> getSystemList(Map<String, Object> param);

	public List<Map<String, Object>> getMenuList(Map<String, Object> param);

	public String insMenu(Map<String, Object> param);

	public void updMenu(Map<String, Object> param);

	public void delMenu(Map<String, Object> param);

	public List<Map<String, Object>> getBookmarkList(Map<String, Object> param);

	public int insBookmark(Map<String, Object> param);

	public int delBookmark(Map<String, Object> param);

}
