package com.dc.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dc.service.DcCarService;
import com.dc.service.DcSafeDashService;
import com.dc.service.DcWhouseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/dc/safe")
public class DcSafeDashController {

	@Autowired
	private DcSafeDashService dcSafeDashService; 

	/**
	 * @매서드명 : selectSafeDashList
	 * @매서드기능 : 재해관리 대시보드 화면 조회
	 * @작성날짜 : 2023.09.15
	 * @param request
	 * @return String
	 */
	@RequestMapping(value = "/selectSafeDashList")
	public Map<String, Object> selectSafeDashList(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = dcSafeDashService.selectSafeDashList(param);
		return data;
	}
}
