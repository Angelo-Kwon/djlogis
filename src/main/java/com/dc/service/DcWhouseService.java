package com.dc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dc.mapper.DcWhouseMapper;

@Service
@Transactional
public class DcWhouseService {

	@Autowired
	private DcWhouseMapper dcWhouseMapper;
	
	/**
	 * @매서드명 : selectDcWhouseList
	 * @매서드기능 : 창고 정보 목록 조회
	 * @작성날짜 : 2023.09.18
	 * @param param
	 * @return
	 */
	public Map<String, Object> selectDcWhouseList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = dcWhouseMapper.selectDcWhouseList(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

}
