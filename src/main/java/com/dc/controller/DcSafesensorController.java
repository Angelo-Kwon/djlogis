package com.dc.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.dc.service.DcSafesensorService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/dc/safesensor")
public class DcSafesensorController {

	@Autowired
	private DcSafesensorService dcSafesensorService;
	
	@RequestMapping(value = "/selectSafesensorList")
	public Map<String, Object> selectSafesensorList (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcSafesensorService.selectSafesensorList(param);
		return data;
	}
	
	@PostMapping(value = "/saveSafesensor")
	public Map<String, Object> saveSafesensor (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcSafesensorService.saveSafesensor(param);
		return data;
	}
}