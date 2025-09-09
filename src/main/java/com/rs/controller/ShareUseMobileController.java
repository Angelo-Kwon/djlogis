package com.rs.controller;

import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.rs.service.ShareUseService;

import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/shareUse")
public class ShareUseMobileController {

	private final ShareUseService shareUseService;

	/*
	 * 모바일 공유자원사용신청 - 목록 조회
	 */
	@RequestMapping(value = "/getMoShareWhouseList")
	@ResponseBody
	public Map<String, Object> getMoShareWhouseList(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		return shareUseService.getMoShareWhouseList(param);
	}
	/*
	 * 모바일 공유자원사용신청 - 목록 조회
	 */
	@RequestMapping(value = "/getMoShareCarList")
	@ResponseBody
	public Map<String, Object> getMoShareCarList(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		return shareUseService.getMoShareCarList(param);
	}
	/*
	 * 모바일 공유자원사용신청 - 목록 조회
	 */
	@RequestMapping(value = "/getMoShareEquipList")
	@ResponseBody
	public Map<String, Object> getMoShareEquipList(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		return shareUseService.getMoShareEquipList(param);
	}
	/*
	 * 모바일 공유종료
	 */
	@RequestMapping(value = "/saveMoShareShYn")
	@ResponseBody
	public Map<String, Object> saveMoShareShYn(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		System.out.println("ShareUseController saveMoShareShYn");
		return shareUseService.saveMoShareShYn(param);
	}

	/*
	 * 모바일 공유자원사용신청 - 사용 신청
	 */
	@RequestMapping(value = "/saveMoShUseApply")
	@ResponseBody
	public Map<String, Object> saveMoShUseApply(@RequestBody Map<String, Object> param) {
		System.out.println("ShareUseController saveMoShUseApply");
		return shareUseService.saveMoShUseApply(param);
	}
}
