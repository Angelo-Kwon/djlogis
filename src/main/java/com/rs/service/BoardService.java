package com.rs.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.common.service.SmsService;
import com.configuration.util.CrypoUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.rs.mapper.BoardMapper;

/**
 * Main Service
 * 
 * @패키지명 : com.rs.service
 * @파일명 : BoardService.java
 * @작성자 : jrYu
 * @최초생성일 : 2023.08.07
 * @클래스내역 : =========================================================== DATE
 *        AUTHOR NOTE
 *        ----------------------------------------------------------- 2023.08.07
 *        jrYu 최초 생성 ===========================================================
 */

@Service
public class BoardService {

	@Autowired
	private BoardMapper boardMapper;
	@Autowired
	private SmsService smsService;


	/**
	 * @매서드명 : selectBoardList
	 * @매서드기능 : 소통신청 기본정보 목록 조회
	 * @작성날짜 : 2023.08.07
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectShBoardList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			List<Map<String, Object>> dataList = boardMapper.selectShBoardList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : selectShBoardDetailInfo
	 * @매서드기능 : 소통신청 기본정보 상세내용 조회
	 * @작성날짜 : 2023.08.07
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectShBoardDetailInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			Map<String, Object> result = boardMapper.selectShBoardDetailInfo(param);
			data.put("dataList", result);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : insertShBoardInfo
	 * @매서드기능 : 수요자 소통내역 기본정보 신규입력
	 * @작성날짜 : 2023.08.07
	 * @param param
	 * @return
	 */
	public Map<String, Object> insertShBoardInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			LocalDate date = LocalDate.now();
			DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyyMMdd");
		    String formatDate = date.format(format);
		    param.put("date", formatDate);
		    param.put("userId", SecurityUtil.getCurrentUserId().get());
			int processCnt = boardMapper.insertShBoardInfo(param);
			
			if (processCnt != 1) {
				throw new Exception("소통신청 생성");
			}
			sendSMS(param, "R");
			data.put("processCnt", "processCnt");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	/**
	 * @매서드명 : updateShBoardInfo
	 * @매서드기능 : 소통신청 기본정보 수정
	 * @작성날짜 : 2023.08.07
	 * @param param
	 * @return
	 */
	public Map<String, Object> updateShConBoardInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());

			int processCnt = boardMapper.updateShConBoardInfo(param);
			if (processCnt != 1) {
				throw new Exception("소통신청 기본정보 수정");
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
	 * @매서드명 : updateShBoardInfo
	 * @매서드기능 : 소통응답 기본정보 수정
	 * @작성날짜 : 2023.08.07
	 * @param param
	 * @return
	 */
	public Map<String, Object> updateShSupBoardInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());

			int processCnt = boardMapper.updateShSupBoardInfo(param);
			if (processCnt != 1) {
				throw new Exception("소통신청 응답 내용 저장");
			}

			System.out.println("param : " + param);
			String matCd = param.get("matCd").toString();
			String shNm = "";
			if("W".equals(matCd)){
//				System.out.println("1 " + boardMapper.selectWhouseNm(param));
				shNm = boardMapper.selectWhouseNm(param);
				param.put("whNm", shNm);
			}else if("C".equals(matCd)){
//				System.out.println("2 " + boardMapper.selectCarFullNo(param));
				shNm = boardMapper.selectCarFullNo(param);
				param.put("carFullNo", shNm);
			}else if("E".equals(matCd)){
//				System.out.println("3 " + boardMapper.selectEquipNm(param));
				shNm = boardMapper.selectEquipNm(param);
				param.put("equipNm", shNm);
			}


			sendSMS(param, "A");
			data.put("processCnt", "processCnt");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : deleteShBoardInfo
	 * @매서드기능 : 소통신청 기본정보 삭제
	 * @작성날짜 : 2023.08.07
	 * @param param
	 * @return
	 */
	public Map<String, Object> deleteShBoardInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			int processCnt = boardMapper.deleteShBoardInfo(param);
			if (processCnt != 1) {
				throw new Exception("소통신청 삭제");
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
	 * @매서드명 : selectMoShBoardList
	 * @매서드기능 : 모바일 소통신청 기본정보 목록 조회
	 * @작성날짜 : 2023.09.20
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectMoShBoardList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("userId", SecurityUtil.getCurrentUserId().get());
			
			List<Map<String, Object>> dataList = boardMapper.selectMoShBoardList(param);
			data.put("dataList", dataList);
			
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveMoShBoard(Map<String, Object> param) {
		System.out.println("BoardService saveMoBoardResMark");
		Map<String, Object> data = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();
		try {

			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			paramData = (Map<String, Object>) paramData.get("param");

			int saveCnt = 0;
			paramData.put("userId", userId);

			saveCnt += boardMapper.insertMoShBoard(paramData);

			if(saveCnt != 1){
				data.put("errMsg", "소통내역 등록중 에러가 발생했습니다.");
				throw new Exception("소통내역 등록중 에러가 발생했습니다.");
			}

			sendSMS(paramData, "R");
			data.put("stsCd", "200");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("errCd", "501");
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	@Transactional
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveMoShBoardResMark(Map<String, Object> param) {
		System.out.println("BoardService saveMoBoardResMark");
		Map<String, Object> data = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get();
		try {

			ObjectMapper objectMapper = new ObjectMapper();
			String paramString = objectMapper.writeValueAsString(param);
			Map<String, Object> paramData = objectMapper.readValue(paramString, Map.class);
			paramData = (Map<String, Object>) paramData.get("param");

			int saveCnt = 0;
			paramData.put("userId", userId);

			saveCnt += boardMapper.updateMoShBoardResMark(paramData);
			sendSMS(paramData, "A");

			if(saveCnt != 1){
				data.put("errMsg", "소통답변 등록중 에러가 발생했습니다.");
				throw new Exception("소통답변 등록중 에러가 발생했습니다.");
			}

			data.put("stsCd", "200");
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("errCd", "501");
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	private void sendSMS(Map<String, Object> param, String smsType) {
		Map<String, Object> smsParam = new HashMap<String, Object>();
		try{
			String shUseReqNm = "";
			String shUserId = "";
			
			String matCd = param.get("matCd").toString();
			if("W".equals(matCd)) {
				shUseReqNm = param.get("whNm").toString();
			}else if("C".equals(matCd)){
				shUseReqNm = param.get("carFullNo").toString();
			}else if("E".equals(matCd)){
				shUseReqNm = param.get("equipNm").toString();
			}

			String msg = "";
			if("R".equals(smsType)){
				msg += "등록하신 ["+shUseReqNm+"]에 문의가 등록되었습니다\\n";
				msg += "답변 진행 부탁드립니다.";
				shUserId = param.get("supId").toString();
			}else {
				msg += "질문하신 ["+shUseReqNm+"]에 답변이 등록되었습니다.";
				shUserId = param.get("comConId").toString();
			}

			param.put("shUserId", shUserId);
			String userPhone = boardMapper.getUserPhone(param);

			if(userPhone != null && !userPhone.isEmpty()){
				String toPhone = CrypoUtil.decrypto(userPhone).replaceAll("-", "");
				smsParam.put("toPhone", toPhone);
				smsParam.put("msg", msg);

				Map<String, Object> smsData = smsService.putSms(smsParam);
				System.out.println("SMS ReponseData : " + smsData);
			}

		}catch (Exception e){
			e.printStackTrace();
		}
	}

}