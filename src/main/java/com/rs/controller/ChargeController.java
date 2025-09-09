package com.rs.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rs.service.ChargeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/charge")
public class ChargeController {

	private final ChargeService chargeService;

	@RequestMapping(value = "/getConId")
	public Map<String, Object> getConId(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = chargeService.getConId(param);
		return data;
	}

	@RequestMapping(value = "/getConNm")
	public Map<String, Object> getConNm(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = chargeService.getConNm(param);
		return data;
	}

	@RequestMapping(value = "/getMat")
	public Map<String, Object> getWhouseSupMatchList(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = chargeService.getMat(param);
		return data;
	}

	@RequestMapping(value = "/charge")
	public Map<String, Object> matApv(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = chargeService.charge(param);
		return data;
	}
}
