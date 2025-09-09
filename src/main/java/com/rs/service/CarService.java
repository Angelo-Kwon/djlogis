package com.rs.service;

import java.sql.Array;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rs.mapper.CarMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class CarService {

	private final CarMapper carMapper;

	/*
	 * 차량 기본정보 - 차량 기본정보 목록 조회
	 */
	@Transactional
	public Map<String, Object> getCarBasicInfoList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID
			param.put("userNm", SecurityUtil.getCurrentUsername().get());// 사용자명
			List<Map<String, Object>> dataList = carMapper.getCarBasicInfoList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	/*
	 * 차량 기본정보 - 차량 기본정보 목록 조회
	 */
//	@Transactional
//	public Map<String, Object> getAdCarList(Map<String, Object> param) {
//		Map<String, Object> data = new HashMap<String, Object>();
//		try {
//			param.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID
//			List<Map<String, Object>> dataList = carMapper.getAdCarList(param);
//			data.put("dataList", dataList);
//		} catch (Exception e) {
//			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
//			data.put("error", "서비스오류 : " + e.getMessage());
//			e.printStackTrace();
//		}
//		return data;
//	}
	/*
	 * 차량 기본정보 - 차량 기본정보 목록 조회
	 */
	@Transactional
	public Map<String, Object> getMdCarList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = carMapper.getMdCarList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/*
	 * 차량 기본정보 - 차량 기본정보 저장
	 */
	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveCarBasicInfo(Map<String, Object> param) {
		System.out.println("CarService saveCarBasicInfo");
		Map<String, Object> data = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();
		try {

			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> gridData = objectMapper.readValue(paramString, Map.class);
			List<Map<String, Object>> addList = (List<Map<String, Object>>) gridData.get("addList");
			List<Map<String, Object>> updateList = (List<Map<String, Object>>) gridData.get("updateList");
			List<Map<String, Object>> deleteList = (List<Map<String, Object>>) gridData.get("deleteList");


			int saveCnt = 0;
			String[] photArr = {"carPhot","carPhot2","carPhot3","carCard"};
			if(!addList.isEmpty()){
				int addCmCarCnt = 0;
				int addAdCarCnt = 0;
				for (Map<String, Object> addMap : addList) {
					addMap.put("userId", userId);
					addCmCarCnt += carMapper.insertCmCar(addMap);
					for(String photo : photArr){
						if(addMap.get(photo) != null){
							byte[] imgBase64Byte = null;
							imgBase64Byte = Base64.getDecoder().decode((String) addMap.get(photo));
							addMap.put(photo, imgBase64Byte);
						}
					}
					addAdCarCnt += carMapper.insertAdCar(addMap);
					saveCnt++;
				}

				if(addCmCarCnt != addAdCarCnt){
					throw new Exception("차량 등록중 에러가 발생했습니다.");
				}
			}
			if(!updateList.isEmpty()){
				int updateCmCarCnt = 0;
				int updateAdCarCnt = 0;
				for (Map<String, Object> updateMap : updateList) {
					updateMap.put("userId", userId);
					
					if(updateMap.get("cmPrice").getClass().getSimpleName().equals("Integer")){
						  updateMap.put("cmPrice", updateMap.get("cmPrice").toString()); }
					updateCmCarCnt += carMapper.updateCmCar(updateMap);

					for(String photo : photArr){
						if(updateMap.get(photo) != null){
							byte[] imgBase64Byte = null;
							imgBase64Byte = Base64.getDecoder().decode((String) updateMap.get(photo));
							updateMap.put(photo, imgBase64Byte);
						}
					}
					updateAdCarCnt += carMapper.updateAdCar(updateMap);
					saveCnt++;
				}

				if(updateCmCarCnt != updateAdCarCnt){
					throw new Exception("차량 수정중 에러가 발생했습니다.");
				}
			}

			if(!deleteList.isEmpty()) {
				int deleteCnt = 0;
				for (Map<String, Object> delMap : deleteList) {
					delMap.put("userId", userId);
					deleteCnt += carMapper.deleteCmCar(delMap);
				}
				saveCnt++;
				
				if(deleteCnt != deleteList.size()){
					throw new Exception("차량 삭제중 에러가 발생했습니다.");
				}
			}

			data.put("saveCnt", saveCnt);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	@Transactional
	public Map<String, Object> getShCarList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID
			param.put("userNm", SecurityUtil.getCurrentUsername().get());// 사용자명
			List<Map<String, Object>> dataList = carMapper.getShCarList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/*
	 * 차량 공유정보 - 차량 공유정보 저장
	 */
	@Transactional
	public Map<String, Object> saveCarShareInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			HashMap<String, Object> map = objectMapper.readValue("{\"dataList\":" + param.get("dataList") + "}", HashMap.class);
			List<Map<String, Object>> dataList = (List<Map<String, Object>>) map.get("dataList");
			for (Map<String, Object> dataItem : dataList) {
				// 저장
				int processCnt = carMapper.saveCarShareInfo(dataItem);
				if (!(processCnt == 1 || processCnt == 2)) {
					throw new Exception("차량 공유정보 수정");
				}
				processCnt = carMapper.updateCarShareInfo(dataItem);// 차량 기본정보 공유여부 저장
				if (processCnt != 1) {
					throw new Exception("차량 공유정보 수정");
				}
			}
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/*
	 * 차량 공유정보 - 차량 공유정보 종료 대상 목록 조회
	 */
	@Transactional
	public Map<String, Object> getCarShareEndTrgtList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID
			List<Map<String, Object>> dataList = carMapper.getCarShareEndTrgtList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/*
	 * 차량 공유정보 - 차량 공유정보 종료
	 */
	@SuppressWarnings("unchecked")
	@Transactional
	public Map<String, Object> endCarShareInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			HashMap<String, Object> map = objectMapper.readValue("{\"dataList\":" + param.get("dataList") + "}", HashMap.class);
			List<?> dataList = (List<?>) map.get("dataList");
			param.put("dataList", dataList);
			param.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID
			// 저장
			int processCnt = carMapper.endCarShareSh(param);
			if (processCnt != dataList.size()) {
				throw new Exception("차량 공유정보 종료");
			}
			processCnt = carMapper.endCarShareCm(param);
			if (processCnt != dataList.size()) {
				throw new Exception("차량 공유정보 종료");
			}
			// CRUD 구분값 전달
			data.put("action", param.get("action"));
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/*
	 * 차량 기본정보 - 모바일 차량 기본정보 목록 조회
	 */

	public Map<String, Object> getMoCarBasicInfoList(Map<String, Object> param) {
		System.out.println("CarMobileService getMoCarBasicInfoList ");
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			System.out.println("paramData : " + paramData);
			param = (Map<String, Object>) paramData.get("param");
			param.put("userId", SecurityUtil.getCurrentUserId().get()); // 사용자 id

			List<Map<String, Object>> dataList = carMapper.getMoCarBasicInfoList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveMoCar(Map<String, Object> param) {
		System.out.println("CarService saveMoCar");
		Map<String, Object> data = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();
		try {

			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			paramData = (Map<String, Object>) paramData.get("param");

			int saveCnt = 0;
			String[] carPhotArr = {"carPhot","carPhot2","carPhot3"};
			String[] carCardArr = {"carCard","carCard2","carCard3"};
			for(String carPhot : carPhotArr) {
				if (paramData.get(carPhot) != null) {
					byte[] imgBase64Byte = null;
					imgBase64Byte = Base64.getDecoder().decode((String) paramData.get(carPhot));
					paramData.put(carPhot, imgBase64Byte);
				}
			}
			for(String carCard : carCardArr){
				if(paramData.get(carCard) != null){
					byte[] imgBase64Byte = null;
					imgBase64Byte = Base64.getDecoder().decode((String) paramData.get(carCard));
					paramData.put(carCard, imgBase64Byte);
				}
			}

			String shNo = (String)paramData.get("shNo");
			String shUseYn = (String)paramData.get("shUseYn");
			paramData.put("userId", userId);
			if(paramData.get("flag") == null){
				data.put("errCd", "500");
				data.put("errMsg", "저장 플래그 값이 없습니다.");
				return data;
			}else{
				String flag = (String)paramData.get("flag");
				if(paramData.get("cmPrice") != null && paramData.get("cmPrice").getClass().getSimpleName().equals("Integer")) {
					paramData.put("cmPrice", paramData.get("cmPrice").toString());
				}

				if("I".equals(flag)){
					saveCnt += carMapper.insertCmCar(paramData);
					saveCnt += carMapper.insertAdCar(paramData);
					if("R".equals(shUseYn)){
						saveCnt += carMapper.insertMoShCar(paramData);
						saveCnt += carMapper.updateMoCarShYn(paramData);
					}

					if(saveCnt != 2 && saveCnt != 4){
						data.put("errMsg", "차량 등록중 에러가 발생했습니다.");
						throw new Exception("차량 등록중 에러가 발생했습니다.");
					}
				}else if("U".equals(flag)){
					saveCnt += carMapper.updateCmCar(paramData);
					saveCnt += carMapper.updateAdCar(paramData);
					if(shNo == null && "R".equals(shUseYn)) {
						saveCnt += carMapper.insertMoShCar(paramData);
						saveCnt += carMapper.updateMoCarShYn(paramData);
					}else if(shNo != null && ("R".equals(shUseYn) || "E".equals(shUseYn))){
						saveCnt += carMapper.updateMoShCar(paramData);
						saveCnt += carMapper.updateMoCarShYn(paramData);
					}

					if(saveCnt != 2 && saveCnt != 4){
						data.put("errMsg", "차량 저장중 에러가 발생했습니다.");
						throw new Exception("차량 저장중 에러가 발생했습니다.");
					}
				}else{
					saveCnt += carMapper.deleteCmCar(paramData);

					if(saveCnt != 1){
						data.put("errMsg", "차량 삭제중 에러가 발생했습니다.");
						throw new Exception("차량 삭제중 에러가 발생했습니다.");
					}
				}

				data.put("stsCd", "200");
			}
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("errCd", "501");
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> getMoMdCarList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			param = (Map<String, Object>) paramData.get("param");

			List<Map<String, Object>> dataList = carMapper.getMoMdCarList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
}