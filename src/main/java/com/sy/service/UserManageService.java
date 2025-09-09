package com.sy.service;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.common.mapper.CommonMapper;
import com.configuration.jwt.util.SecurityUtil;
import com.configuration.util.CrypoUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sy.mapper.JoinMapper;
import com.sy.mapper.UserManageMapper;

/**
 * User Service
 * 
 * @패키지명 : com.sy.service
 * @파일명 : UserManageService.java
 * @작성자 : Oh
 * @최초생성일 : 2023.08.09
 */

@Service
public class UserManageService {

	@Autowired
	private UserManageMapper userManageMapper;

	@Autowired
	private CommonMapper commonMapper;

	@Autowired
	private JoinMapper joinMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	/**
	 * @매서드명 : selectUserInfoList
	 * @매서드기능 : 사용자 등록화면 조회
	 * @작성날짜 : 2023.08.09
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectUserInfoList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> resultList = userManageMapper.selectUserInfoList(param);
			List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();

			for (Map<String, Object> sel : resultList) {
				if (sel.get("USER_EMAIL") != null) {
					String decodeEmail = CrypoUtil.decrypto(sel.get("USER_EMAIL").toString()); // 이메일 복호화
					sel.put("USER_EMAIL", decodeEmail);
				}
				if (sel.get("USER_PHONE") != null) {
					String decodePhone = CrypoUtil.decrypto(sel.get("USER_PHONE").toString()); // 전화번호 복호화
					sel.put("USER_PHONE", decodePhone);
				}

				dataList.add(sel);
			}
			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : selectGridInfoList
	 * @매서드기능 : 사용자 등록 grid 내 select 정보 조회
	 * @작성날짜 : 2023.08.12
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectGridInfoList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("compCd", "100");
			param.put("cmgrpcd", "USEYN");
			List<Map<String, Object>> useYnList = commonMapper.getCommCode(param);
			data.put("useYnList", useYnList);

			param.put("cmgrpcd", "USERTYP");
			List<Map<String, Object>> useTypeList = commonMapper.getCommCode(param);
			data.put("useTypeList", useTypeList);
			
			param.put("cmgrpcd", "RSTYPE");
			List<Map<String, Object>> rsTypeList = commonMapper.getCommCode(param);
			data.put("rsTypeList", rsTypeList);

			List<Map<String, Object>> compkeyList = userManageMapper.selectCompkeyList();
			data.put("compkeyList", compkeyList);

			List<Map<String, Object>> ownerkyList = userManageMapper.selectOwnerkyList();
			data.put("ownerkyList", ownerkyList);

			List<Map<String, Object>> ptnrkeyList = userManageMapper.selectPtnrkeyList();
			data.put("ptnrkeyList", ptnrkeyList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : insertUserInfo
	 * @매서드기능 : 사용자등록(유료) 정보 신규 등록
	 * @작성날짜 : 2023.08.13
	 * @param param
	 * @return
	 */
	public Map<String, Object> insertUserInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();

		try {
			// 데이터 암호화
			String encodePw = passwordEncoder.encode(param.get("edit_user_id").toString() + "1234!@"); // 사용자 암호 초기화
			if(param.get("edit_user_pw") != null) {
				encodePw = passwordEncoder.encode(param.get("edit_user_pw").toString()); // 사용자 암호 초기화
			}
			param.put("edit_user_pw", encodePw);

			String encodePhone = CrypoUtil.encrypto(param.get("edit_user_email").toString());
			param.put("edit_user_email", encodePhone);

			String encodeEmail = CrypoUtil.encrypto(param.get("edit_user_phone").toString());
			param.put("edit_user_phone", encodeEmail);

		} catch (InvalidKeyException | NoSuchPaddingException | NoSuchAlgorithmException | UnsupportedEncodingException
				| BadPaddingException | IllegalBlockSizeException e) {
			e.printStackTrace();
		}

		String user_id = userManageMapper.selectNewUserId(); // user_id 시퀀스

		param.put("reg_id", SecurityUtil.getCurrentUserId().get());
		param.put("user_id", user_id);

