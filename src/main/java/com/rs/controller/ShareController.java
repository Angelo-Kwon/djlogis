package com.rs.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.configuration.jwt.util.SecurityUtil;

import javax.servlet.http.HttpServletRequest;

@Controller
public class ShareController {

	/**
	 * @매서드명 : getShare
	 * @매서드기능 : 물류 곻유 화면 이동.
	 * @작성날짜 : 2023.07.11
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/rs/**")
	public String getShare(HttpServletRequest request, Model model) {
		String path = request.getServletPath();
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("user_id", SecurityUtil.getCurrentUserId().get());
		param.put("path", path);
		path = path.substring(1);

		return path;
	}
}
