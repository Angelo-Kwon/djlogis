package com.rs.service;

import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import com.configuration.jwt.util.SecurityUtil;
import com.rs.mapper.EquipMapper;

import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * EquipService Service
 *
 * @패키지명 : com.rs.service
 * @파일명 : EquipService.java
 * @작성자 : Oh
 * @최초생성일 : 2023.07.10
 * @클래스내역 : =========================================================== DATE
 *        AUTHOR NOTE
 *        ----------------------------------------------------------- 2023.07.10
 *        Oh 최초 생성 ===========================================================
 */
@Slf4j
@RequiredArgsConstructor
@Service
public class EquipService {

	private final EquipMapper equipMapper;

	private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

	private static final AtomicInteger sequence = new AtomicInteger(0);

	/**
	 * @매서드명 : selectEquipList
	 * @매서드기능 : 조회
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public List<Map<String, Object>> getEquipList(Map<String, Object> map) {
		Map<String, Object> rtnMap = new HashMap<>();
		map.put("userId", SecurityUtil.getCurrentUserId().get());
		List<Map<String, Object>> list = equipMapper.getEquipList(map);
		rtnMap.put("list", list);
		return list;
	}

	/**
	 * @매서드명 : selectEquipList
	 * @매서드기능 : 조회
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public List<Map<String, Object>> getAdEquipList(Map<String, Object> map) {
		Map<String, Object> rtnMap = new HashMap<>();
		map.put("userId", SecurityUtil.getCurrentUserId().get());
		List<Map<String, Object>> list = equipMapper.getAdEquipList(map);
		rtnMap.put("list", list);
		return list;
	}

	/**
	 * @매서드명 : selectEquipList
	 * @매서드기능 : 조회
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public List<Map<String, Object>> getShEquipList(Map<String, Object> map) {
		Map<String, Object> rtnMap = new HashMap<>();
		map.put("userId", SecurityUtil.getCurrentUserId().get());
		List<Map<String, Object>> list = equipMapper.getShEquipList(map);
		rtnMap.put("list", list);
		return list;
	}

	/**
	 * @매서드명 : selectEquipList
	 * @매서드기능 : 조회
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public List<Map<String, Object>> selectShEndEquipInfo(Map<String, Object> map) {
		Map<String, Object> rtnMap = new HashMap<>();
		map.put("userId", SecurityUtil.getCurrentUserId().get());
		List<Map<String, Object>> list = equipMapper.selectShEndEquipInfo(map);
		rtnMap.put("list", list);
		return list;
	}

	/**
	 * @매서드명 : setEquipBasicInfo
	 * @매서드기능 : 저장
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public Map<String, Object> setEquipBasicInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			// TODO 임시 계정ID
			param.put("shareYn", "N");
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			param.put("modUserId", SecurityUtil.getCurrentUserId().get());
			param.put("creUserId", SecurityUtil.getCurrentUserId().get());
			int processCnt = equipMapper.insertEquipBasicInfo(param);
			if (processCnt != 1) {
				throw new Exception("기자재 기본정보 저장");
			}
			data.put("processCnt", 1);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.getMessage();
		}
		return data;
	}

	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveCmEquip(Map<String, Object> param) {
		System.out.println("EquipService saveCmEquip");
		Map<String, Object> result = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();

		try {
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> gridData = objectMapper.readValue(paramString, Map.class);
			List<Map<String, Object>> addList = (List<Map<String, Object>>) gridData.get("addList");
			List<Map<String, Object>> updateList = (List<Map<String, Object>>) gridData.get("updateList");
			List<Map<String, Object>> deleteList = (List<Map<String, Object>>) gridData.get("deleteList");

			int saveCnt = 0;
			String[] photoArr = {"photoFile","photoFile2","photoFile3"};
			String equipCd = (String) gridData.get("equipCd");
			String sequenceKey = switch (equipCd) {
                case "F" -> "FK";
                case "K" -> "CE";
                case "P" -> "PL";
                default -> throw new IllegalStateException("Unexpected value: " + equipCd);
            };

            if(!addList.isEmpty()){
				int addCmEquipCnt = 0;
				int addAdEquipCnt = 0;
				for (Map<String, Object> addMap : addList) {
					addMap.put("userId", userId);
					addMap.put("sequenceKey", sequenceKey);
					addCmEquipCnt += equipMapper.insertCmEquip(addMap);

					for(String photo : photoArr){
						if(addMap.get(photo) != null){
							byte[] imgBase64Byte = null;
							imgBase64Byte = Base64.getDecoder().decode((String) addMap.get(photo));
							addMap.put(photo, imgBase64Byte);
						}
					}
					addAdEquipCnt += equipMapper.insertAdEquip(addMap);
					saveCnt++;
				}

				if(addCmEquipCnt != addAdEquipCnt){
					throw new Exception("기자재 등록중 에러가 발생했습니다.");
				}
			}
			if(!updateList.isEmpty()){
				int updateCmEquipCnt = 0;
				int updateAdEquipCnt = 0;
				for (Map<String, Object> updateMap : updateList) {
					updateMap.put("userId", userId);
					
					if(updateMap.get("cmPrice").getClass().getSimpleName().equals("Integer")){
						  updateMap.put("cmPrice", updateMap.get("cmPrice").toString()); }
					
					updateCmEquipCnt += equipMapper.updateCmEquip(updateMap);

					for(String photo : photoArr){
						if(updateMap.get(photo) != null){
							byte[] imgBase64Byte = null;
							imgBase64Byte = Base64.getDecoder().decode((String) updateMap.get(photo));
							updateMap.put(photo, imgBase64Byte);
						}
					}
					updateAdEquipCnt += equipMapper.updateAdEquip(updateMap);
					saveCnt++;
				}

				if(updateCmEquipCnt != updateAdEquipCnt){
					throw new Exception("기자재 수정중 에러가 발생했습니다.");
				}
			}

			if(!deleteList.isEmpty()) {
				int deleteCnt = 0;
				for (Map<String, Object> delMap : deleteList) {
					delMap.put("userId", userId);
					deleteCnt += equipMapper.deleteCmEquip(delMap);
				}
				
				if(deleteCnt != deleteList.size()){
					throw new Exception("기자재 삭제중 에러가 발생했습니다.");
				}
			}
			result.put("saveCnt", saveCnt);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			result.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return result;
	}
	@Transactional
	public Map<String, Object> saveAdEquip(Map<String, Object> param) {
		System.out.println("EquipService saveAdEquip");
		Map<String, Object> result = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();

		try {
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> gridData = objectMapper.readValue(paramString, Map.class);
			List<Map<String, Object>> updateList = (List<Map<String, Object>>) gridData.get("updateList");

			String[] photArr = {"photoFile","photoFile2","photoFile3"};
			int saveCnt = 0;
			if(!updateList.isEmpty()){
				for (Map<String, Object> updateMap : updateList) {
					for(String photo : photArr){
						if(updateMap.get(photo) != null){
							byte[] imgBase64Byte = null;
							imgBase64Byte = Base64.getDecoder().decode((String) updateMap.get(photo));
							updateMap.put(photo, imgBase64Byte);
						}
					}
					updateMap.put("userId", userId);
					saveCnt +=  equipMapper.saveAdEquip(updateMap);
				}
			}
			result.put("saveCnt", saveCnt);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			result.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return result;
	}


	/**
	 * @매서드명 : upEquipBasicInfo
	 * @매서드기능 : 수정
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public Map<String, Object> upEquipBasicInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			param.put("modUserId", SecurityUtil.getCurrentUserId().get());

			int processCnt = equipMapper.updateEquipBasicInfo(param);
			if (processCnt != 1) {
				throw new Exception("기자재 기본정보 저장");
			}
			data.put("processCnt", 1);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.getMessage();
		}
		return data;
	}

	/**
	 * @매서드명 : upEquipBasicInfo
	 * @매서드기능 : 수정
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	@Transactional
	public Map<String, Object> upShEquipBasicInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {

			param.put("userId", SecurityUtil.getCurrentUserId().get());
			param.put("modUserId", SecurityUtil.getCurrentUserId().get());
			// int processCnt = 1;
			int processCnt = equipMapper.upShdateEquipBasicInfo(param);
			if (processCnt != 1) {
				throw new Exception("기자재 공유정보 수정");
			}
			data.put("processCnt", 1);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.getMessage();
		}
		return data;
	}

	/**
	 * @매서드명 : upEquipBasicInfo
	 * @매서드기능 : 수정
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	@Transactional
	public Map<String, Object> saveShEquip(@RequestParam Map<String, Object> param) throws JsonProcessingException {
		System.out.println("EquipService saveShEquip");

		HashMap<String, Object> result = new HashMap<>();

		String paramListString = param.get("gridList").toString();

		// ObjectMapper 생성
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, Object> gridListMap = objectMapper.readValue(paramListString, Map.class);
		List<Map<String, Object>> updateList = (List<Map<String, Object>>) gridListMap.get("updateList");

		int saveCnt = 0;

		try {
			// 파라미터 생성
			for (Map<String, Object> dataItem : updateList) {
				dataItem.put("userId", SecurityUtil.getCurrentUserId().get());
				dataItem.put("equipId", dataItem.get("EQUIP_ID").toString());
				dataItem.put("equipCd", dataItem.get("EQUIP_CD").toString());
				// 기자재 공유정보 저장
				equipMapper.insertShEquip(dataItem);
				// 기자재 기본정보 공유상태 업데이트
				saveCnt += equipMapper.updateCmEquipShYn(dataItem);
			}
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			result.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}

		result.put("saveCnt", saveCnt);

		return result;
	}

	/**
	 * @매서드명 : upEquipBasicInfo
	 * @매서드기능 : 수정
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public Map<String, Object> upAdEquipBasicInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {

			param.put("userId", SecurityUtil.getCurrentUserId().get());
			param.put("modUserId", SecurityUtil.getCurrentUserId().get());

			String imgBase64Str1 = param.get("previewImage") == null ? null : String.valueOf(param.get("previewImage"));
			byte[] imgBase64Byte1 = null;
			if (imgBase64Str1 != null) {
				imgBase64Byte1 = Base64.getDecoder().decode(imgBase64Str1);
			}

			param.put("previewImage", imgBase64Byte1);


			int processCnt = equipMapper.upAddateEquipBasicInfo(param);
			if (processCnt != 1) {
				throw new Exception("기자재 부가정보 수정");
			}
			data.put("processCnt", 1);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.getMessage();
		}
		return data;
	}

	/**
	 * @매서드명 : delEquipBasicInfo
	 * @매서드기능 : 삭제
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public Map<String, Object> delEquipBasicInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			int processCnt = equipMapper.deleteEquipBasicInfo(param);
			if (processCnt != 1) {
				throw new Exception("기자재 기본정보 저장");
			}
			data.put("processCnt", 1);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.getMessage();
		}
		return data;
	}

	/**
	 * @매서드명 : delEquipBasicInfo
	 * @매서드기능 : 삭제
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public Map<String, Object> delShEndEquipBasicInfo(List<Map<String, Object>> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		for (Map<String, Object> map : param) {
			map.put("userId", SecurityUtil.getCurrentUserId().get());
		}
		try {
			int processCnt = equipMapper.deleteShEndEquipBasicInfo(param);
			if (processCnt < 1) {
				throw new Exception("기자재 기본정보 저장");
			}
			data.put("processCnt", 1);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.getMessage();
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : delEquipBasicInfo
	 * @매서드기능 : 삭제
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public Map<String, Object> delEquipShBasicInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			int processCnt = equipMapper.deleteShEquipBasicInfo(param);
			if (processCnt != 1) {
				throw new Exception("기자재 기본정보 저장");
			}
			data.put("processCnt", 1);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.getMessage();
		}
		return data;
	}

	/**
	 * @매서드명 : getSeqName
	 * @매서드기능 : seq
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public String getSeqName() {

		String seqName = equipMapper.makeFileSeqName();

		return seqName;
	}

	/**
	 * @매서드명 : selectEquipList
	 * @매서드기능 : 조회
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectEquip(Map<String, Object> map) {
		map.put("userId", SecurityUtil.getCurrentUserId().get());
		Map<String, Object> dataMap = equipMapper.getEquipInfo(map);
		return dataMap;
	}

	/**
	 * @매서드명 : selectAdEquip
	 * @매서드기능 : 조회
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectAdEquip(Map<String, Object> param) {
		System.out.println("EquipService selectAdEquip() ");
		System.out.println("param cd " + param.get("equipCd"));
		System.out.println("param Id " + param.get("equipId"));

		return equipMapper.getAdEquipInfo(param);
	}

	/**
	 * @매서드명 : selectEquipList
	 * @매서드기능 : 조회
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectShEquip(Map<String, Object> map) {
		map.put("userId", SecurityUtil.getCurrentUserId().get());
		Map<String, Object> dataMap = equipMapper.getShEquipInfo(map);
		return dataMap;
	}

	/**
	 * @매서드명 : setEquipBasicInfo
	 * @매서드기능 : 저장
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	public Map<String, Object> setAdEquipBasicInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			String getUseYn = equipMapper.getEqUseYn(param);
			param.put("useYn", getUseYn);
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			param.put("modUserId", SecurityUtil.getCurrentUserId().get());
			param.put("creUserId", SecurityUtil.getCurrentUserId().get());

			String imgBase64Str1 = param.get("previewImage") == null ? null : String.valueOf(param.get("previewImage"));
			byte[] imgBase64Byte1 = null;
			if (imgBase64Str1 != null) {
				imgBase64Byte1 = Base64.getDecoder().decode(imgBase64Str1);
			}

			param.put("previewImage", imgBase64Byte1);

			int processCnt = equipMapper.insertAdEquipBasicInfo(param);
			if (processCnt != 1) {
				throw new Exception("기자재 부가정보저장");
			}

			data.put("processCnt", 1);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.getMessage();
		}
		return data;
	}

	/**
	 * @매서드명 : setEquipBasicInfo
	 * @매서드기능 : 저장
	 * @작성날짜 : 2023.07.04
	 * @param param
	 * @return
	 */
	@Transactional
	public Map<String, Object> setShEquipBasicInfo(Map<String, Object> param) {
		Map<String, Object> getSeq = new HashMap<String, Object>();
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			/*
			 * LocalDate nowDate = LocalDate.now(); String datePart =
			 * nowDate.format(formatter);
			 *
			 * param.put("dateKey", datePart); // 시퀀스생성 getSeq =
			 * equipMapper.getShEquipSeq(param);
			 *
			 * param.put("shNo", getSeq.get("SH_NO"));
			 *
			 */

			param.put("userId", SecurityUtil.getCurrentUserId().get());
			param.put("modUserId", SecurityUtil.getCurrentUserId().get());
			param.put("creUserId", SecurityUtil.getCurrentUserId().get());
			param.put("shUseYn", "R");
			param.put("useYn", "Y");

			// int processCnt = 1;
			int processCnt = equipMapper.insertShEquipBasicInfo(param);
			int processCnt2 = equipMapper.updateEquipInfo(param);
			if (processCnt != 1 && processCnt2 != 1) {
				throw new Exception("기자재 기본정보 저장");
			}
			data.put("processCnt", 1);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.getMessage();
		}
		return data;
	}

	/*
	 * @매서드명 : selectMoEquipList
	 * @매서드기능 : 모바일 조회
	 * @작성날짜 : 2023.08.30
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectMoEquipList(Map<String, Object> param) {
		System.out.println("EquipMobileService selectMoEquipList ");
		Map<String, Object> rtnMap = new HashMap<String, Object>();

		try{
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			param = (Map<String, Object>) paramData.get("param");
			param.put("userId", SecurityUtil.getCurrentUserId().get()); // 사용자 id

			List<Map<String, Object>> list = equipMapper.selectMoEquipList(param);
			rtnMap.put("dataList", list);
		} catch (Exception e) {
			rtnMap.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return rtnMap;
	}

	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveMoEquip(Map<String, Object> param) {
		System.out.println("EquipService saveMoEquip");
		Map<String, Object> data = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();
		try {

			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			paramData = (Map<String, Object>) paramData.get("param");

			int saveCnt = 0;
			String[] photoArr = {"photoFile","photoFile2","photoFile3"};
			String equipCd = (String) paramData.get("equipCd");
			String sequenceKey = switch (equipCd) {
				case "F" -> "FK";
				case "K" -> "CE";
				case "P" -> "PL";
				default -> throw new IllegalStateException("Unexpected value: " + equipCd);
			};
			paramData.put("sequenceKey", sequenceKey);
			
			for(String photo : photoArr){
				if(paramData.get(photo) != null){
					byte[] imgBase64Byte = null;
					imgBase64Byte = Base64.getDecoder().decode((String) paramData.get(photo));
					paramData.put(photo, imgBase64Byte);
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
					saveCnt += equipMapper.insertCmEquip(paramData);
					saveCnt += equipMapper.insertAdEquip(paramData);
					if("R".equals(shUseYn)){
						saveCnt += equipMapper.insertMoShEquip(paramData);
						saveCnt += equipMapper.updateMoEquipShYn(paramData);
					}

					if(saveCnt != 2 && saveCnt != 4){
						data.put("errMsg", "기자재 등록중 에러가 발생했습니다.");
						throw new Exception("기자재 등록중 에러가 발생했습니다.");
					}
				}else if("U".equals(flag)){
					saveCnt += equipMapper.updateCmEquip(paramData);
					saveCnt += equipMapper.updateAdEquip(paramData);

					if(shNo == null && "R".equals(shUseYn)){
						saveCnt += equipMapper.insertMoShEquip(paramData);
						saveCnt += equipMapper.updateMoEquipShYn(paramData);
					}else if(shNo != null && ("R".equals(shUseYn) || "E".equals(shUseYn))){
						saveCnt += equipMapper.updateMoShEquip(paramData);
						saveCnt += equipMapper.updateMoEquipShYn(paramData);
					}

					if(saveCnt != 2 && saveCnt != 4){
						data.put("errMsg", "기자재 저장중 에러가 발생했습니다.");
						throw new Exception("기자재 저장중 에러가 발생했습니다.");
					}
				}else{
					saveCnt += equipMapper.deleteCmEquip(paramData);

					if(saveCnt != 1){
						data.put("errMsg", "기자재 삭제중 에러가 발생했습니다.");
						throw new Exception("기자재 삭제중 에러가 발생했습니다.");
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