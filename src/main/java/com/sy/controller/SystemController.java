package com.sy.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.configuration.jwt.util.SecurityUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sy.service.SystemService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
public class SystemController {

	@Autowired
	private SystemService systemService;
	
	/**
	 * @매서드명 : getSystem
	 * @매서드기능 : 운영 관리 화면 이동.
	 * @작성날짜 : 2023.07.15
	 * @param request
	 * @return String
	 */
	@RequestMapping(value = "/sy/**")
	public String getSystem(HttpServletRequest request, Model model) {
		String path = request.getServletPath();
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("user_id", SecurityUtil.getCurrentUserId().get());
		param.put("path", path);
		path = path.substring(1);
		System.out.println(" PATH  ::  " + path);

		return path;
	}

	/**
	 * @매서드명 : getCommon
	 * @매서드기능 : 로그인, 회원가입 화면 이동.
	 * @작성날짜 : 2023.07.22
	 * @param request
	 * @return String
	 */
	@RequestMapping(value = "/com/**")
	public String getCommon(HttpServletRequest request, Model model) {
		String path = request.getServletPath();
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("path", path);
		path = path.substring(1);
		System.out.println(" PATH  ::  " + path);

		return path;
	}
	
	/**
	 * @매서드명 : getDT
	 * @매서드기능 : DT 화면 이동.
	 * @작성날짜 : 2024.06.05
	 * @param request
	 * @return String
	 */
	@RequestMapping(value = "/dc/dc_dt")
	public String getDT(HttpServletRequest request) {
		return "dc/dc_dt.html";
	}

	/**
	 * @매서드명 : selectOpSystemList
	 * @매서드기능 : 시스템관리 목록 조회
	 * @작성날짜 : 2023.08.11
	 * @param param
	 * @return Map<String, Object>
	 */
	@GetMapping(value = "/sy/system/selectOpSystemList")
	@ResponseBody
	public Map<String, Object> selectOpSystemList(@RequestParam Map<String, Object> param,
			HttpSession session) {

		Map<String, Object> data = systemService.selectOpSystemList(param);

		return data;
	}

	/**
	 * @매서드명 : insertOpSystemInfo
	 * @매서드기능 : 시스템관리 기본정보 신규 생성 및 수정
	 * @작성날짜 : 2023.08.11
	 * @param param
	 * @return Map<String, Object>
	 * @throws JsonProcessingException 
	 * @throws JsonMappingException 
	 */
	@PostMapping(value = "/sy/system/insertOpSystemInfo")
	@ResponseBody
	public Map<String, Object> insertOpSystemInfo(@RequestParam Map<String, Object> param
			, HttpSession session) throws JsonMappingException, JsonProcessingException {

		String paramList = param.get("list").toString();
		
		// ObjectMapper 생성
		ObjectMapper objectMapper = new ObjectMapper();

		// JSON을 맵으로 변환
		Map<String, Object> map = objectMapper.readValue(paramList, Map.class);
		
		map = systemService.insertOpSystemInfo(map);

		return map;

	}
	
	/**
	 * @매서드명 : getPortal
	 * @매서드기능 : 포털 화면 이동.
	 * @작성날짜 : 2023.12.20
	 * @param request
	 * @return String
	 */
	@GetMapping(value = "/www/**")
	public String getPortal(HttpServletRequest request) {
		String path = request.getServletPath();
		path = path.substring(1);

		if (path.equals("www")) {
			path = "www/00_imdex";
		}
		return path;
	}
	
	
}