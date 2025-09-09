package com.dc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.common.mapper.CommonMapper;
import com.configuration.jwt.util.SecurityUtil;
import com.dc.mapper.DcWareAvailMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
public class DcWareAvailService {
	
	@Autowired
	private DcWareAvailMapper dcWareAvailMapper;
	
	@Autowired
	private CommonMapper commonMapper;
	
	public Map<String, Object> selectDcWareAvailList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcWareAvailMapper.selectDcWareAvailList(param);
			data.put("dataList", dataList);			
			data.put("latestDate", dcWareAvailMapper.getLatestDate(param));
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	public Map<String, Object> selectGridInfoList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("cmgrpcd", "WA_GUBUN");
			List<Map<String, Object>> waGubunList = commonMapper.getCommCode(param);
			data.put("waGubunList", waGubunList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
		
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveWareAvailInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			String userId = SecurityUtil.getCurrentUserId().get();
			
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, Object> paramData = objectMapper.readValue((String) param.get("data"), Map.class);
						
			List<Map<String, Object>> updateList = (List<Map<String, Object>>) paramData.get("updateList");
					
			for (Map<String, Object> map : updateList) {
				map.put("userId", userId);
				dcWareAvailMapper.updateWareAvailInfo(map);
			}
			
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

}
