package com.dc.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dc.service.DcDashService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/dc/dash")
public class DcDashController {

	@Autowired
	private DcDashService dcDashService;

	/**
	 * @매서드명 : selectInTypeList
	 * @매서드기능 : 입고유형별 현황 조회
	 * @작성날짜 : 2023.10.02
	 * @param request
	 * @return String
	 */
	@RequestMapping(value = "/selectInTypeList")
	public Map<String, Object> selectInTypeList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = dcDashService.selectInTypeList(param);

		return data;
	}

	/**
	 * @매서드명 : selectDelCompleteList
	 * @매서드기능 : 출고유형별 현황 조회
	 * @작성날짜 : 2023.10.02
	 * @param request
	 * @return String
	 */
	@RequestMapping(value = "/selectOutTypeList")
	public Map<String, Object> selectOutTypeList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = dcDashService.selectOutTypeList(param);

		return data;
	}

	@RequestMapping(value = "/selectWareList")
	public List<Map<String, Object>> selectWareList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		List<Map<String, Object>> data = dcDashService.selectWareList(param);

		return data;
	}

	@RequestMapping(value = "/selectOwnerList")
	public List<Map<String, Object>> selectOwnerList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		List<Map<String, Object>> data = dcDashService.selectOwnerList(param);

		return data;
	}

}