package com.sy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.sy.mapper.ContractMapper;
import com.configuration.jwt.util.SecurityUtil;
import com.sy.mapper.CalculateMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CalculateService {

	private final CalculateMapper calculateMapper;

	public Map<String, Object> getCalTarget(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> result = calculateMapper.getCalTarget(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
	
	@Transactional
	public Map<String, Object> saveCalculate(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			String userId = SecurityUtil.getCurrentUserId().get();
			param.put("userId", userId);
			
			// 정산처리
			calculateMapper.saveCalculate(param);
			
			// 계약상태 업데이트(op_contract_detail vs op_calculation 금액 비교)
			calculateMapper.updateContractStatus(param);
			
			// 정산내역 조회
			List<Map<String, Object>> result = calculateMapper.getCalculate(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
	
	public Map<String, Object> getCalculate(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> result = calculateMapper.getCalculate(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
}