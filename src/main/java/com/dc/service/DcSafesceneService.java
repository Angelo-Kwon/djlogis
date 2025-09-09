package com.dc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.dc.mapper.DcSafesceneMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
public class DcSafesceneService {
	
	@Autowired
	private DcSafesceneMapper dcSafesceneMapper;
	
	public Map<String, Object> selectSafesceneList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcSafesceneMapper.selectSafesceneList(param); 
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveSafescene(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			String userId = SecurityUtil.getCurrentUserId().get();
			
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, Object> paramData = objectMapper.readValue((String) param.get("data"), Map.class);
			
			List<Map<String, Object>> addList = (List<Map<String, Object>>) paramData.get("addList");
			List<Map<String, Object>> updateList = (List<Map<String, Object>>) paramData.get("updateList");
			List<Map<String, Object>> deleteList = (List<Map<String, Object>>) paramData.get("deleteList");
			
			for (Map<String, Object> map : addList) {
				map.put("userId", userId);
				dcSafesceneMapper.createSafescene(map);
			}
	
			for (Map<String, Object> map : updateList) {
				map.put("userId", userId);
				dcSafesceneMapper.updateSafescene(map);
			}
	
			for (Map<String, Object> map : deleteList) {
				dcSafesceneMapper.deleteSafescene(map);
			}
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
}
