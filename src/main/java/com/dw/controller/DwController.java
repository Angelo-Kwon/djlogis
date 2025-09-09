package com.dw.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.configuration.jwt.util.SecurityUtil;

import javax.servlet.http.HttpServletRequest;

@Controller
public class DwController {
	
	@RequestMapping(value = "/dw/**")
	public String getDwShare(HttpServletRequest request, Model model) {
		String path = request.getServletPath();
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("user_id", SecurityUtil.getCurrentUserId().get());
		param.put("path", path);
		path = path.substring(1);
		System.out.println(" PATH  ::  " + path);

		return path;
	}
}
