package com.rs.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import com.configuration.jwt.entity.UserCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.rs.service.CarService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/car")
public class CarMobileController {

	@Autowired
	private CarService carService;

	/**
	 * @매서드명 : selectMoCmWhouseList
	 * @매서드기능 : 모바일 창고 기본정보 목록 조회
	 * @작성날짜 : 2023.08.29
	 * @return
	 */
	@RequestMapping(value = "/getMoCarBasicInfoList")
	@ResponseBody
	public Map<String, Object> getMoCarBasicInfoList(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		System.out.println("CarMobileController getMoCarBasicInfoList ");
		return carService.getMoCarBasicInfoList(param);
	}


	@RequestMapping(value = "/saveMoCar")
	@ResponseBody
	public Map<String, Object> saveMoWhouse(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		return carService.saveMoCar(param);
	}

	@RequestMapping(value = "/getMoMdCarList")
	@ResponseBody
	public Map<String, Object> getMoMdCarList(@RequestBody Map<String, Object> param) {
		return carService.getMoMdCarList(param);
	}
}
