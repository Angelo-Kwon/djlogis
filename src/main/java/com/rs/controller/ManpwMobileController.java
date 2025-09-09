package com.rs.controller;

import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.rs.service.ManpwService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpSession;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/manpw")
public class ManpwMobileController {

	private final ManpwService manpwService;

	@RequestMapping(value = "/getMoManpwList")
	@ResponseBody
	public Map<String, Object> getSh(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		return manpwService.getMoSh(param);
	}

	@RequestMapping(value = "/saveMoManpw")
	@ResponseBody
	public Map<String, Object> saveMoWhouse(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		return manpwService.saveMoManpw(param);
	}

}
