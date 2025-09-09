package com.sy.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.common.util.SseEmitters;
import com.configuration.jwt.util.SecurityUtil;
import com.sy.mapper.RoleMapper;

/**
 * Role Service
 * 
 * @패키지명 : com.service
 * @파일명 : RoleService.java
 * @작성자 : An
 * @최초생성일 : 2023.07.04
 * @클래스내역 : =========================================================== DATE
 *        AUTHOR NOTE
 *        ----------------------------------------------------------- 2023.07.04
 *        Oh 최초 생성 ===========================================================
 */

@Service
public class RoleService {

	@Autowired
	private RoleMapper roleMapper;
	
	@Autowired
	private SseEmitters sseEmitters;

	public Map<String, Object> getRoleList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = roleMapper.getRoleList(param);
		data.put("dataList", dataList);
		return data;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> saveRole(Map<String, Object> param) {
		String userId = SecurityUtil.getCurrentUserId().get(); // 사용자ID
		System.out.println(param.get("addList"));
		System.out.println(param.get("updateList"));
		System.out.println(param.get("deleteList"));
		List<Map<String, Object>> addList = (List<Map<String, Object>>) param.get("addList");
		List<Map<String, Object>> updateList = (List<Map<String, Object>>) param.get("updateList");
		List<Map<String, Object>> deleteList = (List<Map<String, Object>>) param.get("deleteList");
		boolean isUpdated = false;

		for (Map<String, Object> add : addList) {
			add.put("userId", userId);
			roleMapper.insRole(add);
			isUpdated = true;
		}

		for (Map<String, Object> upd : updateList) {
			upd.put("userId", userId);
			roleMapper.updRole(upd);
			isUpdated = true;
		}

		for (Map<String, Object> del : deleteList) {
			del.put("userId", userId);
			roleMapper.delRole(del);
			isUpdated = true;
		}
		
		if(isUpdated) {
			String rgroupId = this.getRgroupId(userId);
			String rid = (String)param.get("rid");
			
			if(rid.equals(rgroupId)) {
				sseEmitters.send("role", rgroupId, "role_changed"); // 권한 변경 SSE 처리
			}
		}
		
		return param;
	}

	public Map<String, Object> getRoleMenuList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = roleMapper.getRoleMenuList(param);
		data.put("dataList", dataList);
		return data;
	}
	
	public Map<String, Object> getRoleWhouseList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = roleMapper.getRoleWhouseList(param);
		data.put("dataList", dataList);
		return data;
	}


	public Map<String, Object> saveRoleMenu(Map<String, Object> param) {
		String userId = SecurityUtil.getCurrentUserId().get(); // 사용자ID

		List<Map<String, Object>> list =  (List<Map<String, Object>>) param.get("list");
		List<Map<String, Object>> iList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> dList = new ArrayList<Map<String, Object>>();
		boolean isUpdated = false;

		for (Map<String, Object> upd : list) {
			if (upd.get("MENU_GBN").equals("M"))
				continue;
			upd.put("userId", userId);
			dList.add(upd);
			if (upd.get("STATE").toString().equals("true")) {
				iList.add(upd);
			}
		}

		if (dList.size() > 0) {
			roleMapper.delRoleMenu(dList);
			isUpdated = true;
		}

		if (iList.size() > 0) {
			roleMapper.insRoleMenu(iList);
			isUpdated = true;
		}
		
		if(isUpdated) {
			String rgroupId = this.getRgroupId(userId);
			String rid = (String)param.get("rid");
			
			if(rid.equals(rgroupId)) {
				sseEmitters.send("role", rgroupId, "role_changed"); // 권한 변경 SSE 처리
			}
		}

		return param;
	}
	
	public Map<String, Object> saveRoleWhouse(Map<String, Object> param, String rid) {
		int processCnt = 0;

		Map<String, Object> data = new HashMap<String, Object>();
		Map<String, Object> paramData = new HashMap<String, Object>();
		
		List<Map<String, Object>> updateList = (List<Map<String, Object>>) param.get("updateList");
		
		String userId = SecurityUtil.getCurrentUserId().get(); // 사용자ID
		paramData.put("userId" ,userId);
		paramData.put("rid", rid);
		paramData.put("updateList", updateList);
		
		processCnt = roleMapper.insRoleWhouse(paramData);
		data.put("processCnt", processCnt);
		
		return data;
	}
	
	public String getRgroupId(String userId) {
		return roleMapper.getRgroupId(userId);
	}
}