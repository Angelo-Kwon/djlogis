package com.rs.controller;

import java.util.Map;

import com.configuration.jwt.entity.UserCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.ui.Model;

import com.rs.service.WhouseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpSession;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/whouse")
public class WhouseMobileController {

	@Autowired
	private WhouseService whouseService;

	/**
	 * @매서드명 : selectMoCmWhouseList
	 * @매서드기능 : 모바일 창고 기본정보 목록 조회
	 * @작성날짜 : 2023.08.29
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/selectMoCmWhouseList")
	@ResponseBody
	public Map<String, Object> selectMoCmWhouseList(@RequestBody Map<String, Object> param, Model model, HttpSession session,@AuthenticationPrincipal UserCustom user) {
		System.out.println("WhouseMobileController selectMoCmWhouseList " + param);
		return whouseService.selectMoCmWhouseList(param);
	}

	/**
	 * @매서드명 : selectMoCmWhouseList
	 * @매서드기능 : 모바일 창고 기본정보 목록 조회
	 * @작성날짜 : 2023.08.29
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/saveMoWhouse")
	@ResponseBody
	public Map<String, Object> saveMoWhouse(@RequestBody Map<String, Object> param, Model model,HttpSession session) {
		return whouseService.saveMoWhouse(param);
	}
}
