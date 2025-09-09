package com.sy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.configuration.jwt.util.SecurityUtil;
import com.sy.mapper.AtctMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AtctService {
	/*
	 * ******************************************** - Service Name : MDMC09Service -
	 * Description : 어카운트업체 등록 - Made By : SMS - Creation Date : 2023.07. 26
	 * ------------------------------------------
	 * 
	 * ********************************************
	 */

	@Autowired
	private AtctMapper atctMapper;

	public List<Map<String, Object>> getAtctList(Map<String, Object> params) {
		return atctMapper.selectAtctList(params);
	}

	public Map<String, Object> getAtctActList(Map<String, Object> params) {
		Map<String, Object> data = new HashMap<String, Object>();
		List<Map<String, Object>> dataList = atctMapper.selectAtctActList(params);
		data.put("dataList", dataList);
		// String actcd = SecurityUtil.getCurrentAccountId().get();// 소속 어카운트코드
		// data.put("userActid", actcd);
		data.put("userActid", "C123456");
		return data;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> saveGrid(Map<String, Object> param) {
		String userId = SecurityUtil.getCurrentUsername().get();// 사용자ID
		/*
		 * List<Map<String, Object>> addList = (List<Map<String, Object>>)
		 * param.get("addList"); List<Map<String, Object>> updateList =
		 * (List<Map<String, Object>>) param.get("updateList");
		 */
		List<Map<String, Object>> list = (List<Map<String, Object>>) param.get("list");
		List<Map<String, Object>> deleteList = (List<Map<String, Object>>) param.get("deleteList");

		
		/*
		 * for (Map<String, Object> add : addList) { add.put("USERID", userId);
		 * atctMapper.insertAtct(add); }
		 * 
		 * for (Map<String, Object> upd : updateList) { upd.put("userId", userId);
		 * atctMapper.updateAtct(upd); }
		 */

		if(list != null && list.size() > 0) {
			for (Map<String, Object> map : list) {
				map.put("USERID", userId);
				atctMapper.insertAtct(map);
			}
		}
		
		if(deleteList != null && deleteList.size() > 0) {
			for (Map<String, Object> del : deleteList) {
				System.out.println(del);
				atctMapper.deleteAtct(del);
			}
		}
		
		return param;
	}

	public List<Map<String, Object>> getCustList(Map<String, Object> params) {
		return atctMapper.selectCustList(params);
	}

}
