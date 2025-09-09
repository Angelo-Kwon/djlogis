package com.common.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.common.dto.GridColumnLayoutDTO;
import com.common.dto.GridSettingLayoutDTO;
import com.common.dto.UserVO;
import com.common.mapper.CommonMapper;
import com.configuration.jwt.util.SecurityUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class CommonService {

	private final CommonMapper commonMapper;

	/*
	 * 공통코드 조회
	 */
	public Map<String, Object> getCommCode(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = commonMapper.getCommCode(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.toString());
			e.getMessage();
		}
		return data;
	}

	/*
	 * 공통코드 조회
	 */
	public Map<String, Object> getCorpCode(Map<String, Object> param) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> dataList = commonMapper.getCorpCode(param);
			data.put("dataList", dataList);
		} catch (Exception e) {
			data.put("error", "서비스오류 : " + e.toString());
			e.getMessage();
		}
		return data;
	}

	/*
	 * 로그인 사용자 조회
	 */
	public Map<String, Object> getUser(Map<String, Object> param) {
		param.put("loginId", SecurityUtil.getCurrentUsername().get());
		return commonMapper.getUser(param);
	}

	/*
	 * 레이아웃 세팅
	 */
	public List<GridSettingLayoutDTO> gridSettingLayout(Map<String, Object> params, UserVO userVo) {
		params.put("userData", userVo);
		return commonMapper.selectGridSettingLayout(params);
	}

	/*
	 * 레이아웃 조회
	 */
	public List<GridColumnLayoutDTO> gridColumnLayout(Map<String, Object> params, UserVO userVo) {
		params.put("userData", userVo);
		return commonMapper.selectGridColumnLayout(params);
	}

	/*
	 * 사용자 Grid Setting & Column Layout 저장
	 */
	@SuppressWarnings("unchecked")
	@Transactional(rollbackFor = { Exception.class })
	public Map<String, Object> setSYU10Save(Map<String, Object> params, UserVO userVo) throws Exception {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			ArrayList dataList = (ArrayList) params.get("data");
			List<GridColumnLayoutDTO> list = new ArrayList<>();

			for (int i = 0; i < dataList.size(); i++) {
				GridColumnLayoutDTO gcl = new GridColumnLayoutDTO();
				LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) dataList.get(i);
				gcl.setDataidx(String.valueOf(map.get("dataIndx")));
				gcl.setPhidden((Boolean) map.get("hidden"));
				gcl.setPqalign(String.valueOf(map.get("align")));
				gcl.setDatatyp(String.valueOf(map.get("dataType")));
				if (map.containsKey("width")) {
					gcl.setPqwidth((int) map.get("width"));
				}
				list.add(gcl);
			}

			IntStream.range(0, list.size()).forEach(i -> list.get(i).setSortnum(i));

			HashMap<String, Object> map = new HashMap<>();
			map.put("userData", userVo);
			map.put("progrid", params.get("progrid"));
			map.put("pgridid", params.get("pgridid"));
			map.put("list", list);
			if (commonMapper.mergeColumnLayout(map) == 0) {
				throw new Exception("저장 실패하였습니다.");
			}

			GridSettingLayoutDTO dto = new GridSettingLayoutDTO();
			dto.setCompkey(userVo.getCompkey());
			dto.setUseract(userVo.getUseract());
			dto.setProgrid((String) params.get("progrid"));
			dto.setPgridid((String) params.get("pgridid"));
			dto.setNubrcel((Boolean) params.get("nubrcel"));
			dto.setHovermd((String) params.get("hovermd"));
			dto.setFrezcol((int) params.get("frezcol"));
			dto.setFrezrow((int) params.get("frezrow"));
			dto.setColbodr((Boolean) params.get("colbodr"));
			dto.setRowbodr((Boolean) params.get("rowbodr"));
			dto.setStrprow((Boolean) params.get("strprow"));
			//dto.setGheight((int) params.get("gheight"));//CSH변경

			if (commonMapper.mergeSettingLayout(dto) == 0) {
				throw new Exception("저장 실패하였습니다.");
			}
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}

	@Transactional(rollbackFor = { Exception.class })
	public Map<String, Object> setSYU10Reset(Map<String, Object> params, UserVO userVo) {
		Map<String, Object> data = new HashMap<String, Object>();
		try {
			HashMap<String, Object> map = new HashMap<>();
			map.put("userData", userVo);
			map.put("progrid", params.get("progrid"));
			map.put("pgridid", params.get("pgridid"));

			commonMapper.deleteColumnLayout(map);
			commonMapper.deleteSettingLayout(map);
		} catch (Exception e) {
			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			data.put("error", "서비스오류 : " + e.getMessage());
			e.printStackTrace();
		}
		return data;
	}
}