package com.dc.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.configuration.jwt.util.SecurityUtil;
import com.dc.service.DcWhouseService;

@Controller
@RequestMapping(value = "/dc")
public class DcWhouseController {

	@Autowired
	private DcWhouseService dcWhouseService; 

	/**
	 * @매서드명 : getDcWhouse
	 * @매서드기능 : 관제 관리 화면 이동.
	 * @작성날짜 : 2023.09.15
	 * @param request
	 * @return String
	 */
	@RequestMapping(value = "/**")
	public String getDcWhouse (HttpServletRequest request, Model model) {
		String path = request.getServletPath();
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("user_id", SecurityUtil.getCurrentUserId().get());
		param.put("path", path);
		path = path.substring(1);
		System.out.println(" PATH  ::  " + path);

		return path;
	}
	
	/**
	 * @매서드명 : selectDcWhouseList
	 * @매서드기능 : 창고정보 목록
	 * @작성날짜 : 2023.09.18
	 * @param request
	 * @return String
	 */
	@PostMapping(value = "/dcwhouse/selectDcWhouseList")
	@ResponseBody
	public Map<String, Object> selectDcWhouseList (@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		
		Map<String, Object> data = dcWhouseService.selectDcWhouseList(param);

		return data;
	}
	
}