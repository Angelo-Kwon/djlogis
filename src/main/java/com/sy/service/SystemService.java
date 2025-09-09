package com.sy.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.util.CollectionUtils;

import com.configuration.jwt.util.SecurityUtil;
import com.sy.mapper.SystemMapper;

/**
 * Main Service
 * 
 * @패키지명 : com.sy.service
 * @파일명 : SystemService.java
 * @작성자 : jrYu
 * @최초생성일 : 2023.08.11
 * @클래스내역 : =========================================================== DATE
 *        AUTHOR NOTE
 *        ----------------------------------------------------------- 2023.08.11
 *        jrYu 최초 생성 ===========================================================
 */

@Service
public class SystemService {

	@Autowired
	private SystemMapper systemMapper;

	/**
	 * @매서드명 : selectOpSystemList
	 * @매서드기능 : 시스템관리 기본정보 목록 조회
	 * @작성날짜 : 2023.08.11
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectOpSystemList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("login_id", SecurityUtil.getCurrentUsername().get());
			
			List<Map<String, Object>> dataList = systemMapper.selectOpSystemList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}

	/**
	 * @매서드명 : insertOpSystemInfo
	 * @매서드기능 : 시스템관리 기본정보 신규입력 및 수정
	 * @작성날짜 : 2023.08.11
	 * @param param
	 * @return Map<String, Object>
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> insertOpSystemInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			int processCnt = 0;
			
			List<Map<String, Object>> addList = (List<Map<String, Object>>) param.get("addList");
			List<Map<String, Object>> updateList = (List<Map<String, Object>>) param.get("updateList");
			List<String> systemIdList = (List<String>) param.get("systemIdList");

			List<Map<String, Object>> list = new ArrayList<>();
			list.addAll(addList);
			list.addAll(updateList);
			
			Map<String, Object> dataMap = new HashMap<String, Object>();
			dataMap.put("login_id",SecurityUtil.getCurrentUsername().get());
			dataMap.put("list", list);
			
			if(!CollectionUtils.isEmpty(list) && list.size() > 0){
				processCnt = systemMapper.insertOpSystemInfo(dataMap);
				if (processCnt < 0) {
					throw new Exception("시스템관리 생성 및 수정");
				}
			}
			
			if(!CollectionUtils.isEmpty(systemIdList) && systemIdList.size() > 0){
				dataMap.remove("list");
				dataMap.put("systemIdList", systemIdList);
				processCnt = systemMapper.updateOpSystemUseYn(dataMap);
				if (processCnt < 0) {
					throw new Exception("시스템관리 사용 여부 수정");
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
