package com.sy.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.configuration.jwt.entity.UserCustom;
import com.sy.service.ContractService;
import com.sy.service.CalculateService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/sy/calculate")
public class CalculateController {

	private final CalculateService calculateService;

	@RequestMapping(value = "/getCalTarget")
	public Map<String, Object> getCalTarget(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = calculateService.getCalTarget(param);
		return data;
	}
	
	@RequestMapping(value = "/saveCalculate")
	public Map<String, Object> saveCalculate(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = calculateService.saveCalculate(param);
		return data;
	}
	
	@RequestMapping(value = "/getCalculate")
	public Map<String, Object> getCalculate(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = calculateService.getCalculate(param);
		return data;
	}
}
