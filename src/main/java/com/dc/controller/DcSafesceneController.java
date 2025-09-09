package com.dc.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dc.service.DcResourceService;
import com.dc.service.DcSafesceneService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/dc/safescene")
public class DcSafesceneController {

	@Autowired
	private DcSafesceneService dcSafesceneService; 

	@PostMapping(value = "/selectSafesceneList")
	@ResponseBody
	public Map<String, Object> selectSafesceneList (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcSafesceneService.selectSafesceneList(param);
		return data;
	}
	
	@PostMapping(value = "/saveSafescene")
	@ResponseBody
	public Map<String, Object> saveSafescene (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcSafesceneService.saveSafescene(param);
		return data;
	}
	
}