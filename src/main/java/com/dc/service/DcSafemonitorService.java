package com.dc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.common.mapper.CommonMapper;
import com.dc.mapper.DcSafemonitorMapper;

@Service
@Transactional
public class DcSafemonitorService {
	
	@Autowired
	private CommonMapper commonMapper;

	@Autowired
	private DcSafemonitorMapper dcSafemonitorMapper;
	
	public Map<String, Object> selectSafemonitorList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcSafemonitorMapper.selectSafemonitorList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> selectSafemonitorDtlList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcSafemonitorMapper.selectSafemonitorDtlList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	public Map<String, Object> selectSafeEventList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			param.put("cmgrpcd", "EVENTYP");
			List<Map<String, Object>> eventList = commonMapper.getCommCode(param);
			data.put("eventList", eventList);			
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

}
