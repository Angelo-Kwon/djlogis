package com.sy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.configuration.jwt.util.SecurityUtil;
import com.sy.mapper.CommcdMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommCdService {
	/*
	 * ******************************************** - Service Name : MDMC07Service -
	 * Description : 공통코드 등록 - Made By : SMS - Creation Date : 2023.07. 26
	 * ------------------------------------------
	 * 
	 * ********************************************
	 */

	@Autowired
	private CommcdMapper commcdMapper;

	public List<Map<String, Object>> getCommcdList(Map<String, Object> params) {
		return commcdMapper.selectCommcdList(params);
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
			String cmcd = (String) add.get("CMCD");
			List<Map<String, Object>> dataList = getCmcd(cmgrpcd, cmcd);
			if (dataList.size() > 0) {
				Map<String, Object> data = new HashMap<String, Object>();
				data.put("error", cmgrpcd + "의 " + cmcd + "는 중복된 공통코드입니다. 확인하시기 바랍니다.");
				return data;
			}

			add.put("userId", userId);
			commcdMapper.insertCommcd(add);
		}

		for (Map<String, Object> upd : updateList) {
			upd.put("userId", userId);
			commcdMapper.updateCommcd(upd);
		}

		for (Map<String, Object> del : deleteList) {
			del.put("userId", userId);
			commcdMapper.deleteCommcd(del);
		}

		return param;
	}

	private List<Map<String, Object>> getCmcd(String cmgrpcd, String cmcd) {
		HashMap<String, Object> map = new HashMap<>();
		map.put("CMGRPCD", cmgrpcd);
		map.put("CMCD_SAME", cmcd);

		return commcdMapper.selectCommcdList(map);

	}

}
