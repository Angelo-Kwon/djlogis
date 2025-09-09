package com.dc.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dc.service.DcWareAvailService;

@Controller
@RequestMapping(value = "/dc/ware")
public class DcWareAvailController {

	@Autowired
	private DcWareAvailService dcWareAvailService; 
	
	@PostMapping(value = "/selectDcWareAvailList")
	@ResponseBody
	public Map<String, Object> selectDcWareAvailList (@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		
		Map<String, Object> data = dcWareAvailService.selectDcWareAvailList(param);

		return data;
	}
	
	@RequestMapping(value = "/selectGridInfoList")
	@ResponseBody
	public Map<String, Object> selectGridInfoList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = dcWareAvailService.selectGridInfoList(param);

		return data;
	}
	
	@PostMapping(value = "/saveWareAvailInfo")
	@ResponseBody
	public Map<String, Object> saveWareAvailInfo (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcWareAvailService.saveWareAvailInfo(param);
		return data;
	}
	
}
