package com.rs.controller;

import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.rs.service.ApvMatchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/apvMatch")
public class ApvMatchController {

	private final ApvMatchService apvMatchService;

	@RequestMapping(value = "/getConId")
	public Map<String, Object> getConId(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = apvMatchService.getConId(param);
		return data;
	}

	@RequestMapping(value = "/getMatReq")
	public Map<String, Object> get(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = apvMatchService.getMatReq(param);
		return data;
	}

	/*
	 * 공유자원사용신청 - 사용 신청
	 */
	@RequestMapping(value = "/saveShUseApply")
	@ResponseBody
	public Map<String, Object> saveShUseApply(@RequestBody Map<String, Object> param) {
		System.out.println("ApvMatchController saveShUseApply");
		return apvMatchService.saveShUseApply(param);
	}

	@RequestMapping(value = "/matApv")
	public Map<String, Object> matApv(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = apvMatchService.matApv(param);
		return data;
	}
}
