package com.sy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.configuration.jwt.util.SecurityUtil;
import com.sy.mapper.MenuMapper;

/**
 * Main Service
 * 
 * @패키지명 : com.service
 * @파일명 : MainService.java
 * @작성자 : Oh
 * @최초생성일 : 2023.07.04
 * @클래스내역 : =========================================================== DATE
 *        AUTHOR NOTE
 *        ----------------------------------------------------------- 2023.07.04
 *        Oh 최초 생성 ===========================================================
 */

@Service
public class MenuService {

	@Autowired
	private MenuMapper menuMapper;

	public List<Map<String, Object>> getMainMenuList(Map<String, Object> param) {
		String userId = SecurityUtil.getCurrentUserId().get(); // 사용자ID
		param.put("userId", userId);
		return menuMapper.getMainMenuList(param);
	}

	public Map<String, Object> getMenuInfo(Map<String, Object> param) {
		return menuMapper.getMenuInfo(param);
	}

	public Map<String, Object> getSystemList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = menuMapper.getSystemList(param);
		data.put("dataList", dataList);
		return data;
	}

	public Map<String, Object> getMenuList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = menuMapper.getMenuList(param);
		data.put("dataList", dataList);
		return data;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> saveGrid(Map<String, Object> parammap) {
		String userId = SecurityUtil.getCurrentUserId().get(); // 사용자ID

		List<Map<String, Object>> addList = (List<Map<String, Object>>) parammap.get("addList");
		List<Map<String, Object>> updateList = (List<Map<String, Object>>) parammap.get("updateList");
		List<Map<String, Object>> deleteList = (List<Map<String, Object>>) parammap.get("deleteList");
		Map<String, Object> menuIdList = new HashMap<String, Object>();

		for (Map<String, Object> add : addList) {
			add.put("userId", userId);
			if (menuIdList.containsKey(add.get("MENU_PID"))) {
				add.put("MENU_PID", menuIdList.get(add.get("MENU_PID").toString()));
			}
			String menuId = menuMapper.insMenu(add);
			if (add.get("MENU_ID").toString().startsWith("tmp")) {
				menuIdList.put(add.get("MENU_ID").toString(), menuId);
			}
		}

		for (Map<String, Object> upd : updateList) {
			upd.put("userId", userId);
			if (!upd.get("MENU_ID").toString().startsWith("tmp")) {
				menuMapper.updMenu(upd);
			}
		}

		for (Map<String, Object> del : deleteList) {
			del.put("userId", userId);
			menuMapper.delMenu(del);
		}
		return parammap;
	}

	public List<Map<String, Object>> getBookmarkList(Map<String, Object> param) {
		String userId = SecurityUtil.getCurrentUserId().get(); // 사용자ID
		param.put("userId", userId);
		return menuMapper.getBookmarkList(param);
	}

	public Map<String, Object> updBookmark(Map<String, Object> param) {
		String userId = SecurityUtil.getCurrentUserId().get(); // 사용자ID
		param.put("userId", userId);
		if (param.get("isOn").equals("Y")) {
			menuMapper.insBookmark(param);
		} else if (param.get("isOn").equals("N")) {
			menuMapper.delBookmark(param);
		}
		return param;
	}
}