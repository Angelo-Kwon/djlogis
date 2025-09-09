package com.main.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.configuration.jwt.util.SecurityUtil;
import com.sy.service.UserManageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class MainController {

	@Autowired
	private UserManageService userManageService;

	@RequestMapping(value = "/dashboard")
	public String getShare(HttpServletRequest request, Model model) {
		String path = request.getServletPath();
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("user_id", SecurityUtil.getCurrentUserId().get());
		param.put("path", path);
		path = path.substring(1);
		System.out.println(" PATH  ::  " + path);

		return path;
	}

	@RequestMapping(value = "/indexPage")
	public void getIndexPage(HttpServletRequest request, Model model, HttpServletResponse response) throws IOException {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("userId", SecurityUtil.getCurrentUserId().get());
		Map<String, Object> userDetail = userManageService.selectUserLastUrl(param);
		String path;
		/*
		 * if (userDetail != null && userDetail.get("lasturl") != null &&
		 * !userDetail.get("lasturl").toString().equals("")) { path =
		 * userDetail.get("lasturl").toString();
		 * 
		 * // 마지막 = 뒤에만 encode String[] parts = path.split("="); if (parts.length > 1) {
		 * String lastPart = parts[parts.length - 1]; path = String.join("=",
		 * Arrays.copyOf(parts, parts.length - 1)) + "=" + URLEncoder.encode(lastPart,
		 * "UTF-8"); // System.out.println(path); } } else { path = "/rs/cm_whouse"; }
		 */
		
		path = "/sy/dashboard";
		// System.out.println("path::::" + path);

		String url = request.getRequestURL().toString();
		url = url.replaceAll(request.getRequestURI().toString(), "") + path;

		response.sendRedirect(url);
	}

	@RequestMapping(value = "/updLastUrl")
	public Map<String, Object> updLastUrl(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		return userManageService.updLastUrl(param);
	}

}
