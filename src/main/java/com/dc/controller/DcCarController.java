package com.dc.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.dc.service.DcCarService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/dc/car")
public class DcCarController {

	private final DcCarService dcCarService;

	@RequestMapping(value = "/getDelv")
	public Map<String, Object> getDelv(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dcCarService.getDelv(param);
		return data;
	}
	
	@RequestMapping(value = "/getDelvDtl")
	public Map<String, Object> getDelvDtl(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dcCarService.getDelvDtl(param);
		return data;
	}
	
	@RequestMapping(value = "/getSend")
	public Map<String, Object> getSend(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dcCarService.getSend(param);
		return data;
	}
	
	@RequestMapping(value = "/getSendDtl")
	public Map<String, Object> getSendDtl(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dcCarService.getSendDtl(param);
		return data;
	}
	
	@RequestMapping(value = "/getRealDelv")
	public Map<String, Object> getRealDelv(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dcCarService.getRealDelv(param);
		return data;
	}
	
	@RequestMapping(value = "/selectCenterList")
	@ResponseBody
	public Map<String, Object> selectCenterList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
		Map<String, Object> data = dcCarService.selectCenterList(param);
		return data;
	}
	
	@PostMapping(value = "/getPathButton")
	@ResponseBody
	public Map<String, Object> getPathButton (@RequestParam Map<String, Object> param, Model model,HttpSession session) {
		Map<String, Object> data = dcCarService.getPathButton(param);
		return data;
	}
	
	@PostMapping(value = "/getStateCount")
	@ResponseBody
	public Map<String, Object> getStateCount (@RequestParam Map<String, Object> param, Model model,HttpSession session) {
		Map<String, Object> data = dcCarService.getStateCount(param);
		return data;
	}
	
	@PostMapping(value = "/carGridList")
	@ResponseBody
	public Map<String, Object> carGridList (@RequestParam Map<String, Object> param, Model model,HttpSession session) {
		Map<String, Object> data = dcCarService.carGridList(param);
		return data;
	}
}
