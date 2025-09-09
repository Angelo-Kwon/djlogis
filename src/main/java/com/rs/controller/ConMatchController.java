package com.rs.controller;

import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rs.service.ConMatchService;

import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/conMatch")
public class ConMatchController {

	private final ConMatchService conMatchService;

	@RequestMapping(value = "/getSupId")
	public Map<String, Object> getSupId(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = conMatchService.getSupId(param);
		return data;
	}
	
	@RequestMapping(value = "/getSupNm")
	public Map<String, Object> getSupNm(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = conMatchService.getSupNm(param);
		return data;
	}
	
	@RequestMapping(value = "/getMat")
	public Map<String, Object> getMat(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = conMatchService.getMat(param);
		return data;
	}
	
	@RequestMapping(value = "/matEnd")
	public Map<String, Object> matApv(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = conMatchService.matEnd(param);
		return data;
	}
}
