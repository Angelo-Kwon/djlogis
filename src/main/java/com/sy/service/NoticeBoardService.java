package com.sy.service;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sy.mapper.NoticeBoardMapper;

/**
 * Main Service
 * 
 * @패키지명 : com.sy.service
 * @파일명 : NoticeBoardService.java
 * @작성자 : jrYu
 * @최초생성일 : 2023.10.25
 * @클래스내역 : =========================================================== DATE
 *        AUTHOR NOTE
 *        ----------------------------------------------------------- 2023.10.25
 *        jrYu 최초 생성 ===========================================================
 */

@Service
public class NoticeBoardService {

	@Autowired
	private NoticeBoardMapper noticeBoardMapper;

	/**
	 * @매서드명 : selectNoticeList
	 * @매서드기능 : 공지사항 목록 조회
	 * @작성날짜 : 2023.10.25
	 * @param param
	 * @return Map<String, Object>
	 */
	public Map<String, Object> selectNoticeList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			int totalCnt = noticeBoardMapper.selectNoticeCnt(param);
			data.put("totalCnt", totalCnt);
			
			if(param.get("limit") != null && !param.get("limit").equals("")) {
				param.put("limit", Integer.parseInt(param.get("limit").toString()));
			}
			List<Map<String, Object>> dataList = noticeBoardMapper.selectNoticeList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}
	
	/**
	 * @매서드명 : selectNoticeDetailInfo
	 * @매서드기능 : 공지사항 목록 상세 조회
	 * @작성날짜 : 2023.10.25
	 * @param param
	 * @return Map<String, Object>
	 */
	public Map<String, Object> selectNoticeDetailInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			Map<String, Object> dataInfo = noticeBoardMapper.selectNoticeDetailInfo(param);
			data.put("dataInfo", dataInfo);
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


	/**
	 * @매서드명 : insertNoticeInfo
	 * @매서드기능 : 공지사항 신규입력 및 수정
	 * @작성날짜 : 2023.10.25
	 * @param param
	 * @return Map<String, Object>
	 */
	public Map<String, Object> insertNoticeInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		int processCnt = 0;
		try {
				String loginId = SecurityUtil.getCurrentUsername().get();
				param.put("loginId", loginId);
				
			    for(int i=0; i<3; i++) { 
				   String key = "schAttachFile" + (i+1);
				   if(param.get(key) != null) { 
			    	  param.put(key, this.stringToByte((String) param.get(key))); 
				   } 
			    }
				
				processCnt = noticeBoardMapper.insertNoticeInfo(param);
				data.put("",processCnt);
				
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}

	/**
	 * @매서드명 : updateNoticeUseYn
	 * @매서드기능 : 공지사항 사용여부 수정
	 * @작성날짜 : 2023.10.25
	 * @param param
	 * @return Map<String, Object>
	 */
	public Map<String, Object> updateNoticeUseYn(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		
		try {
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			HashMap<String, Object> updateMap = objectMapper.readValue("{\"updateList\":" + param.get("updateList") + "}", HashMap.class);
			List<Map<String, Object>> updateList = (List<Map<String, Object>>) updateMap.get("updateList");
			HashMap<String, Object> deleteMap = objectMapper.readValue("{\"deleteNoList\":" + param.get("deleteNoList") + "}", HashMap.class);
			List<String> deleteNoList = (List<String>) deleteMap.get("deleteNoList");
			
			String loginId = SecurityUtil.getCurrentUsername().get();
			
			for (Map<String, Object> upd : updateList) {
				upd.put("LOGIN_ID", loginId);
				noticeBoardMapper.updateNoticeUseYn(upd);
			}
			System.out.println(deleteNoList);
			if(deleteNoList.size() > 0) {
				noticeBoardMapper.deleteNotice(deleteNoList);
			}
			
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	/**
	 * @매서드명 : updateNoticHitCnt
	 * @매서드기능 : 공지사항 조회수 수정
	 * @작성날짜 : 2023.10.25
	 * @param param
	 * @return Map<String, Object>
	 */
	public Map<String, Object> updateNoticeHitCnt(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		
		try {
			String loginId = SecurityUtil.getCurrentUsername().get();
			param.put("LOGIN_ID", loginId);

			noticeBoardMapper.updateNoticeHitCnt(param);
			
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	public Map<String, Object> selectNewsList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			int totalCnt = noticeBoardMapper.selectNoticeCnt(param);
			data.put("totalCnt", totalCnt);
			
			if(param.get("limit") != null && !param.get("limit").equals("")) {
				param.put("limit", Integer.parseInt(param.get("limit").toString()));
			}
			
			List<Map<String, Object>> dataList = noticeBoardMapper.selectNewsList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}

}
