package com.dc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dc.mapper.DcDashMapper;

@Service
@Transactional
public class DcDashService {

	@Autowired
	private DcDashMapper dcDashMapper;

	public Map<String, Object> selectInTypeList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			String type = param.get("type").toString();
			if ("A".equals(type)) {
				param.put("DOCTYPE", "480"); // 480 반입
			} else if ("B".equals(type)) {
				param.put("DOCTYPE", "490"); // 490 기타입고
			}
			List<Map<String, Object>> typeList = dcDashMapper.selectInTypeList(param);
			List<Map<String, Object>> cntList = dcDashMapper.selectInCountList(param);
			data.put("typeList", typeList);
			data.put("cntList", cntList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public Map<String, Object> selectOutTypeList(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			String type = param.get("type").toString();
			if ("A".equals(type)) {
				param.put("DOCTYPE", "780"); // 780 반출
			} else if ("B".equals(type)) {
				param.put("DOCTYPE", "790"); // 790 기타출고
			}
			List<Map<String, Object>> typeList = dcDashMapper.selectOutTypeList(param);
			List<Map<String, Object>> cntList = dcDashMapper.selectOutCountList(param);
			data.put("typeList", typeList);
			data.put("cntList", cntList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	public List<Map<String, Object>> selectWareList(Map<String, Object> param) {
		return dcDashMapper.selectWareList(param);
	}

	public List<Map<String, Object>> selectOwnerList(Map<String, Object> param) {
		return dcDashMapper.selectOwnerList(param);
	}

}
