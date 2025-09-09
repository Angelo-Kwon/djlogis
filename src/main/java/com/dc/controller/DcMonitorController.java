package com.dc.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dc.service.DcMonitorService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/dc/monitor")
public class DcMonitorController {

	@Autowired
	private DcMonitorService dcMonitorService;
	
	@RequestMapping(value = "/selectMonitorList")
	public Map<String, Object> selectMonitorList (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcMonitorService.selectMonitorList(param);
		return data;
	}
	
	@RequestMapping(value = "/selectMonitorDtlList")
	public Map<String, Object> selectMonitorDtlList (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcMonitorService.selectMonitorDtlList(param);
		return data;
	}
	
}