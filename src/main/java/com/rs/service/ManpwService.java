package com.rs.service;

import java.sql.Blob;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rs.mapper.ManpwMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ManpwService {

	private final ManpwMapper manpwMapper;

	@Transactional
	public Map<String, Object> getManpwBasicInfoList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID
			param.put("userNm", SecurityUtil.getCurrentUsername().get());// 사용자명
			List<Map<String, Object>> dataList = manpwMapper.getManpwBasicInfoList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	/*
	 * 인력 기본정보 - 인력 기본정보 저장
	 */
	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveManpwBasicInfo(Map<String, Object> param) {
		System.out.println("ManpwService saveManpwBasicInfo");
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
			String[] photArr = {"WRK_PHTO","WRK_LICN","WRK_LICN2","WRK_LICN3"};
			if(!addList.isEmpty()){
				int addCmManpwCnt = 0;
				int addAdManpwCnt = 0;
				for (Map<String, Object> addMap : addList) {
					addMap.put("userId", userId);
					addCmManpwCnt += manpwMapper.insertCmManpw(addMap);
					for(String photo : photArr){
						if(addMap.get(photo) != null){
							byte[] imgBase64Byte = null;
							imgBase64Byte = Base64.getDecoder().decode((String) addMap.get(photo));
							addMap.put(photo, imgBase64Byte);
						}
					}
					addAdManpwCnt += manpwMapper.insertAdManpw(addMap);
					saveCnt++;
				}

				if(addCmManpwCnt != addAdManpwCnt){
					throw new Exception("인력 등록중 에러가 발생했습니다.");
				}
			}
			if(!updateList.isEmpty()){
				int updateCmManpwCnt = 0;
				int updateAdManpwCnt = 0;
				for (Map<String, Object> updateMap : updateList) {
					updateMap.put("userId", userId);
					
					if(updateMap.get("cmPrice").getClass().getSimpleName().equals("Integer")){
						updateMap.put("cmPrice", updateMap.get("cmPrice").toString());
					}
					
					updateCmManpwCnt += manpwMapper.updateCmManpw(updateMap);

					for(String photo : photArr){
						if(updateMap.get(photo) != null){
							byte[] imgBase64Byte = null;
							imgBase64Byte = Base64.getDecoder().decode((String) updateMap.get(photo));
							updateMap.put(photo, imgBase64Byte);
						}
					}
					updateAdManpwCnt += manpwMapper.updateAdManpw(updateMap);
					saveCnt++;
				}

				if(updateCmManpwCnt != updateAdManpwCnt){
					throw new Exception("인력 수정중 에러가 발생했습니다.");
				}
			}

			if(!deleteList.isEmpty()) {
				int deleteCnt = 0;
				for (Map<String, Object> delMap : deleteList) {
					delMap.put("userId", userId);
					deleteCnt += manpwMapper.deleteCmManpw(delMap);
				}
				saveCnt++;
				
				if(deleteCnt != deleteList.size()){
					throw new Exception("인력 삭제중 에러가 발생했습니다.");
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

	public Map<String, Object> getSh(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());

			List<Map<String, Object>> result = manpwMapper.getSh(param);

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
	public Map<String, Object> saveSh(Map<String, Object> param) throws JsonMappingException, JsonProcessingException {
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
				manpwMapper.createSh(map);
			}
	
			for (Map<String, Object> map : updateList) {
				map.put("userId", userId);
				if(ObjectUtils.isEmpty(map.get("SH_NO"))) {
					manpwMapper.createSh(map);

					map.put("SH_YN", "R");
					manpwMapper.updateCmManpw(map);
				}else {
					manpwMapper.updateSh(map);	
				}
			}
	
			for (Map<String, Object> map : deleteList) {
				map.put("userId", userId);
				manpwMapper.deleteSh(map);
				
				map.put("SH_YN", "N");
				manpwMapper.updateCmManpw(map);
			}
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	@SuppressWarnings("unchecked")
	@Transactional
	public Map<String, Object> endSh(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());

			if (ObjectUtils.isNotEmpty(param.get("manpwNoList"))) {
				ObjectMapper objectMapper = new ObjectMapper();
				ArrayList<String> manpwNoList = (ArrayList<String>) objectMapper.readValue((String) param.get("manpwNoList"), ArrayList.class);
				param.put("manpwNoList", manpwNoList);
			}

			if (ObjectUtils.isNotEmpty(param.get("shNoList"))) {
				ObjectMapper objectMapper = new ObjectMapper();
				ArrayList<String> shNoList = (ArrayList<String>) objectMapper.readValue((String) param.get("shNoList"), ArrayList.class);
				param.put("shNoList", shNoList);
			}

			manpwMapper.endSh(param);

			param.put("SH_YN", "E");
			manpwMapper.updateCmManpw(param);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> getWrkCd(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());

			List<Map<String, Object>> result = manpwMapper.getWrkCd(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> getManpwNo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());

			List<Map<String, Object>> result = manpwMapper.getManpwNo(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> getCpCd(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());

			List<Map<String, Object>> result = manpwMapper.getCpCd(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> getBrNo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());

			List<Map<String, Object>> result = manpwMapper.getBrNo(param);
			data.put("data", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	private byte[] stringToByte(String s) {
		try {
			return Base64.getDecoder().decode(s);
		} catch (Exception e) {
			return null;
		}
	}

	private byte[] blobToByte(Blob b) {
		try {
			return b.getBytes(1, (int) b.length());
		} catch (Exception e) {
			return null;
		}
	}

	public Map<String, Object> getMoSh(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			param = (Map<String, Object>) paramData.get("param");
			param.put("userId", SecurityUtil.getCurrentUserId().get()); // 사용자 id
			
			List<Map<String, Object>> result = manpwMapper.getMoSh(param);
			data.put("data", result);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveMoManpw(Map<String, Object> param) {
		System.out.println("ManpwService saveMoManpw");
		Map<String, Object> data = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();
		try {

			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			paramData = (Map<String, Object>) paramData.get("param");

			int saveCnt = 0;
			String[] wrkPhotArr = {"wrkPhto", "wrkPhto2", "wrkPhto3"};
			String[] wrkLicnArr = {"wrkLicn", "wrkLicn2", "wrkLicn3"};
			for (String wrkPhto : wrkPhotArr) {
				if (paramData.get(wrkPhto) != null) {
					byte[] imgBase64Byte = null;
					imgBase64Byte = Base64.getDecoder().decode((String) paramData.get(wrkPhto));
					paramData.put(wrkPhto, imgBase64Byte);
				}
			}
			for (String wrkLicn : wrkLicnArr) {
				if (paramData.get(wrkLicn) != null) {
					byte[] imgBase64Byte = null;
					imgBase64Byte = Base64.getDecoder().decode((String) paramData.get(wrkLicn));
					paramData.put(wrkLicn, imgBase64Byte);
				}
			}

			String shNo = (String) paramData.get("shNo");
			String shUseYn = (String) paramData.get("shUseYn");
			paramData.put("userId", userId);
			if (paramData.get("flag") == null) {
				data.put("errCd", "500");
				data.put("errMsg", "저장 플래그 값이 없습니다.");
				return data;
			} else {
				String flag = (String) paramData.get("flag");

				if(paramData.get("cmPrice") != null && paramData.get("cmPrice").getClass().getSimpleName().equals("Integer")) {
					paramData.put("cmPrice", paramData.get("cmPrice").toString());
				}

				if ("I".equals(flag)) {
					saveCnt += manpwMapper.insertMoCmManpw(paramData);
					saveCnt += manpwMapper.insertMoAdManpw(paramData);
					if ("R".equals(shUseYn)) {
						saveCnt += manpwMapper.insertMoShManpw(paramData);
						saveCnt += manpwMapper.updateMoManpwShYn(paramData);
					}

					if (saveCnt != 2 && saveCnt != 4) {
						data.put("errMsg", "인력 등록중 에러가 발생했습니다.");
						throw new Exception("인력 등록중 에러가 발생했습니다.");
					}
				} else if ("U".equals(flag)) {
					saveCnt += manpwMapper.updateMoCmManpw(paramData);
					saveCnt += manpwMapper.updateMoAdManpw(paramData);
					if (shNo == null && "R".equals(shUseYn)) {
						saveCnt += manpwMapper.insertMoShManpw(paramData);
						saveCnt += manpwMapper.updateMoManpwShYn(paramData);
					} else if (shNo != null && ("R".equals(shUseYn) || "E".equals(shUseYn))) {
						saveCnt += manpwMapper.updateMoShManpw(paramData);
						saveCnt += manpwMapper.updateMoManpwShYn(paramData);
					}

					if (saveCnt != 2 && saveCnt != 4) {
						data.put("errMsg", "인력 저장중 에러가 발생했습니다.");
						throw new Exception("인력 저장중 에러가 발생했습니다.");
					}
				} else {
					saveCnt += manpwMapper.deleteMoCmManpw(paramData);

					if (saveCnt != 1) {
						data.put("errMsg", "인력 삭제중 에러가 발생했습니다.");
						throw new Exception("인력 삭제중 에러가 발생했습니다.");
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
}