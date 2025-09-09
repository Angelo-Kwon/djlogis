package com.dc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.dc.mapper.DcDashOpenMapper;

@Service
@Transactional
public class DcDashOpenService {

	@Autowired
	private DcDashOpenMapper dcDashOpenMapper;

	public Map<String, Object> selectInTypeList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			String type = param.get("type").toString();
			if ("A".equals(type)) {
				param.put("DOCTYPE", "480"); // 480 반입
			} else if ("B".equals(type)) {
				param.put("DOCTYPE", "490"); // 490 기타입고
			}
			List<Map<String, Object>> typeList = dcDashOpenMapper.selectInTypeList(param);
			List<Map<String, Object>> cntList = dcDashOpenMapper.selectInCountList(param);
			data.put("typeList", typeList);
			data.put("cntList", cntList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> selectOutTypeList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			String type = param.get("type").toString();
			if ("A".equals(type)) {
				param.put("DOCTYPE", "780"); // 780 반출
			} else if ("B".equals(type)) {
				param.put("DOCTYPE", "790"); // 790 기타출고
			}
			List<Map<String, Object>> typeList = dcDashOpenMapper.selectOutTypeList(param);
			List<Map<String, Object>> cntList = dcDashOpenMapper.selectOutCountList(param);
			data.put("typeList", typeList);
			data.put("cntList", cntList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public List<Map<String, Object>> selectWareList(Map<String, Object> param) {
		return dcDashOpenMapper.selectWareList(param);
	}

	public List<Map<String, Object>> selectOwnerList(Map<String, Object> param) {
		return dcDashOpenMapper.selectOwnerList(param);
	}
	
	public Map<String, Object> selectGroupChart(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcDashOpenMapper.selectGroupChart(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	public Map<String, Object> selectStockBarList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> whRoleGroup = dcDashOpenMapper.getWhRoleGroup(SecurityUtil.getCurrentRgroupId().get());
			param.put("wareKeyList", whRoleGroup);
			List<Map<String, Object>> result = dcDashOpenMapper.selectStockBarList(param);
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
			List<Map<String, Object>> whRoleGroup = dcDashOpenMapper.getWhRoleGroup(SecurityUtil.getCurrentRgroupId().get());
			param.put("wareKeyList", whRoleGroup);
			List<Map<String, Object>> result = dcDashOpenMapper.selectStockDouList(param);
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
			List<Map<String, Object>> whRoleGroup = dcDashOpenMapper.getWhRoleGroup(SecurityUtil.getCurrentRgroupId().get());
			param.put("wareKeyList", whRoleGroup);
			List<Map<String, Object>> result = dcDashOpenMapper.selectDeliveryBarList(param);
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
			List<Map<String, Object>> whRoleGroup = dcDashOpenMapper.getWhRoleGroup(SecurityUtil.getCurrentRgroupId().get());
			param.put("wareKeyList", whRoleGroup);
			List<Map<String, Object>> result = dcDashOpenMapper.selectDeliveryDouList(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
	

}
