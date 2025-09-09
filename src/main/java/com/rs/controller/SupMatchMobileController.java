package com.rs.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rs.service.SupMatchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/supMatch")
public class SupMatchMobileController {

	private final SupMatchService supMatchService;

	@RequestMapping(value = "/getMoMat")
	public Map<String, Object> getMoWhouseSupMatchList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		Map<String, Object> data = supMatchService.getMoMat(param);
		return data;
	}
	
	@RequestMapping(value = "/matMoEnd")
	public Map<String, Object> matApv(@RequestBody Map<String, Object> param, Model model) {
		Map<String, Object> data = supMatchService.matEnd(param);
		return data;
	}
}
