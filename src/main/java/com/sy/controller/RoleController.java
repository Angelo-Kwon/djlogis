package com.sy.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sy.service.RoleService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/sy/role")
public class RoleController {

	@Autowired
	private RoleService roleService;

	/*
	 * 권한 등록 - 권한 목록
	 */
	@RequestMapping(value = "/getRoleList")
	public Map<String, Object> getRoleList(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = roleService.getRoleList(param);
		return data;
	}

	/*
	 * 권한 등록 - 권한 저장
	 */
	@RequestMapping(value = "/saveRole")
	public Map<String, Object> saveRole(@RequestParam Map<String, Object> param, Model model, HttpSession session)
			throws JsonMappingException, JsonProcessingException {

		String paramlist = param.get("list").toString();

		// ObjectMapper 생성
		ObjectMapper objectMapper = new ObjectMapper();

		// JSON을 맵으로 변환
		Map<String, Object> parammap = objectMapper.readValue(paramlist, Map.class);

		parammap = roleService.saveRole(parammap);

		return parammap;
	}

	/*
	 * 권한 등록 - 권한별 메뉴 목록
	 */
	@RequestMapping(value = "/getRoleMenuList")
	public Map<String, Object> getRoleMenuList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		Map<String, Object> data = roleService.getRoleMenuList(param);
		return data;
	}

	/*
	 * 권한 등록 - 권한별 창고 목록
	 */
	@RequestMapping(value = "/getRoleWhouseList")
	public Map<String, Object> getRoleWhouseList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		Map<String, Object> data = roleService.getRoleWhouseList(param);
		return data;
	}

	/*
	 * 권한 등록 - 권한별 메뉴 저장
	 */
	@RequestMapping(value = "/saveRoleMenu")
	public Map<String, Object> saveRoleMenu(@RequestParam Map<String, Object> param, Model model, HttpSession session)
			throws JsonMappingException, JsonProcessingException {

		String _paramlist = param.get("list").toString();

		// ObjectMapper 생성
		ObjectMapper objectMapper = new ObjectMapper();

		// JSON을 리스트로 변환
		List<Map<String, Object>> paramlist = objectMapper.readValue(_paramlist, List.class);

		param.put("list", paramlist);
		param = roleService.saveRoleMenu(param);

		return param;
	}
	

	/*
	 * 권한 등록 - 권한그룹별 창고 저장
	 */
	@RequestMapping(value = "/saveRoleWhouse")
	public Map<String, Object> saveRoleWhouse(@RequestParam Map<String, Object> param, HttpSession session)
			throws JsonMappingException, JsonProcessingException {

		String rid = param.get("rid").toString();
		String paramList = param.get("list").toString();
		

		Map<String, Object> data = new HashMap<String, Object>();
		
		// ObjectMapper 생성
		ObjectMapper objectMapper = new ObjectMapper();

		// JSON을 맵으로 변환
		Map<String, Object> map = objectMapper.readValue(paramList, Map.class);
		
		map = roleService.saveRoleWhouse(map, rid);

		return map;
	}

}
