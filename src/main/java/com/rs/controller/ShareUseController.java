package com.rs.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import com.configuration.jwt.entity.UserCustom;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.rs.service.ShareUseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/shareUse")
public class ShareUseController {

	private final ShareUseService shareUseService;

	@RequestMapping(value = "/getWhouseList")
	public Map<String, Object> getWhouseList(@RequestParam Map<String, Object> param) {
		System.out.println("ShareUseController getWhouseList");
		return shareUseService.getWhouseList(param);
	}
	@RequestMapping(value = "/getCarList")
	public Map<String, Object> getCarList(@RequestParam Map<String, Object> param) {
		System.out.println("ShareUseController getCarList");
		return shareUseService.getCarList(param);
	}
	@RequestMapping(value = "/getEquipList")
//	@ResponseBody
	public Map<String, Object> getEquipList(@RequestParam Map<String, Object> param) {
		return shareUseService.getEquipList(param);
	}

	/*
	 * 공유자원사용신청 - 사용 신청
	 */
	@RequestMapping(value = "/saveShUseApply")
	@ResponseBody
	public Map<String, Object> saveShUseApply(@RequestBody Map<String, Object> param) {
		System.out.println("ShareUseController saveShUseApply");
		return shareUseService.saveShUseApply(param);
	}
}
