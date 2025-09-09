package com.sy.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sy.service.CommGrpCdService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/sy/commgrp")
public class CommGrpCdController {
	@Autowired
	private CommGrpCdService commGrpCdService;

	@RequestMapping(value = "/getMdmc06List")
	@ResponseBody
	public List<Map<String, Object>> mdmc06List(@RequestParam Map<String, Object> param) {
		return commGrpCdService.getCommgrpList(param);
	}

	@RequestMapping(value = "/saveGrid")
	@ResponseBody
	public Map<String, Object> saveGrid(@RequestParam Map<String, Object> param)
			throws JsonMappingException, JsonProcessingException {
		String paramlist = param.get("list").toString();

		// ObjectMapper 생성
		ObjectMapper objectMapper = new ObjectMapper();

		// JSON을 맵으로 변환
		Map<String, Object> parammap = objectMapper.readValue(paramlist, Map.class);

		parammap = commGrpCdService.saveGrid(parammap);
		return parammap;
	}
}
