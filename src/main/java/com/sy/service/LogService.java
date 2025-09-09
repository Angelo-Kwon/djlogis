package com.sy.service;

import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.configuration.jwt.util.SecurityUtil;
import com.sy.mapper.LogMapper;

/**
 * User Service
 * 
 * @패키지명 : com.sy.service
 * @파일명 : UserManageService.java
 * @작성자 : Oh
 * @최초생성일 : 2023.08.09
 */

@Service
public class LogService {

	@Autowired
	private LogMapper logMapper;
	
	/**
	 * @매서드명 : selectLogList
	 * @매서드기능 : 로그 관리 화면 조회
	 * @작성날짜 : 2023.08.09
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectLogList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("limit", Integer.parseInt(param.get("limit").toString()));

			int totalCnt = logMapper.selectLogCnt(param);
			data.put("totalCnt", totalCnt);
			
			List<Map<String, Object>> dataList = logMapper.selectLogList(param);
			data.put("dataList", dataList);
			 
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		
		return data;
	}

	/**
	 * @매서드명 : getClientIp
	 * @매서드기능 : IP 가져오기
	 * @작성날짜 : 2023.11.01
	 * @param request
	 * @return String
	 */
	public String getClientIp(HttpServletRequest request) {
		String ipAddr = "";
		try {
			// 로그인 LOG 정보 IP
			ipAddr = request.getHeader("X-Forwarded-For");
			
			if (ipAddr == null || ipAddr.length() == 0) {
				ipAddr = request.getHeader("Proxy-Client-ipAddr");
			}
			if (ipAddr == null || ipAddr.length() == 0) {
				ipAddr = request.getHeader("WL-Proxy-Client-ipAddr");
			}
			
			if (ipAddr == null || ipAddr.length() == 0) {
				ipAddr = request.getHeader("HTTP_CLIENT_ipAddr");
			}
			
			if (ipAddr == null || ipAddr.length() == 0) {
				ipAddr = request.getHeader("HTTP_X_FORWARDED_FOR");
			}
			
			if (ipAddr == null || ipAddr.length() == 0) {
				ipAddr = request.getRemoteAddr();
			}
			
			if(ipAddr.equals("0:0:0:0:0:0:0:1")) {
				InetAddress ip = InetAddress.getLocalHost(); // => 로컬 IP
				ipAddr = ip.getHostAddress(); 
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
	      
	      return ipAddr;
	}
	
	/**
	 * @매서드명 : insertLog
	 * @매서드기능 : 로그인/페이지 이동 로그 등록
	 * @작성날짜 : 2023.11.01
	 * @param param
	 * @return
	 */
	public Map<String, Object> insertLog(Map<String, Object> param, HttpServletRequest request) {
		try {
			// 등록일 때 date param에 put
			if(!param.containsKey("log_seq")) {
				Date date = new Date();
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd"); 
				param.put("date", dateFormat.format(date));
			}
			
			param.put("log_ip", getClientIp(request));
			param.put("login_id", SecurityUtil.getCurrentUsername().get());

			int processCnt = logMapper.insertLog(param);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return param;
	}
	
	/**
	 * @매서드명 : updateLog
	 * @매서드기능 : 로그인/페이지 이동 로그 로그아웃 시간 수정
	 * @작성날짜 : 2023.11.01
	 * @param param
	 * @return
	 */
	public Map<String, Object> updateLog(Map<String, Object> param, HttpServletRequest request) {
		Map<String, Object> data = new HashMap<String, Object>();
		
		try {
			param.put("log_ip", getClientIp(request));
			param.put("login_id", SecurityUtil.getCurrentUsername().get());
			
			int processCnt = logMapper.updateLog(param);
			data.put("processCnt", processCnt);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return data;
	}
}