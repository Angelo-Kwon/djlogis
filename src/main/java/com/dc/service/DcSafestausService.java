package com.dc.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.configuration.jwt.util.SecurityUtil;
import com.dc.mapper.DcSafestausMapper;

@Service
@Transactional
public class DcSafestausService {

	@Autowired
	private DcSafestausMapper dcSafestausMapper;
	
	public Map<String, Object> selectSafestausList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcSafestausMapper.selectSafestausList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	public Map<String, Object> getWeather() throws IOException {
		Map<String, Object> data = new HashMap<String, Object>();
		
		try {
			LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
			String currentDate = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
			String tomorrowDate = now.plusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
			String afterTomorrowDate = now.plusDays(2).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
			int currentHour = Integer.parseInt(now.format(DateTimeFormatter.ofPattern("HH")));
			String time = " " + String.format("%02d", ((currentHour/3) * 3)) + ":00:00";
	
			Map<String, Object> today = new HashMap<String, Object>();
			Map<String, Object> tomorrow = new HashMap<String, Object>();
			Map<String, Object> afterTomorrow = new HashMap<String, Object>();
			
			String apiUrl = "https://api.openweathermap.org/data/2.5/forecast";
	    	String serviceKey = "5e804f354e2c1d73e689b6bf6f822e68";
	    	String id = "1841810";
	    	
	    	StringBuilder urlBuilder = new StringBuilder(apiUrl);
	    	urlBuilder.append("?" + URLEncoder.encode("appid","UTF-8") + "="+serviceKey);
	    	urlBuilder.append("&" + URLEncoder.encode("id","UTF-8") + "="+id);
	    	urlBuilder.append("&" + URLEncoder.encode("units","UTF-8") + "=" + URLEncoder.encode("metric", "UTF-8")); 
	    	
	    	/*
	    	 * GET방식으로 전송해서 파라미터 받아오기
	    	 */
	    	URL url = new URL(urlBuilder.toString());
	    	
	    	HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	    	conn.setRequestMethod("GET");
	    	conn.setRequestProperty("Content-type", "application/json");
	    	
	    	BufferedReader rd;
	    	if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
	    		rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
	    	} else {
	    		rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
	    	}
	    	
	    	StringBuilder sb = new StringBuilder();
	    	String line;
	    	while ((line = rd.readLine()) != null) {
	    		sb.append(line);
	    	}
	    	
	    	rd.close();
	    	conn.disconnect();
	
	    	String result= sb.toString();
			
	    	// response 키를 가지고 데이터를 파싱
			JSONObject obj1 = new JSONObject(result);
			JSONArray list = obj1.getJSONArray("list");
			
			for(int i=0; i<list.length(); i++) {
				JSONObject main = (JSONObject) list.getJSONObject(i).get("main");
				JSONObject wind = (JSONObject) list.getJSONObject(i).get("wind");
				String fcstDate = (String) list.getJSONObject(i).get("dt_txt");
				String TMP = (String) main.getString("temp");
				String REH = (String) main.getString("humidity");
				String WSD = (String) wind.getString("speed");
	
				if(fcstDate.equals(currentDate + time)) {
					today.put("fcstDate", fcstDate.split(" ")[0]);
					today.put("TMP", TMP);
					today.put("REH", REH);
					today.put("WSD", WSD);				
				} else if(fcstDate.equals(tomorrowDate + time)) {
					tomorrow.put("fcstDate", fcstDate.split(" ")[0]);
					tomorrow.put("TMP", TMP);
					tomorrow.put("REH", REH);
					tomorrow.put("WSD", WSD);
				} else if(fcstDate.equals(afterTomorrowDate + time)) {
					afterTomorrow.put("fcstDate", fcstDate.split(" ")[0]);
					afterTomorrow.put("TMP", TMP);
					afterTomorrow.put("REH", REH);
					afterTomorrow.put("WSD", WSD);
				}
			}
			
			data.put("resultCode", "00");
			data.put("resultMsg", "NORMAL_SERVICE");
			data.put("baseTime", String.format("%02d",currentHour) + "00");
		    data.put("today", today);
		    data.put("tomorrow", tomorrow);
		    data.put("afterTomorrow", afterTomorrow);
	
		} catch (Exception e) {
			e.printStackTrace();
			
			data.put("resultCode", "99");
			data.put("resultMsg", "UNKNOWN_ERROR");
		}
		
