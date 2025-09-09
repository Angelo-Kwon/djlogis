package com.rs.service;

import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rs.mapper.ShareUseMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ShareUseService {

	private final ShareUseMapper shareUseMapper;

	@Transactional
	public Map<String, Object> getWhouseList(Map<String, Object> param) {
		System.out.println("ShareUseService getWhouseList");
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = shareUseMapper.getWhouseList(param);

		data.put("dataList", dataList);

		return data;
	}

	@Transactional
	public Map<String, Object> getCarList(Map<String, Object> param) {
		System.out.println("ShareUseService getCarList");
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = shareUseMapper.getCarList(param);

		data.put("dataList", dataList);

		return data;
	}

	@Transactional
	public Map<String, Object> getEquipList(Map<String, Object> param) {
		System.out.println("ShareUseService getCarList");
		Map<String, Object> data = new HashMap<String, Object>();
		String equipCd = (String) param.get("equipCd");

		List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
		switch (equipCd){
			case "F":
				dataList = shareUseMapper.getFkliftList(param);
				break;
			case "K":
				dataList = shareUseMapper.getKartList(param);
				break;
			case "P":
				dataList = shareUseMapper.getPltList(param);
				break;
		}

		data.put("dataList", dataList);

		return data;
	}


	@Transactional
	public Map<String, Object> saveShUseApply(Map<String, Object> param) {
		System.out.println("ShareUseService getCarList");
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
					saveCnt += shareUseMapper.updateShWhouseApply(params);
					break;
				case "C": //차량
					saveCnt += shareUseMapper.updateShCarApply(params);
					break;
				case "E": //기자재
					saveCnt += shareUseMapper.updateShEquipApply(params);
					break;
			}
			//매칭 저장
			saveCnt +=  shareUseMapper.insertShMatch(params);

			if (saveCnt < 2) {
				throw new Exception("신청등록중 오류가 발생했습니다.");
			}

			result.put("saveCnt", saveCnt);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			result.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}

		return result;
	}
	
	/*
	 * 모바일 공유자원사용신청 - 목록 조회
	 */
	public Map<String, Object> getMoShareWhouseList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		int totalCount = 0;
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			param = (Map<String, Object>) paramData.get("param");

			// 조회
			List<Map<String, Object>> dataList = null;
			param.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID
			
			dataList = shareUseMapper.getMoWhouseList(param);

			// 결과 데이터
			data.put("dataList", dataList);
			data.put("totalCount", totalCount);

		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	/*
	 * 모바일 공유자원사용신청 - 목록 조회
	 */
	public Map<String, Object> getMoShareCarList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		int totalCount = 0;
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			param = (Map<String, Object>) paramData.get("param");
			// 조회
			List<Map<String, Object>> dataList = null;
			param.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID

			dataList = shareUseMapper.getMoCarList(param);

			// 결과 데이터
			data.put("dataList", dataList);
			data.put("totalCount", totalCount);

		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	/*
	 * 모바일 공유자원사용신청 - 목록 조회
	 */
	public Map<String, Object> getMoShareEquipList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		int totalCount = 0;
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			param = (Map<String, Object>) paramData.get("param");
			// 조회
			List<Map<String, Object>> dataList = null;
			param.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID

			String equipCd = (String) param.get("equipCd");
			if(equipCd == null){
				data.put("errCd", 500);
				data.put("errMsg", "기자재구분 코드가 없습니다.");
				return data;
			}else if (equipCd.equals("F")) {// 기자재(지게차)
				dataList = shareUseMapper.getMoEquipFList(param);
			} else if (equipCd.equals("K")) {// 기자재(대차)
				dataList = shareUseMapper.getMoEquipKList(param);
			} else if (equipCd.equals("P")) {// 기자재(파렛트)
				dataList = shareUseMapper.getMoEquipPList(param);
			}

			// 결과 데이터
			data.put("dataList", dataList);
			data.put("totalCount", totalCount);

		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/*
	 * 모바일 공유자원사용신청 - 공유종료
	 */
	public Map<String, Object> saveMoShareShYn(Map<String, Object> param) {
		System.out.println("ShareUseService saveMoShareShYn");
		Map<String, Object> data = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			param = (Map<String, Object>) paramData.get("param");
			param.put("userId", userId);

			int saveCnt = 0;
			String errMsg = "";

			String shUseType = (String) param.get("shUseType");
			if(shUseType == null){
				data.put("errCd", "500");
				data.put("errMsg", "공유아이템 구분 코드가 없습니다.");
				return data;
			} else if (shUseType.equals("W")) {// 창고
				saveCnt += shareUseMapper.saveMoShareWhouseShUseYn(param);
				saveCnt += shareUseMapper.saveMoCmWhouseShYn(param);
				errMsg = "창고 공유상태 저장중 오류가 발생했습니다.";
			} else if (shUseType.equals("C")) {// 차량
				saveCnt += shareUseMapper.saveMoShareCarShUseYn(param);
				saveCnt += shareUseMapper.saveMoCmCarShYn(param);
				errMsg = "차량 공유상태 저장중 오류가 발생했습니다.";
			} else if (shUseType.equals("M")) {// 인력
				saveCnt += shareUseMapper.saveMoShareManpwShUseYn(param);
				saveCnt += shareUseMapper.saveMoCmManpwShYn(param);
				errMsg = "인력 공유상태 저장중 오류가 발생했습니다.";
			} else {
				saveCnt += shareUseMapper.saveMoShareEquipShYn(param);
				saveCnt += shareUseMapper.saveMoCmEquipShYn(param);
				errMsg = "기자재 공유상태 저장중 오류가 발생했습니다.";
			}

			if(saveCnt != 2){
				data.put("errCd", "501");
				data.put("errMsg", errMsg);
				throw new Exception(errMsg);
			}

			data.put("stsCd", "200");

		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	@Transactional
	public Map<String, Object> saveMoShUseApply(Map<String, Object> param) {
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

			//공유 사용 신청
			switch (matCd){
				case "W": //창고
					saveCnt += shareUseMapper.updateShWhouseApply(params);
					break;
				case "C": //차량
					saveCnt += shareUseMapper.updateShCarApply(params);
					break;
				case "E": //기자재
					saveCnt += shareUseMapper.updateShEquipApply(params);
					break;
			}
			//매칭 저장
			saveCnt += shareUseMapper.insertShMatch(params);

			if (saveCnt < 2) {
				result.put("errCd", "501");
				result.put("errMsg", "공유자원 사용신청 등록중 오류가 발생했습니다.");
				throw new Exception("공유자원 사용신청 등록중 오류가 발생했습니다.");
			}

			result.put("stsCd", "200");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			result.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}

		return result;
	}
}