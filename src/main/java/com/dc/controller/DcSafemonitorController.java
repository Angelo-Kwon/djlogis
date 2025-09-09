package com.dc.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dc.service.DcSafemonitorService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/dc/safemonitor")
public class DcSafemonitorController {

	@Autowired
	private DcSafemonitorService dcSafemonitorService;
	
	@RequestMapping(value = "/selectSafemonitorList")
	public Map<String, Object> selectSafemonitorList (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcSafemonitorService.selectSafemonitorList(param);
		return data;
	}
	
	@RequestMapping(value = "/selectSafemonitorDtlList")
	public Map<String, Object> selectSafemonitorDtlList (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcSafemonitorService.selectSafemonitorDtlList(param);
		return data;
	}
	
	@RequestMapping(value = "/selectSafeEventList")		
	public Map<String, Object> selectSafeEventList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		Map<String, Object> data = dcSafemonitorService.selectSafeEventList(param);
		return data;
	}
	
}