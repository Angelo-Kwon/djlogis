package com.sy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sy.mapper.ContractMapper;
import com.sy.mapper.JoinMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ContractService {

	private final ContractMapper contractMapper;

	private final PasswordEncoder passwordEncoder;

	private final JoinMapper joinMapper;

	/*
	 * 계약등록 - 시스템 목록 조회
	 */
	@Transactional
	public Map<String, Object> getSystemList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = contractMapper.getSystemList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/*
	 * 계약등록 - 업체정보 목록 조회
	 */
	@Transactional
	public Map<String, Object> getCustInfoList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = contractMapper.getCustInfoList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	/*
	 * 계약등록 - 계약기간 시스템 중복 조회
	 */
	public Map<String, Object> getContractTerm(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			Map<String, Object> contractTerm = contractMapper.getContractTerm(param);
			data.put("data", contractTerm);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/*
	 * 계약등록 - 계약 목록 조회
	 */
	@Transactional
	public Map<String, Object> getContractList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = contractMapper.getContractList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/*
	 * 계약등록 - 계약ID 중복검사
	 */
	@Transactional
	public Map<String, Object> checkIdDup(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			String dupYn = contractMapper.checkIdDup(param);
			data.put("dupYn", dupYn);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/*
	 * 계약등록 - 계약 저장 1.사용자 입력 2.어카운트 업체마스터 입력 3.업체별 계약정보 입력 4.업체별 계약정보 상세 입력
	 */
	@SuppressWarnings("unchecked")
	@Transactional
	public Map<String, Object> saveContractList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			HashMap<String, Object> map = objectMapper.readValue("{\"dataList\":" + param.get("dataList") + "}", HashMap.class);
			List<Map<String, Object>> dataList = (List<Map<String, Object>>) map.get("dataList");
			//공통 PARAM
			param.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID
			param.put("accountId", SecurityUtil.getCurrentAccountId().get());// 사용자 소속 어카운트 ID

			// 사용자 입력
			String encodePw = passwordEncoder.encode(param.get("loginId") + "1234!@");
			String getUserIdSeq = joinMapper.getUserIdSeq();
			param.put("loginPwd", encodePw);
			//param.put("userType", "CUSTOMER");//유저타입 일단 무료회원가입 = CUSTOMER 하드코딩 추후변경사항오면 변경예정
			param.put("userIdSeq", getUserIdSeq);
			int processCnt1 = contractMapper.saveUser(param);
			if (!(processCnt1 == 1 || processCnt1 == 2)) {
				throw new Exception("계약 저장 (사용자 입력)");
			}
			int processCnt2 = contractMapper.saveUserGroup(param);
			if (!(processCnt2 == 1 || processCnt2 == 2)) {
				throw new Exception("계약 저장 (사용자 그룹 입력)");
			}
			// 어카운트 업체마스터 입력
			int processCnt3 = contractMapper.saveAtct(param);
			if (!(processCnt3 == 1 || processCnt3 == 2)) {
				throw new Exception("계약 저장 (어카운트 업체마스터 입력)");
			}
			// 계약키 조회
			String contractId = contractMapper.getContractId();
			// 업체별 계약정보 입력
			param.put("contractId", contractId);//계약키
//			int cloudFee = 0;
//			if ("1".equals(param.get("cloudType"))) {//클라우드 기본형:10만원
//				cloudFee = 100000;
//			} else if ("2".equals(param.get("cloudType"))) {//클라우드 고급형:20만원
//				cloudFee = 200000;
//			}
			param.put("totalCloudFee", param.get("cloudFee"));//총 클라우드 사용료
			int processCnt4 = contractMapper.saveContract(param);
			if (!(processCnt4 == 1 || processCnt4 == 2)) {
				throw new Exception("계약 저장 (업체별 계약정보 입력)");
			}
			for (Map<String, Object> dataItem : dataList) {
				// 업체별 계약정보 상세 입력
				dataItem.put("userIdSeq", getUserIdSeq);//사용자ID
				dataItem.put("contractId", contractId);//계약키
				dataItem.put("userId", SecurityUtil.getCurrentUserId().get());// 사용자ID
				//if ("1".equals(dataItem.get("cloudType"))) {//클라우드 기본형:10만원
				//	cloudFee = 100000;
				//} else if ("2".equals(dataItem.get("cloudType"))) {//클라우드 고급형:20만원
				//	cloudFee = 200000;
				//}
				dataItem.put("cloudFee", param.get("cloudFee"));

				int processCnt5 = contractMapper.saveContractDetail(dataItem);
				if (!(processCnt5 == 1 || processCnt5 == 2)) {
					throw new Exception("계약 저장 (업체별 계약정보 상세 입력)");
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