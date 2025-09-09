package com.dc.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dc.service.DcDashOpenService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/dc/dashopen")
public class DcDashOpenController {

	@Autowired
	private DcDashOpenService dcDashOpenService;

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

		Map<String, Object> data = dcDashOpenService.selectInTypeList(param);

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

		Map<String, Object> data = dcDashOpenService.selectOutTypeList(param);

		return data;
	}

	@RequestMapping(value = "/selectWareList")
	public List<Map<String, Object>> selectWareList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		List<Map<String, Object>> data = dcDashOpenService.selectWareList(param);

		return data;
	}

	@RequestMapping(value = "/selectOwnerList")
	public List<Map<String, Object>> selectOwnerList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		List<Map<String, Object>> data = dcDashOpenService.selectOwnerList(param);

		return data;
	}
	
	@RequestMapping(value = "/selectGroupChart")
	public Map<String, Object> selectGroupChart(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = dcDashOpenService.selectGroupChart(param);
		return data;
	}
	
	@RequestMapping(value = "/chart/stockBar")
	public Map<String, Object> selectStockBarList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dcDashOpenService.selectStockBarList(param);
		return data;
	}
	
	@RequestMapping(value = "/chart/stockDou")
	public Map<String, Object> selectStockDouList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dcDashOpenService.selectStockDouList(param);
		return data;
	}

	@RequestMapping(value = "/chart/deliveryBar")
	public Map<String, Object> selectDeliveryBarList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dcDashOpenService.selectDeliveryBarList(param);
		return data;
	}
	
	@RequestMapping(value = "/chart/deliveryDou")
	public Map<String, Object> selectDeliveryDouList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dcDashOpenService.selectDeliveryDouList(param);
		return data;
	}
	

}