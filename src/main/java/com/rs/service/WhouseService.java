package com.rs.service;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rs.mapper.WhouseMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Main Service
 *
 * @패키지명 : com.share.service
 * @파일명 : WhouseService.java
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
public class WhouseService {

	@Autowired
	private WhouseMapper whouseMapper;

	/**
	 * @매서드명 : selectWhouseList
	 * @매서드기능 : 창고 기본정보 목록 조회
	 * @작성날짜 : 2023.07.10
	 * @param param
	 * @return
	 */
	@Transactional
	public Map<String, Object> getWhouseBasicInfoList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("user_id", SecurityUtil.getCurrentUserId().get()); // 사용자 id
			param.put("userNm", SecurityUtil.getCurrentUsername().get());// 사용자명
			List<Map<String, Object>> dataList = whouseMapper.getWhouseBasicInfoList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : saveCmWhouseInfo
	 * @매서드기능 : 창고 기본정보 신규 생성/수정/삭제 정보 저장
	 * @작성날짜 : 2023.09.10
	 * @param param
	 * @return
	 */
	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveWhouseBasicInfo(Map<String, Object> param) {
		System.out.println("WhouseService saveWhouseBasicInfo");
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
			String[] photArr = {"photo","photo2","photo3"};
			if(!addList.isEmpty()){
				int addCmWhouseCnt = 0;
				int addAdWhouseCnt = 0;
				for (Map<String, Object> addMap : addList) {
					addMap.put("userId", userId);
					addCmWhouseCnt += whouseMapper.insertCmWhouse(addMap);
					for(String photo : photArr){
						if(addMap.get(photo) != null){
							byte[] imgBase64Byte = null;
							imgBase64Byte = Base64.getDecoder().decode((String) addMap.get(photo));
							addMap.put(photo, imgBase64Byte);
						}
					}
					addAdWhouseCnt += whouseMapper.insertAdWhouse(addMap);
					saveCnt++;
				}

				if(addCmWhouseCnt != addAdWhouseCnt){
					throw new Exception("창고 등록중 에러가 발생했습니다.");
				}
			}
			
			if(!updateList.isEmpty()){
				int updateCmWhouseCnt = 0;
				int updateAdWhouseCnt = 0;
				for (Map<String, Object> updateMap : updateList) {
					updateMap.put("userId", userId);
					
					if(updateMap.get("cmPrice").getClass().getSimpleName().equals("Integer")) {
						updateMap.put("cmPrice", updateMap.get("cmPrice").toString());
					}
					 
					updateCmWhouseCnt += whouseMapper.updateCmWhouse(updateMap);

					
					for(String photo : photArr){
						if(updateMap.get(photo) != null){
							byte[] imgBase64Byte = null;
							imgBase64Byte = Base64.getDecoder().decode((String) updateMap.get(photo));
							updateMap.put(photo, imgBase64Byte);
						}
					}
					updateAdWhouseCnt += whouseMapper.updateAdWhouse(updateMap);
					saveCnt++;
				}

				if(updateCmWhouseCnt != updateAdWhouseCnt){
					
					
					throw new Exception("창고 수정중 에러가 발생했습니다.");
				}
			}

			if(!deleteList.isEmpty()) {
				int deleteCnt = 0;
				for (Map<String, Object> delMap : deleteList) {
					delMap.put("userId", userId);
					deleteCnt += whouseMapper.deleteCmWhouse(delMap);
				}
				saveCnt++;
				
				if(deleteCnt != deleteList.size()){
					throw new Exception("창고 삭제중 에러가 발생했습니다.");
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

	/**
	 * @매서드명 : selectShWhouseDetailInfo
	 * @매서드기능 : 창고 공유정보 상세내용 조회
	 * @작성날짜 : 2023.07.23
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectShWhouseDetailInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("user_id", SecurityUtil.getCurrentUserId().get());
			List<Map<String, Object>> dataList = whouseMapper.selectShWhouseDetailInfo(param);

			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : saveShWhouseDetailInfo
	 * @매서드기능 : 창고 공유 - 신규 및 수정정보 입력
	 * @작성날짜 : 2023.08.02
	 * @param param
	 * @return
	 */
	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveShWhouseDetailInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
//			HashMap<String, Object> map = objectMapper.readValue("{\"dataList\":" + param.get("dataList") + "}",
//					HashMap.class);
//			List<Map<String, Object>> dataList = (List<Map<String, Object>>) map.get("dataList");


//			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> gridData = objectMapper.readValue(paramString, Map.class);
			List<Map<String, Object>> dataList = (List<Map<String, Object>>) gridData.get("dataList");

			for (Map<String, Object> dataItem : dataList) {
				dataItem.put("user_id", SecurityUtil.getCurrentUserId().get());
				// 키조회 (미등록 창고 이거나 공유종료된 창고 재등록할때)
				if ("E".equals(dataItem.get("sh_use_yn"))
						|| (dataItem.get("SH_NO") == null || "".equals(dataItem.get("SH_NO")))) {
					String seq = whouseMapper.getShSeq();
					dataItem.put("SH_NO", seq);
				}

				int processCnt = whouseMapper.saveShWhouseDetailInfo(dataItem);
				if (!(processCnt == 1 || processCnt == 2)) {
					throw new Exception("창고 공유정보 생성");
				}

				processCnt = whouseMapper.updateShRegCmWhouse(dataItem);
				if (!(processCnt == 1 || processCnt == 2)) {
					throw new Exception("창고 공유정보 생성 - 기본정보 공유상태 수정");
				}
			}

			data.put("processCnt", "processCnt");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : updateShWhouseInfo
	 * @매서드기능 : 창고 공유 - 수정
	 * @작성날짜 : 2023.08.02
	 * @param param
	 * @return
	 */
	public Map<String, Object> updateShWhouseInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("user_id", SecurityUtil.getCurrentUserId().get());

			int processCnt = whouseMapper.updateShWhouseInfo(param);

			if (processCnt != 1) {
				throw new Exception("창고 공유정보 수정");
			}

			data.put("processCnt", "processCnt");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : deleteShWhouseInfo
	 * @매서드기능 : 창고 공유 - 삭제
	 * @작성날짜 : 2023.08.02
	 * @param param
	 * @return
	 */
	public Map<String, Object> deleteShWhouseInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("user_id", SecurityUtil.getCurrentUserId().get());
			int processCnt = whouseMapper.deleteShWhouseInfo(param);

			if (processCnt != 1) {
				throw new Exception("창고 공유정보 삭제");
			}
			data.put("processCnt", "processCnt");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : selectShWhouseEndlInfo
	 * @매서드기능 : 창고 기본정보 목록 조회
	 * @작성날짜 : 2023.07.10
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectShWhouseEndlInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("user_id", SecurityUtil.getCurrentUserId().get());
			List<Map<String, Object>> dataList = whouseMapper.selectShWhouseEndlInfo(param);

			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : updateShEndWhouseInfo
	 * @매서드기능 : 창고 공유 - 종료
	 * @작성날짜 : 2023.08.06
	 * @param param
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> updateShEndWhouseInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {

			ObjectMapper objectMapper = new ObjectMapper();

			HashMap<String, Object> map = objectMapper.readValue("{\"dataList\":" + param.get("dataList") + "}",
					HashMap.class);
			List<?> dataList = (List<?>) map.get("dataList");
			param.put("dataList", dataList);
			param.put("user_id", SecurityUtil.getCurrentUserId().get());

			int processCnt = whouseMapper.updateShEndWhouseInfo(param);

			if (processCnt != dataList.size()) {
				throw new Exception("창고 공유정보 종료");
			}

			processCnt = whouseMapper.updateShChangCmWhouse(param);
			if (processCnt != dataList.size()) {
				throw new Exception("창고 공유정보(기본) 종료");
			}

			data.put("processCnt", "processCnt");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : selectMoCmWhouseList
	 * @매서드기능 : 모바일 창고 기본정보 목록 조회
	 * @작성날짜 : 2023.08.29
	 * @param param
	 * @return
	 */


	public Map<String, Object> selectMoCmWhouseList(Map<String, Object> param) {
		System.out.println("WhouseMobileService selectMoCmWhouseList " + param);
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			param = (Map<String, Object>) paramData.get("param");

			param.put("userId", SecurityUtil.getCurrentUserId().get()); // 사용자 id
			List<Map<String, Object>> dataList = whouseMapper.selectMoWhouseList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : saveCmWhouseInfo
	 * @매서드기능 : 창고 기본정보 신규 생성/수정/삭제 정보 저장
	 * @작성날짜 : 2023.09.10
	 * @param param
	 * @return
	 */
	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveMoWhouse(Map<String, Object> param) {
		System.out.println("WhouseService saveMoWhouse");
		Map<String, Object> data = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();
		try {

			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			paramData = (Map<String, Object>) paramData.get("param");

			int saveCnt = 0;
			String[] photArr = {"photo","photo2","photo3"};
			for(String photo : photArr){
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
					saveCnt += whouseMapper.insertCmWhouse(paramData);
					saveCnt += whouseMapper.insertAdWhouse(paramData);
					if("R".equals(shUseYn)){
						saveCnt += whouseMapper.insertMoShWhouse(paramData);
						saveCnt += whouseMapper.updateMoWhouseShYn(paramData);
					}

					if(saveCnt != 2 && saveCnt != 4){
						data.put("errMsg", "창고 등록중 에러가 발생했습니다.");
						throw new Exception("창고 등록중 에러가 발생했습니다.");
					}
				}else if("U".equals(flag)){
					saveCnt += whouseMapper.updateCmWhouse(paramData);
					saveCnt += whouseMapper.updateAdWhouse(paramData);
					if(shNo == null && "R".equals(shUseYn)){
						saveCnt += whouseMapper.insertMoShWhouse(paramData);
						saveCnt += whouseMapper.updateMoWhouseShYn(paramData);
					}else if (shNo != null && ("R".equals(shUseYn) || "E".equals(shUseYn))){
						saveCnt += whouseMapper.updateMoShWhouse(paramData);
						saveCnt += whouseMapper.updateMoWhouseShYn(paramData);
					}

					if(saveCnt != 2 && saveCnt != 4){
						data.put("errMsg", "창고 저장중 에러가 발생했습니다.");
						throw new Exception("창고 저장중 에러가 발생했습니다.");
					}
				}else{
					saveCnt += whouseMapper.deleteCmWhouse(paramData);

					if(saveCnt != 1){
						data.put("errMsg", "창고 삭제중 에러가 발생했습니다.");
						throw new Exception("창고 삭제중 에러가 발생했습니다.");
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
