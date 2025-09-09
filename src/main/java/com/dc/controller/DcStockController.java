package com.dc.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dc.service.DcStockService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/dc/stock")
public class DcStockController {

	@Autowired
	private DcStockService dcStockService;
	
	@RequestMapping(value = "/selectStockList")
	public Map<String, Object> selectStockList (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcStockService.selectStockList(param);
		return data;
	}
	
	@RequestMapping(value = "/selectStockDtlList")
	public Map<String, Object> selectStockDtlList (@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = dcStockService.selectStockDtlList(param);
		return data;
	}
	
}