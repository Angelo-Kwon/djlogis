package com.sy.controller;

import java.util.Map;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sy.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/sy/dashboard")
public class DashboardController {

	private final DashboardService dashboardService;

	@RequestMapping(value = "/role/whouse")
	public Map<String, Object> getgetWhouseData() {
		Map<String, Object> data = dashboardService.getWhouseData();
		return data;
	}
	
	@RequestMapping(value = "/grid/ship")
	public Map<String, Object> getShipGridData(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.getShipGridData(param);
		return data;
	}
	
	@RequestMapping(value = "/grid/whouse")
	public Map<String, Object> getWhouseGridData(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.getWhouseGridData(param);
		return data;
	}
	
	@RequestMapping(value = "/grid/car")
	public Map<String, Object> getCarGridData(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.getCarGridData(param);
		return data;
	}
	
	@RequestMapping(value = "/grid/equip")
	public Map<String, Object> getEquipGridData(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.getEquipGridData(param);
		return data;
	}
	
	@RequestMapping(value = "/grid/manpw")
	public Map<String, Object> getManpwGridData(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.getManpwGridData(param);
		return data;
	}
	
	@RequestMapping(value = "/grid/notice")
	public Map<String, Object> getNoticeGridData(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.getNoticeGridData(param);
		return data;
	}
	
	@RequestMapping(value = "/html/shList")
	public Map<String, Object> getShList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.getShList(param);
		return data;
	}
	
	@RequestMapping(value = "/html/srList")
	public Map<String, Object> getSrList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.getSrList(param);
		return data;
	}

	@RequestMapping(value = "/chart/stockBar")
	public Map<String, Object> selectStockBarList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.selectStockBarList(param);
		return data;
	}
	
	@RequestMapping(value = "/chart/stockDou")
	public Map<String, Object> selectStockDouList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.selectStockDouList(param);
		return data;
	}

	@RequestMapping(value = "/chart/deliveryBar")
	public Map<String, Object> selectDeliveryBarList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.selectDeliveryBarList(param);
		return data;
	}
	
	@RequestMapping(value = "/chart/deliveryDou")
	public Map<String, Object> selectDeliveryDouList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.selectDeliveryDouList(param);
		return data;
	}
	@RequestMapping(value = "/chart/selectWorkerDou")
	public Map<String, Object> selectWorkerDouList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.selectWorkerDouList(param);
		return data;
	}
	
	@RequestMapping(value = "/chart/selectWorkerBar")
	public Map<String, Object> selectWorkerBarList(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.selectWorkerBarList(param);
		return data;
	}
	
	@RequestMapping(value = "/downManual")
	public Map<String, Object> getDownManual(@RequestParam Map<String, Object> param) {
		Map<String, Object> data = dashboardService.getDownManual(param);
		return data;
	}
}
