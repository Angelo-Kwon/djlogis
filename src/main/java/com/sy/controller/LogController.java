package com.sy.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.sy.service.LogService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/sy/log")
public class LogController {

	@Autowired
	private LogService logService;

	/**
	 * @매서드명 : selectLogList
	 * @매서드기능 : 로그 목록 조회
	 * @작성날짜 : 2023.11.06
	 * @param param
	 * @return
	 */
	@PostMapping(value = "/selectLogList")
	@ResponseBody
	public Map<String, Object> selectLogList(@RequestParam Map<String, Object> param) {

		Map<String, Object> data = logService.selectLogList(param);

		return data;
	}

}
