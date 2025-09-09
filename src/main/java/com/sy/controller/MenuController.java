package com.sy.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sy.service.MenuService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/sy/menu")
public class MenuController {

	@Autowired
	private MenuService menuService;

	@RequestMapping(value = "/getMainMenuList")
	@ResponseBody
	public Map<String, Object> getMainMenuList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		Map<String, Object> result = new HashMap<>();
		result.put("menu", menuService.getMainMenuList(param));
		result.put("system", menuService.getSystemList(param));
		result.put("bookmark", menuService.getBookmarkList(param));
		return result;
	}

	/*
	 * 메뉴 등록 - 시스템 목록
	 */
	@RequestMapping(value = "/getSystemList")
	public Map<String, Object> getSystemList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		Map<String, Object> data = menuService.getSystemList(param);
		return data;
	}

	/*
	 * 메뉴 등록 - 메뉴 목록
	 */
	@RequestMapping(value = "/getMenuList")
	public Map<String, Object> getMenuList(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = menuService.getMenuList(param);
		return data;
	}

	/*
	 * 메뉴 등록 - 메뉴 저장
	 */
	@RequestMapping(value = "/saveGrid")
	public Map<String, Object> saveGrid(@RequestParam Map<String, Object> param, Model model, HttpSession session)
			throws JsonMappingException, JsonProcessingException {

		String paramlist = param.get("list").toString();

		// ObjectMapper 생성
		ObjectMapper objectMapper = new ObjectMapper();

		// JSON을 맵으로 변환
		Map<String, Object> parammap = objectMapper.readValue(paramlist, Map.class);

		parammap = menuService.saveGrid(parammap);

		return parammap;
	}

	/*
	 * 즐겨찾기
	 */
	@RequestMapping(value = "/updBookmark")
	public Map<String, Object> updBookmark(@RequestParam Map<String, Object> param, Model model, HttpSession session)
			throws JsonMappingException, JsonProcessingException {
		return menuService.updBookmark(param);

	}
}
