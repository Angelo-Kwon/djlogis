package com.rs.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.configuration.jwt.entity.UserCustom;
import com.rs.service.CarService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/car")
public class CarController {

	private final CarService carService;

	/*
	 * 차량 기본정보 - 차량 기본정보 목록 조회
	 */
	@RequestMapping(value = "/getCarBasicInfoList")
	public Map<String, Object> getCarBasicInfoList(@RequestParam Map<String, Object> param, Model model, HttpSession session, @AuthenticationPrincipal UserCustom user) {
		Map<String, Object> data = carService.getCarBasicInfoList(param);
		data.put("userNm", user.getNickname());// 사용자명
		return data;
	}
	/*
	 * 차량 기본정보 - 차량 부가정보 목록 조회
	 */
//	@RequestMapping(value = "/getAdCarList")
//	public Map<String, Object> getAdCarList(@RequestParam Map<String, Object> param) {
//		System.out.println("CarController getAdCarList");
//		return carService.getAdCarList(param);
//	}

	/*
	 * 차량 기본정보 - 차량 기본정보 목록 조회
	 */
	@RequestMapping(value = "/getMdCarList")
	public Map<String, Object> getMdCarList(@RequestParam Map<String, Object> param, @AuthenticationPrincipal UserCustom user) {
		return carService.getMdCarList(param);
	}

	/*
	 * 차량 기본정보 - 차량 기본정보 저장
	 */
	@RequestMapping(value = "/saveCarBasicInfo")
	@ResponseBody
	public Map<String, Object> saveCarBasicInfo(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		System.out.println("CarController saveCarBasicInfo");

		return carService.saveCarBasicInfo(param);
	}

	/*
	 * 차량 부가정보 - 차량 부가정보 저장
	 */
//	@RequestMapping(value = "/saveAdCar")
//	@ResponseBody
//	public Map<String, Object> saveAdCar(@RequestBody Map<String, Object> param) {
//		System.out.println("CarController saveAdCar");
////		Map<String, Object> data = carService.saveAdCar(param);
//		return carService.saveAdCar(param);
//	}
//	/*
//	 * 차량 부가정보 - 차량 부가정보 저장
//	 */
//	@RequestMapping(value = "/saveCarAddInfo")
//	public Map<String, Object> saveCarAddInfo(@RequestParam Map<String, Object> param) {
//		Map<String, Object> data = carService.saveCarAddInfo(param);
//		return data;
//	}

	@RequestMapping(value = "/getShCarList")
	public Map<String, Object> getShCarList(@RequestParam Map<String, Object> param, Model model, HttpSession session, @AuthenticationPrincipal UserCustom user) {
		Map<String, Object> data = carService.getShCarList(param);
		data.put("userNm", user.getNickname());// 사용자명
		return data;
	}

	/*
	 * 차량 공유정보 - 차량 공유정보 저장
	 */
	@RequestMapping(value = "/saveCarShareInfo")
	public Map<String, Object> saveCarShareInfo(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = carService.saveCarShareInfo(param);
		return data;
	}

	/*
	 * 차량 공유정보 - 차량 공유정보 종료 대상 목록 조회
	 */
	@RequestMapping(value = "/getCarShareEndTrgtList")
	public Map<String, Object> getCarShareEndTrgtList(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = carService.getCarShareEndTrgtList(param);
		return data;
	}

	/*
	 * 차량 공유정보 - 차량 공유정보 종료
	 */
	@RequestMapping(value = "/endCarShareInfo")
	public Map<String, Object> endCarShareInfo(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = carService.endCarShareInfo(param);
		return data;
	}

//	/**
//	 * @매서드명 : selectMoCmWhouseList
//	 * @매서드기능 : 모바일 창고 기본정보 목록 조회
//	 * @작성날짜 : 2023.08.29
//	 * @return
//	 */
//	@RequestMapping(value = "/getMoCarBasicInfoList")
//	@ResponseBody
//	public Map<String, Object> getMoCarBasicInfoList(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
//		return carService.getMoCarBasicInfoList(param);
//	}
//
//
//	@RequestMapping(value = "/saveMoCar")
//	@ResponseBody
//	public Map<String, Object> saveMoWhouse(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
//		System.out.println("saveMoWhouse");
//		System.out.println(param);
//		return carService.saveMoCar(param);
//	}
}
