package com.sy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.sy.mapper.DashboardMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DashboardService {

	private final DashboardMapper dashboardMapper;
	
	public Map<String, Object> getWhouseData() {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> whRoleGroup = dashboardMapper.getWhRoleGroup(SecurityUtil.getCurrentRgroupId().get());
		data.put("dataList", whRoleGroup);
		return data;
	}
	
	public Map<String, Object> getShipGridData(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> whRoleGroup = dashboardMapper.getWhRoleGroup(SecurityUtil.getCurrentRgroupId().get());
		param.put("wareKeyList", whRoleGroup);
		data.put("data", dashboardMapper.getShipGridData(param));
		return data;
	}

	
	public Map<String, Object> getWhouseGridData(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("data", dashboardMapper.getWhouseGridData(param));
		return data;
	}
	
	public Map<String, Object> getCarGridData(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("data", dashboardMapper.getCarGridData(param));
		return data;
	}
	
	public Map<String, Object> getEquipGridData(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("data", dashboardMapper.getEquipGridData(param));
		return data;
	}
	
	public Map<String, Object> getManpwGridData(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("data", dashboardMapper.getManpwGridData(param));
		return data;
	}
	
	public Map<String, Object> getNewsGridData(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("data", dashboardMapper.getNewsGridData(param));
		return data;
	}
	
	public Map<String, Object> getNoticeGridData(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("data", dashboardMapper.getNoticeGridData(param));
		return data;
	}
	
	public Map<String, Object> getShList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("data", dashboardMapper.getShList(param));
		return data;
	}
	
	public Map<String, Object> getSrList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("data", dashboardMapper.getSrList(param));
		return data;
	}
	
	public Map<String, Object> selectStockBarList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> whRoleGroup = dashboardMapper.getWhRoleGroup(SecurityUtil.getCurrentRgroupId().get());
			param.put("wareKeyList", whRoleGroup);
			List<Map<String, Object>> result = dashboardMapper.selectStockBarList(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
	
	public Map<String, Object> selectStockDouList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> whRoleGroup = dashboardMapper.getWhRoleGroup(SecurityUtil.getCurrentRgroupId().get());
			param.put("wareKeyList", whRoleGroup);
			List<Map<String, Object>> result = dashboardMapper.selectStockDouList(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
	
		
	public Map<String, Object> selectDeliveryBarList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> whRoleGroup = dashboardMapper.getWhRoleGroup(SecurityUtil.getCurrentRgroupId().get());
			param.put("wareKeyList", whRoleGroup);
			List<Map<String, Object>> result = dashboardMapper.selectDeliveryBarList(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
	public Map<String, Object> selectDeliveryDouList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> whRoleGroup = dashboardMapper.getWhRoleGroup(SecurityUtil.getCurrentRgroupId().get());
			param.put("wareKeyList", whRoleGroup);
			List<Map<String, Object>> result = dashboardMapper.selectDeliveryDouList(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
	
	
	public Map<String, Object> selectWorkerDouList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> result = dashboardMapper.selectWorkerDouList(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
	
	public Map<String, Object> selectWorkerBarList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> result = dashboardMapper.selectWorkerBarList(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
	
	public Map<String, Object> getDownManual(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("data", dashboardMapper.getDownManual(param));
		return data;
	}
}