package com.dc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dc.mapper.DcStockMapper;
import com.dc.mapper.DcWhouseMapper;

@Service
@Transactional
public class DcStockService {

	@Autowired
	private DcStockMapper dcStockMapper;
	
	public Map<String, Object> selectStockList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcStockMapper.selectStockList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> selectStockDtlList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcStockMapper.selectStockDtlList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

}
