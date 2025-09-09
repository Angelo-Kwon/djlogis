package com.dc.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.configuration.jwt.util.SecurityUtil;
import com.dc.mapper.DcResourceMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
public class DcResourceService {
	
	@Autowired
	private DcResourceMapper dcResourceMapper;
	
	/**
	 * @매서드명 : selectDcResourceList
	 * @매서드기능 : 자원 정보 목록 조회
	 * @작성날짜 : 2023.09.18
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectDcResourceList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcResourceMapper.selectDcResourceList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : insertDcResourceInfo
	 * @매서드기능 : 자원 정보 저장
	 * @작성날짜 : 2023.09.22
	 * @param param
	 * @return
	 */
	public Map<String, Object> insertDcResourceInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			int processCnt = 0;
			
			List<Map<String, Object>> addList = (List<Map<String, Object>>) param.get("addList");
			List<Map<String, Object>> updateList = (List<Map<String, Object>>) param.get("updateList");
			List<Map<String, Object>> deleteList = (List<Map<String, Object>>) param.get("deleteList");

			updateList.stream().filter(x -> x.get("action") != "").toList();
			updateList.addAll(addList);
			
			Map<String, Object> dataMap = new HashMap<String, Object>();
			dataMap.put("date", LocalDate.now().getYear());
			dataMap.put("login_id",SecurityUtil.getCurrentUsername().get());
			dataMap.put("list", updateList);
			
			if(!CollectionUtils.isEmpty(updateList) && updateList.size() > 0){
				processCnt = dcResourceMapper.insertDcResourceInfo(dataMap);
				if (processCnt < 0) {
					throw new Exception("자원 정보 생성 및 수정");
				}
			}
			
			if(!CollectionUtils.isEmpty(deleteList) && deleteList.size() > 0){
				dataMap.put("list", deleteList);
				processCnt = dcResourceMapper.deleteDcResourceInfo(dataMap);
				if (processCnt < 0) {
					throw new Exception("자원 정보 삭제");
				}
			}
			
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}

	/**
	 * @매서드명 : saveDcResourceInfo
	 * @매서드기능 : 자원 정보 신규 생성/수정/삭제 정보 저장
	 * @작성날짜 : 2023.09.22
	 * @param param
	 * @return
	 */
	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveDcResourceInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {

			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			HashMap<String, Object> map = objectMapper.readValue("{\"dataList\":" + param.get("dataList") + "}", HashMap.class);
			List<Map<String, Object>> dataList = (List<Map<String, Object>>) map.get("dataList");
			for (Map<String, Object> dataItem : dataList) {
//				// 키조회
//				if (dataItem.get("edit_wh_id") == null || dataItem.get("edit_wh_id") == "") {
//					String seq = dcResourceMapper.getSeq("CM_WHOUSE_SEQ");
//					dataItem.put("edit_wh_id", seq);
//				}
				// 자원 정보 저장
				dataItem.put("user_id", SecurityUtil.getCurrentUserId().get());// 사용자ID
				int processCnt = dcResourceMapper.saveDcResourceInfo(dataItem);
				// 검증
				if (!(processCnt == 1 || processCnt == 2)) {
					throw new Exception("차량 기본정보 생성");
				}
			}
			data.put("processCnt", "processCnt");
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
}
