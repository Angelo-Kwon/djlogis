package com.dc.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dc.service.DcResourceService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/dc/resource")
public class DcResourceController {

	@Autowired
	private DcResourceService dcResourceService; 

	/**
	 * @매서드명 : selectDcResourceList
	 * @매서드기능 : 자원 정보 목록
	 * @작성날짜 : 2023.09.18
	 * @param request
	 * @return String
	 */
	@PostMapping(value = "/selectDcResourceList")
	@ResponseBody
	public Map<String, Object> selectDcResourceList (@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		
		Map<String, Object> data = dcResourceService.selectDcResourceList(param);

		return data;
	}
	
	/**
	 * @매서드명 : insertDsResourceInfo
	 * @매서드기능 : 자원 정보 저장
	 * @작성날짜 : 2023.09.22
	 * @param request
	 * @return String
	 */
	@PostMapping(value = "/insertDcResourceInfo")
	@ResponseBody
	public Map<String, Object> insertDcResourceInfo (@RequestParam Map<String, Object> param, Model model,
			HttpSession session) throws JsonMappingException, JsonProcessingException {
		
		String paramList = param.get("list").toString();
		
		// ObjectMapper 생성
		ObjectMapper objectMapper = new ObjectMapper();

		// JSON을 맵으로 변환
		Map<String, Object> map = objectMapper.readValue(paramList, Map.class);
		
		map = dcResourceService.insertDcResourceInfo(map);
		
		return map;
	}
	
}