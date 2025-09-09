package com.dc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.configuration.jwt.util.SecurityUtil;
import com.dc.mapper.DcCarMapper;
import com.sy.mapper.DashboardMapper;

@Service
@Transactional
public class DcCarService {

	@Autowired
	private DcCarMapper dcCarMapper;
	
	public Map<String, Object> getDelv(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> result = dcCarMapper.getDelv(param);
			data.put("data", result);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> getDelvDtl(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			Map<String, Object> result = dcCarMapper.getDelvDtl(param);
			data.put("data", result);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	public Map<String, Object> getSend(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> result = dcCarMapper.getSend(param);
			data.put("data", result);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	public Map<String, Object> getSendDtl(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			Map<String, Object> result = dcCarMapper.getSendDtl(param);
			data.put("data", result);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> getRealDelv(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcCarMapper.getRealDelv(param);
			data.put("data", dataList);
			Map<String, Object> totalCnt = dcCarMapper.getRealDelvCount(param);
			data.put("cnt", totalCnt);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	public Map<String, Object> selectCenterList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = dcCarMapper.selectCenterList(param);
		data.put("dataList", dataList);
		return data;
	}
	
	public Map<String, Object> getPathButton(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = dcCarMapper.getPathButton(param);
		data.put("dataList", dataList);
		return data;
	}
	
	public Map<String, Object> getStateCount(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		Map<String, Object> dataList = dcCarMapper.getStateCount(param);
		data.put("dataList", dataList);
		return data;
	}
	
	public Map<String, Object> carGridList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = dcCarMapper.carGridList(param);
		data.put("dataList", dataList);
		return data;
	}

}
