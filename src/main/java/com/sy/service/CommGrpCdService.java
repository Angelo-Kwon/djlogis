package com.sy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.configuration.jwt.util.SecurityUtil;
import com.sy.mapper.CommgrpMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommGrpCdService {
	/*
	 * ******************************************** - Service Name : MDMC06Service -
	 * Description : 공통그룹코드 등록 - Made By : SMS - Creation Date : 2023.07. 26
	 * ------------------------------------------
	 * 
	 * ********************************************
	 */

	@Autowired
	private CommgrpMapper commgrpMapper;

	public List<Map<String, Object>> getCommgrpList(Map<String, Object> params) {
		return commgrpMapper.selectCommgrpList(params);
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> saveGrid(Map<String, Object> param) {
		String userId = SecurityUtil.getCurrentUsername().get();// 사용자ID
		List<Map<String, Object>> addList = (List<Map<String, Object>>) param.get("addList");
		List<Map<String, Object>> updateList = (List<Map<String, Object>>) param.get("updateList");
		List<Map<String, Object>> deleteList = (List<Map<String, Object>>) param.get("deleteList");

		for (Map<String, Object> add : addList) {
			// 중복 CHECK
			String cmgrpcd = (String) add.get("CMGRPCD");
			List<Map<String, Object>> dataList = getCommgrp(cmgrpcd);
			if (dataList.size() > 0) {
				Map<String, Object> data = new HashMap<String, Object>();
				data.put("error", cmgrpcd + "는 중복된 공통그룹코드입니다. 확인하시기 바랍니다.");
				return data;
			}

			add.put("userId", userId);
			commgrpMapper.insertCommgrp(add);
		}

		for (Map<String, Object> upd : updateList) {
			upd.put("userId", userId);
			commgrpMapper.updateCommgrp(upd);
		}

		for (Map<String, Object> del : deleteList) {
			del.put("userId", userId);
			commgrpMapper.deleteCommgrp(del);
		}

		return param;
	}

	private List<Map<String, Object>> getCommgrp(String cmgrpcd) {
		HashMap<String, Object> map = new HashMap<>();
		map.put("CMGRPCD", cmgrpcd);

		return commgrpMapper.selectCommgrpList(map);

	}

}