		try {
			int processCnt = userManageMapper.userInsertInfo(param); // 사용자 정보 신규 등록
			if (processCnt != 1) {
				throw new Exception("사용자등록(유료) 정보 - 신규 등록");
			}

			processCnt = userManageMapper.insertUserRoleGrp(param);
			if (processCnt != 1) {
				throw new Exception("사용자등록(유료) 정보 - 사용자권한 신규 등록");
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
	 * @매서드명 : saveUserInfo
	 * @매서드기능 : 사용자등록(유로) 변경된 정보(수정, 삭제) 저장.
	 * @작성날짜 : 2023.08.13
	 * @param param
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> saveUserInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			System.out.println(" PARAM ::  " + param);
			// 파라미터 생성
			ObjectMapper objectMapper = new ObjectMapper();
			HashMap<String, Object> map = objectMapper.readValue("{\"dataList\":" + param.get("dataList") + "}",
					HashMap.class);
			List<Map<String, Object>> dataList = (List<Map<String, Object>>) map.get("dataList");

			for (Map<String, Object> upd : dataList) {
				upd.put("mod_id", SecurityUtil.getCurrentUserId().get());
				upd.put("user_id", upd.get("USER_ID"));

				if (upd.get("USER_PHONE") != null) {
					String encodePhone = CrypoUtil.encrypto(upd.get("USER_PHONE").toString()); // 전화번호 암호화
					upd.put("USER_PHONE", encodePhone);
				}

				if (upd.get("USER_EMAIL") != null) {
					String encodeEmail = CrypoUtil.encrypto(upd.get("USER_EMAIL").toString()); // 이메일 암호화
					upd.put("USER_EMAIL", encodeEmail);
				}

				int processCnt = userManageMapper.updateUserInfo(upd); // 사용자 정보 수정
				if (processCnt != 1) {
					throw new Exception("사용자등록(유료) 정보 수정");
				}

				if (upd.get("URGROUP_ID") == null) {

					upd.put("reg_id", SecurityUtil.getCurrentUserId().get());
					upd.put("user_id", upd.get("USER_ID"));
					upd.put("edit_role_grp", upd.get("RGROUP_ID"));

					processCnt = userManageMapper.insertUserRoleGrp(upd); // 사용자 권한 신규 등록.
				} else {
					processCnt = userManageMapper.updateUserRoleGrp(upd); // 사용자 권한 수정.
				}

				if (processCnt != 1) {
					throw new Exception("사용자등록(유료) 권한 정보 수정");
				}
			}

			data.put("processCnt", "processCnt");
		} catch (

		Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * @매서드명 : updateUserPassReset
	 * @매서드기능 : 사용자등록(유료) 정보 수정 - 패스워드 초기화
	 * @작성날짜 : 2023.08.13
	 * @param param
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> updateUserPassReset(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {

			String encodePw = "";

			ObjectMapper objectMapper = new ObjectMapper();

			HashMap<String, Object> map = objectMapper.readValue("{\"dataList\":" + param.get("dataList") + "}",
					HashMap.class);
			List<Map<String, Object>> updateList = (List<Map<String, Object>>) map.get("dataList");

			for (Map<String, Object> upd : updateList) {
				// encodePw = passwordEncoder.encode(upd.get("LOGIN_ID").toString() + "1234!@"); // 사용자 암호 초기화
				encodePw = passwordEncoder.encode("1"); // 사용자 암호 초기화
				upd.put("loginPwd", encodePw);
				upd.put("modUserId", SecurityUtil.getCurrentUserId().get());
				upd.put("loginId", upd.get("LOGIN_ID"));

				int processCnt = joinMapper.resetPassword(upd); // 사용자 패스워드 초기화
				if (processCnt != 1) {
					throw new Exception("사용자등록(유료) 비밀번호 초기화");
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
	 * @매서드명 : selectUserInfoDetail
	 * @매서드기능 : 사용자 정보 상세
	 * @작성날짜 : 2023.09.06
	 * @param username
	 * @return Map<String, Object>
	 */
	public Map<String, Object> selectUserInfoDetail(String username) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			Map<String, Object> dataList = userManageMapper.selectUserInfoDetail(username);

			data.put("dataList", dataList);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> selectUserLastUrl(Map<String, Object> param) {
		return userManageMapper.selectUserLastUrl(param);
	}

	public Map<String, Object> updLastUrl(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		String userId = SecurityUtil.getCurrentUserId().get(); // 사용자ID
		param.put("userId", userId);
		try {
			int processCnt = userManageMapper.updLastUrl(param);
			data.put("processCnt", processCnt);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
}