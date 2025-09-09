package com.rs.controller;

import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rs.service.SupMatchService;

import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/supMatch")
public class SupMatchController {

	private final SupMatchService supMatchService;

	@RequestMapping(value = "/getConId")
	public Map<String, Object> getConId(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = supMatchService.getConId(param); 
		return data;
	}
	
	@RequestMapping(value = "/getConNm")
	public Map<String, Object> getConNm(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = supMatchService.getConNm(param);
		return data;
	}
	
	@RequestMapping(value = "/getMat")
	public Map<String, Object> getWhouseSupMatchList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		Map<String, Object> data = supMatchService.getMat(param);
		return data;
	}
	
	@RequestMapping(value = "/matEnd")
	public Map<String, Object> matApv(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = supMatchService.matEnd(param);
		return data;
	}
}
