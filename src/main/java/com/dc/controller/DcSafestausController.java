package com.dc.controller;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.dc.service.DcSafestausService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/dc/safestaus")
public class DcSafestausController {

	@Autowired
	private DcSafestausService dcSafestausService;
	
	@RequestMapping(value = "/selectSafestausList")
	public Map<String, Object> selectSafestausList (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcSafestausService.selectSafestausList(param);
		return data;
	}
	
	@GetMapping(value = "/getWeather")
	public Map<String, Object> getWeather () throws IOException {
		Map<String, Object> data = dcSafestausService.getWeather();
		return data;
	}
	
	@GetMapping(value = "/getWorkStatus")
	public Map<String, Object> getWorkStatus () {
		Map<String, Object> data = dcSafestausService.getWorkStatus();
		return data;
	}
	
	@GetMapping(value = "/getStoRelStatus")
	public Map<String, Object> getStoRelStatus () {
		Map<String, Object> data = dcSafestausService.getStoRelStatus();
		return data;
	}
	
	@GetMapping(value = "/getSaftyStatus")
	public Map<String, Object> getSaftyStatus () {
		Map<String, Object> data = dcSafestausService.getSaftyStatus(); 
		return data;
	}
	
	@PostMapping(value = "/getProductInfo")
	public Map<String, Object> getProductInfo (@RequestBody Map<String, Object> param) {
		Map<String, Object> data = dcSafestausService.getProductInfo(param); 
		return data;
	}
	 
	@RequestMapping(value = "/insertSafeEvent")
	@ResponseBody 
	public Map<String, Object> insertSafeEvent(@RequestParam Map<String, Object> param, Model model, HttpSession session) {	  
	    Map<String, Object> data = dcSafestausService.insertSafeEvent(param);	  
	    return data; 
	}
	 
}