		return data;
	}
	
	public Map<String, Object> getWorkStatus() {
		Map<String, Object> data = new HashMap<String, Object>();
		Map<String, Object> workStatus = new HashMap<String, Object>();
		try {
			// 총작업자, 실제작업자, 총지게차, 작업지게차, 총입고작업자, 입고작업자, 총출고작업자, 출고작업자
			workStatus.put("totWorkCnt", "50"); 
			workStatus.put("crntWorkCnt", "47");
			workStatus.put("totForkLiftCnt", "4");
			workStatus.put("crntForkLiftCnt", "4");
			workStatus.put("totStoreCnt", "20");
			workStatus.put("crntSoreCnt", "19");
			workStatus.put("totReleaseCnt", "30");
			workStatus.put("crntReleaseCnt", "28");
			data.put("data", workStatus);
			
			data.put("resultCode", "00");
			data.put("resultMsg", "NORMAL_SERVICE");
		} catch (Exception e) {
			e.printStackTrace();

			data.put("resultCode", "99");
			data.put("resultMsg", "UNKNOWN_ERROR");
		}
		return data;
	}
	
	public Map<String, Object> getStoRelStatus() {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> storeDataList = dcSafestausMapper.getStoreData();
			data.put("storeData", storeDataList);
			List<Map<String, Object>> releaseDataList = dcSafestausMapper.getReleaseData();
			data.put("releaseData", releaseDataList);
			
			data.put("resultCode", "00");
			data.put("resultMsg", "NORMAL_SERVICE");
		} catch (Exception e) {
			e.printStackTrace();
			
			data.put("resultCode", "99");
			data.put("resultMsg", "UNKNOWN_ERROR");
		}
		return data;
	}
	
	public Map<String, Object> getSaftyStatus() {
		Map<String, Object> data = new HashMap<String, Object>();
		Map<String, Object> saftyStatus = new HashMap<String, Object>();
		try {
			// 불꽃감지기B, 불꽃감지기R, 차동식감지기B, 차동식감지기R, 정은식감지기B, 정은식감지기R
			saftyStatus.put("fireSensorB", "6");
			saftyStatus.put("fireSensorR", "0");
			saftyStatus.put("tempSensor1B", "2");
			saftyStatus.put("tempSensor1R", "0");
			saftyStatus.put("tempSensor2B", "1");
			saftyStatus.put("tempSensor2R", "0");
			data.put("data", saftyStatus);
			
			data.put("resultCode", "00");
			data.put("resultMsg", "NORMAL_SERVICE");
		} catch (Exception e) {
			e.printStackTrace();
			
			data.put("resultCode", "99");
			data.put("resultMsg", "UNKNOWN_ERROR");
		}
		return data;
	}
	
	public Map<String, Object> getProductInfo(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			Map<String, Object> productInfo = dcSafestausMapper.getProductInfo(param);
			data.put("data", productInfo);
			
			data.put("resultCode", "00");
			data.put("resultMsg", "NORMAL_SERVICE");
		} catch (Exception e) {
			e.printStackTrace();
			
			data.put("resultCode", "99");
			data.put("resultMsg", "UNKNOWN_ERROR");
		}
		return data;
	}
	
	public Map<String, Object> insertSafeEvent(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		
		String userId = SecurityUtil.getCurrentUserId().get();
		param.put("userId", userId);
		
		try {
			int result = dcSafestausMapper.insertSafeEvent(param);

            if (result > 0) {
                data.put("resultCode", "00");
                data.put("resultMsg", "NORMAL_SERVICE");
            }             
		} catch (Exception e) {
			e.printStackTrace();
			
			data.put("resultCode", "99");
			data.put("resultMsg", "UNKNOWN_ERROR");
		}

		return data;
	}

}
