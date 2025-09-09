package com.rs.service;

import java.util.*;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.common.service.SmsService;
import com.configuration.jwt.util.SecurityUtil;
import com.configuration.util.CrypoUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rs.mapper.ApvMatchMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ApvMatchService {

	@Autowired
	private SmsService smsService;
	
	private final ApvMatchMapper apvMatchMapper;
	
	public Map<String, Object> getConId(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			List<Map<String, Object>> result = apvMatchMapper.getConId(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> getMatReq(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

			String matCd = (String) param.get("condMatCd");
			switch (matCd) {
			case "W": // 창고
				result = apvMatchMapper.getMatReqWhouse(param);
				break;
			case "C": // 차량
				result = apvMatchMapper.getMatReqCar(param);
				break;
			case "E": // 기자재
				result = apvMatchMapper.getMatReqEquip(param);
				break;
			case "M": // 인력
				result = apvMatchMapper.getMatReqManpw(param);
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
	public Map<String, Object> saveShUseApply(Map<String, Object> param) {
		System.out.println("ApvMatchService getCarList");
		Map<String, Object> result = new HashMap<String, Object>();

		try {
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> params = objectMapper.readValue(paramString, Map.class);
			String userId = SecurityUtil.getCurrentUserId().get();
			String matCd = (String) params.get("matCd");
			int saveCnt = 0;
			params.put("userId", userId);

			//공유 사용 신청
			switch (matCd){
				case "W": //창고
					saveCnt += apvMatchMapper.updateShWhouseApply(params);
					break;
				case "C": //차량
					saveCnt += apvMatchMapper.updateShCarApply(params);
					break;
				case "E": //기자재
					saveCnt += apvMatchMapper.updateShEquipApply(params);
					break;
			}
			//매칭 저장
			saveCnt +=  apvMatchMapper.insertShMatch(params);

			if (saveCnt < 2) {
				throw new Exception("신청등록중 오류가 발생했습니다.");
			}

			sendSMS(params, "A");

			result.put("saveCnt", saveCnt);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			result.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}

		return result;
	}

	@SuppressWarnings("unchecked")
	@Transactional
	public Map<String, Object> matApv(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		ArrayList<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());

			if (ObjectUtils.isEmpty(param.get("dataList"))) {
				throw new Exception("required value does not exist.");
			}else {
				ObjectMapper objectMapper = new ObjectMapper();
				dataList = (ArrayList<Map<String, Object>>) objectMapper.readValue((String) param.get("dataList"), ArrayList.class);
				param.put("dataList", dataList);
			}

			String shUseYn = "";
			String matCd = param.get("condMatCd").toString();
			switch (matCd) {
				case "W": // 창고
					apvMatchMapper.updateCmWhouse(param);
					apvMatchMapper.updateShWhouse(param);
					break;
				case "C": // 차량
					apvMatchMapper.updateCmCar(param);
					apvMatchMapper.updateShCar(param);
					break;
				case "E": // 기자재
					this.updateCmEquip(param);
					apvMatchMapper.updateShEquip(param);
					break;
				case "M": // 인력
					apvMatchMapper.updateCmManpw(param);
					apvMatchMapper.updateShManpw(param);
					break;
				default:
			}

			apvMatchMapper.updateShMat(param);
			apvMatchMapper.insertShMatHist(param);
			
			// send messages
			for(Map<String, Object> dt : dataList) {
				sendSMS(dt, shUseYn);
			}
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	private void updateCmEquip(Map<String, Object> param) {
		apvMatchMapper.updateCmFklift(param);
		apvMatchMapper.updateCmKart(param);
		apvMatchMapper.updateCmPlt(param);
	}

	public Map<String, Object> getMoMatReq(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			param.put("limit", Integer.parseInt(param.get("limit").toString()));
			
			List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
			int totalCount = 0;

			String matCd = (String) param.get("condMatCd");
			switch (matCd) {
			case "W": // 창고
				totalCount = apvMatchMapper.getMoMatReqWhouseCnt(param);
				result = apvMatchMapper.getMoMatReqWhouse(param);
				break;
			case "C": // 차량
				totalCount = apvMatchMapper.getMoMatReqCarCnt(param);
				result = apvMatchMapper.getMoMatReqCar(param);
				break;
			case "E": // 기자재
				totalCount = apvMatchMapper.getMoMatReqEquipCnt(param);
				result = apvMatchMapper.getMoMatReqEquip(param);
				break;
			case "M": // 인력
				totalCount = apvMatchMapper.getMoMatReqManpwCnt(param);
				result = apvMatchMapper.getMoMatReqManpw(param);
				break;
			default:
				result = null;
			}

			data.put("data", result);
			data.put("totalCount", totalCount);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	@Transactional
	public Map<String, Object> saveMoMatApply(Map<String, Object> param) {
		System.out.println("ShareUseService saveMoShUseApply");
		Map<String, Object> result = new HashMap<String, Object>();

		try {
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> params = objectMapper.readValue(paramString, Map.class);
			String userId = SecurityUtil.getCurrentUserId().get();
			String matCd = (String) params.get("matCd");
			int saveCnt = 0;
			params.put("userId", userId);

			if(matCd == null || "".equals(matCd)){
				result.put("errCd", "500");
				result.put("errMsg", "공유구분 코드가 없습니다.");
				return result;
			}

			String shUseYn = "A";
			params.put("shYn", shUseYn);
			if("W".equals(matCd)) {
				saveCnt += apvMatchMapper.updateMoCmWhouseShYn(params);
				saveCnt += apvMatchMapper.updateShWhouseApply(params);
			} else if ("C".equals(matCd)) {
				saveCnt += apvMatchMapper.updateMoCmCarShYn(params);
				saveCnt += apvMatchMapper.updateShCarApply(params);
			} else if ("E".equals(matCd)) {
				String equipCd = (String) params.get("equipCd");
				if("F".equals(equipCd)){
					saveCnt += apvMatchMapper.updateMoCmFkliftShYn(params);
				} else if ("K".equals(equipCd)){
					saveCnt += apvMatchMapper.updateMoCmKartShYn(params);
				} else if ("P".equals(equipCd)){
					saveCnt += apvMatchMapper.updateMoCmPltShYn(params);
				}
				saveCnt += apvMatchMapper.updateShEquipApply(params);
			}
			//매칭 저장
			saveCnt += apvMatchMapper.insertShMatch(params);

			if (saveCnt < 3) {
				result.put("errCd", "501");
				result.put("errMsg", "공유자원 사용신청 등록중 오류가 발생했습니다.");
				throw new Exception("공유자원 사용신청 등록중 오류가 발생했습니다.");
			}

			sendSMS(params, shUseYn);

			result.put("stsCd", "200");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			result.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}

		return result;
	}

	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> matMoApv(Map<String, Object> param) {
		System.out.println("ApvManchService matMoApv");
		Map<String, Object> result = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();

		try {
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> params = objectMapper.readValue(paramString, Map.class);

			int saveCnt = 0;
			params.put("userId", userId);
			String matCd = (String) params.get("matCd");
			//공유 사용 신청
			saveCnt += apvMatchMapper.updateMoShMatchYn(params);
			saveCnt += apvMatchMapper.insertMoShMatchHist(params);

			String shUseYn = "S";
			params.put("shYn", shUseYn);
			if("W".equals(matCd)) {
				saveCnt += apvMatchMapper.updateMoCmWhouseShYn(params);
				saveCnt += apvMatchMapper.updateMoShWhouseShUseYn(params);
			} else if ("C".equals(matCd)) {
				saveCnt += apvMatchMapper.updateMoCmCarShYn(params);
				saveCnt += apvMatchMapper.updateMoShCarShUseYn(params);
			} else if ("E".equals(matCd)) {
				String equipCd = (String) params.get("equipCd");
				if("F".equals(equipCd)){
					saveCnt += apvMatchMapper.updateMoCmFkliftShYn(params);
				} else if ("K".equals(equipCd)){
					saveCnt += apvMatchMapper.updateMoCmKartShYn(params);
				} else if ("P".equals(equipCd)){
					saveCnt += apvMatchMapper.updateMoCmPltShYn(params);
				}
				saveCnt += apvMatchMapper.updateMoShEquipShUseYn(params);
			} else if ("M".equals(matCd)) {
				saveCnt += apvMatchMapper.updateMoShManpwShUseYn(params);
			}
			//매칭 저장

			if (saveCnt != 4) {
				result.put("errCd", "501");
				result.put("errMsg", "공유자원 사용승인중 오류가 발생했습니다.");
				throw new Exception("공유자원 사용승인중 오류가 발생했습니다.");
			}

			sendSMS(params, shUseYn);

			result.put("stsCd", "200");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			result.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}

		return result;
	}

	private void sendSMS(Map<String, Object> param, String shUseYn) {
		Map<String, Object> smsParam = new HashMap<String, Object>();

		try{
			String shUseReqNm = "";
			String shUserId = "";


			String matCd = (String) param.get("matCd");
			if("W".equals(matCd)) {
				shUseReqNm = param.get("whNm").toString();
			}else if("C".equals(matCd)){
				shUseReqNm = param.get("carFullNo").toString();
			}else if("E".equals(matCd)){
				shUseReqNm = param.get("equipNm").toString();
			}

			String msg = "";
			if("A".equals(shUseYn)){
				msg += "등록하신 ["+shUseReqNm+"]에 사용신청이 접수되었습니다.\\n";
				msg += "사용승인을 부탁드립니다.";
				shUserId = param.get("shUserId").toString();
			}else {
				msg += "신청하신 ["+shUseReqNm+"]가 사용승인 되었습니다.";
				shUserId = param.get("matConId").toString();
			}


			param.put("shUserId", shUserId);
			String userPhone = apvMatchMapper.getUserPhone(param);

			if(userPhone != null && !userPhone.isEmpty()){
				String toPhone = CrypoUtil.decrypto(userPhone).replaceAll("-", "");
				smsParam.put("toPhone", toPhone);
				smsParam.put("msg", msg);

				Map<String, Object> smsData = smsService.putSms(smsParam);
			}

		}catch (Exception e){
			e.printStackTrace();
		}
	}
}