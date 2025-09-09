package com.rs.controller;

import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rs.service.ConMatchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/conMatch")
public class ConMatchMobileController {

	private final ConMatchService conMatchService;

	@RequestMapping(value = "/getMoMat")
	public Map<String, Object> getMoMat(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = conMatchService.getMoMat(param);
		return data;
	}
	
	@RequestMapping(value = "/matMoEnd")
	public Map<String, Object> matApv(@RequestBody Map<String, Object> param, Model model) {
		Map<String, Object> data = conMatchService.matEnd(param);
		return data;
	}
}
