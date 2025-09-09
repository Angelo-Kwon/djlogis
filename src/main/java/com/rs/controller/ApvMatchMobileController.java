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
public class ApvMatchMobileController {

	private final ApvMatchService apvMatchService;

	@RequestMapping(value = "/getMoMatReq")
	public Map<String, Object> getMoMatReq(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = apvMatchService.getMoMatReq(param);
		return data;
	}
	
	@RequestMapping(value = "/saveMoMatApply")
	@ResponseBody
	public Map<String, Object> saveMoMatApply(@RequestBody Map<String, Object> param, Model model) {
		return apvMatchService.saveMoMatApply(param);
	}
	@RequestMapping(value = "/matMoApv")
	public Map<String, Object> matMoApv(@RequestBody Map<String, Object> param, Model model) {
		return apvMatchService.matMoApv(param);
	}
}
