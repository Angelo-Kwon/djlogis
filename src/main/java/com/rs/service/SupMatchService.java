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
import com.rs.mapper.SupMatchMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class SupMatchService {

	private final SupMatchMapper supMatchMapper;
	
	public Map<String, Object> getConId(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			List<Map<String, Object>> result = supMatchMapper.getConId(param);
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
			List<Map<String, Object>> result = supMatchMapper.getConNm(param);
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
				result = supMatchMapper.getMatWhouse(param);
				break;
			case "C": // 차량
				result = supMatchMapper.getMatCar(param);
				break;
			case "E": // 기자재
				result = supMatchMapper.getMatEquip(param);
				break;
			case "M": // 인력
				result = supMatchMapper.getMatManpw(param);
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
	
	@SuppressWarnings("unchecked")
	@Transactional
	public Map<String, Object> matEnd(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());

			if (ObjectUtils.isNotEmpty(param.get("cmNoList"))) {
				ObjectMapper objectMapper = new ObjectMapper();
				ArrayList<String> cmNoList = (ArrayList<String>) objectMapper.readValue((String) param.get("cmNoList"), ArrayList.class);
				param.put("cmNoList", cmNoList);
			}
			
			if (ObjectUtils.isNotEmpty(param.get("shNoList"))) {
				ObjectMapper objectMapper = new ObjectMapper();
				ArrayList<String> shNoList = (ArrayList<String>) objectMapper.readValue((String) param.get("shNoList"), ArrayList.class);
				param.put("shNoList", shNoList);
			}
			
			if (ObjectUtils.isNotEmpty(param.get("matNoList"))) {
				ObjectMapper objectMapper = new ObjectMapper();
				ArrayList<String> matNoList = (ArrayList<String>) objectMapper.readValue((String) param.get("matNoList"), ArrayList.class);
				param.put("matNoList", matNoList);
			}

			if (ObjectUtils.isEmpty(param.get("cmNoList")) || ObjectUtils.isEmpty(param.get("shNoList")) || ObjectUtils.isEmpty(param.get("matNoList"))) {
				throw new Exception("required value does not exist.");
			}

			String matCd = (String) param.get("condMatCd");
			switch (matCd) {
			case "W": // 창고
				supMatchMapper.updateCmWhouse(param);
				supMatchMapper.updateShWhouse(param);
				break;
			case "C": // 차량
				supMatchMapper.updateCmCar(param);
				supMatchMapper.updateShCar(param);
				break;
			case "E": // 기자재
				this.updateCmEquip(param);
				supMatchMapper.updateShEquip(param);
				break;
			case "M": // 인력
				supMatchMapper.updateCmManpw(param);
				supMatchMapper.updateShManpw(param);
				break;
			default:
			}

			supMatchMapper.updateShMat(param);
			supMatchMapper.insertShMatHist(param);

		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	private void updateCmEquip(Map<String, Object> param) {
		supMatchMapper.updateCmFklift(param);
		supMatchMapper.updateCmKart(param);
		supMatchMapper.updateCmPlt(param);
	}
	
	public Map<String, Object> getMoMat(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			param.put("limit", Integer.parseInt(param.get("limit").toString()));
			
			int totalCount = 0;
			List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

			String matCd = (String) param.get("condMatCd");
			switch (matCd) {
			case "W": // 창고
				totalCount = supMatchMapper.getMoMatWhouseCnt(param);
				result = supMatchMapper.getMoMatWhouse(param);
				break;
			case "C": // 차량
				totalCount = supMatchMapper.getMoMatCarCnt(param);
				result = supMatchMapper.getMoMatCar(param);
				break;
			case "E": // 기자재
				totalCount = supMatchMapper.getMoMatEquipCnt(param);
				result = supMatchMapper.getMoMatEquip(param);
				break;
			case "M": // 인력
				totalCount = supMatchMapper.getMoMatManpwCnt(param);
				result = supMatchMapper.getMoMatManpw(param);
				break;
			default:
				result = null;
			}

			data.put("totalCount", totalCount);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
}