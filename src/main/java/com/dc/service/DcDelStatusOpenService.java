package com.dc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dc.mapper.DcDelStatusMapper;
import com.dc.mapper.DcDelStatusOpenMapper;

@Service
@Transactional
public class DcDelStatusOpenService {

	@Autowired
	private DcDelStatusOpenMapper dcDelStatusOpenMapper;
	
	/**
	 * @매서드명 : selectDelStatusList
	 * @매서드기능 : 배송현황조회
	 * @작성날짜 : 2023.09.18
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectDelStatusList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcDelStatusOpenMapper.selectDelStatusList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
	
	
	/**
	 * @매서드명 : selectDelStatusList
	 * @매서드기능 : 납품완료조회
	 * @작성날짜 : 2023.09.18
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectDelCompleteList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcDelStatusOpenMapper.selectDelCompleteList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

}
