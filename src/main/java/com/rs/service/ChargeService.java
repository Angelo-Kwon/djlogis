package com.rs.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rs.mapper.ChargeMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChargeService {

	private final ChargeMapper chargeMapper;
	
	public Map<String, Object> getConId(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			List<Map<String, Object>> result = chargeMapper.getConId(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	public Map<String, Object> getConNm(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			List<Map<String, Object>> result = chargeMapper.getConNm(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> getMat(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

			String matCd = (String) param.get("condMatCd");
			switch (matCd) {
			case "W": // 창고
				result = chargeMapper.getMatWhouse(param);
				break;
			case "C": // 차량
				result = chargeMapper.getMatCar(param);
				break;
			case "E": // 기자재
				result = chargeMapper.getMatEquip(param);
				break;
			case "M": // 인력
				result = chargeMapper.getMatManpw(param);
				break;
			default:
				result = null;
			}

			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> charge(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			if (ObjectUtils.isNotEmpty(param.get("target"))) {
				ObjectMapper objectMapper = new ObjectMapper();
				ArrayList<Map<String, Object>> target = (ArrayList<Map<String, Object>>) objectMapper.readValue((String) param.get("target"), ArrayList.class);
				
				if(target.size() > 0){
					for(Map<String, Object> t : target) {
						// TODO SMS 발송
						t.put("SMS_YN", "N");
						
						t.put("userId", SecurityUtil.getCurrentUserId().get());
						chargeMapper.insertCmCharge(t);
					}
				}
			}
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
}