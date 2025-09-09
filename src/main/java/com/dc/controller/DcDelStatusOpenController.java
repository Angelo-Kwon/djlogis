package com.dc.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dc.service.DcDelStatusOpenService;
import com.dc.service.DcDelStatusService;

@Controller
@RequestMapping(value = "/dcopen")
public class DcDelStatusOpenController {

	@Autowired
	private DcDelStatusOpenService dcDelStatusOpenService;
	
	/**
	 * @매서드명 : selectDelStatusList
	 * @매서드기능 : 배송현황
	 * @작성날짜 : 2023.09.19
	 * @param request
	 * @return String
	 */
	@PostMapping(value = "/dcdel/selectDelStatusList")
	@ResponseBody
	public Map<String, Object> selectDelStatusList (@RequestParam Map<String, Object> param, Model model,HttpSession session) {
		
		Map<String, Object> data = dcDelStatusOpenService.selectDelStatusList(param);

		return data;
	}
	
	
	/**
	 * @매서드명 : selectDelCompleteList
	 * @매서드기능 : 납품완료
	 * @작성날짜 : 2023.09.19
	 * @param request
	 * @return String
	 */
	@PostMapping(value = "/dcdel/selectDelCompleteList")
	@ResponseBody
	public Map<String, Object> selectDelCompleteList (@RequestParam Map<String, Object> param, Model model,HttpSession session) {
		
		Map<String, Object> data = dcDelStatusOpenService.selectDelCompleteList(param);

		return data;
	}
	
}