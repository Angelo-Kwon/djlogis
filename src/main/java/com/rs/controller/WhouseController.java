package com.rs.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.configuration.jwt.entity.UserCustom;
import com.rs.service.WhouseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/whouse")
public class WhouseController {

	@Autowired
	private WhouseService whouseService;

	/**
	 * @매서드명 : searchCmWhouse
	 * @매서드기능 : 창고 기본정보 목록 조회
	 * @작성날짜 : 2023.07.10
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/getWhouseBasicInfoList")
	@ResponseBody
	public Map<String, Object> getWhouseBasicInfoList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session, @AuthenticationPrincipal UserCustom user) {

		Map<String, Object> data = whouseService.getWhouseBasicInfoList(param);
		data.put("userNm", user.getNickname());// 사용자명

		return data;
	}

	/**
	 * @매서드명 : saveCmWhouseInfo
	 * @매서드기능 : 창고 기본정보 신규 생성/수정/삭제 정보 저장
	 * @작성날짜 : 2023.09.10
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/saveWhouseBasicInfo")
	@ResponseBody
	public Map<String, Object> saveWhouseBasicInfo(@RequestBody Map<String, Object> param, Model model,
			HttpSession session) {
		System.out.println("WhouseController saveWhouseBasicInfo");

		return whouseService.saveWhouseBasicInfo(param);
	}

	/**
	 * @매서드명 : getAdWhouseList
	 * @매서드기능 : 창고부가정보 목록조회
	 * @작성날짜 : 2023.12.12
	 * @param model
	 * @return
	 */
//	@RequestMapping(value = "/getAdWhouseList")
//	public Map<String, Object> getAdWhouseList(@RequestParam Map<String, Object> param) {
//		System.out.println("WhouseController getAdWhouseList");

//		return whouseService.getAdWhouseList(param);
//	}
	/**
	 * @매서드명 : searchAdWhouseDetail
	 * @매서드기능 : 창고 기본 - 상세정보 조회
	 * @작성날짜 : 2023.07.10
	 * @param model
	 * @return
	 */
	/*
	 * @RequestMapping(value = "/selectAdWhouseInfoList")
	 * 
	 * @ResponseBody public Map<String, Object> selectAdWhouseInfoList(@RequestParam
	 * Map<String, Object> param, Model model, HttpSession session) {
	 * 
	 * Map<String, Object> data = whouseService.selectAdWhouseInfoList(param);
	 * 
	 * return data; }
	 */
	/**
	 * @매서드명 : saveAdWhouse
	 * @매서드기능 : 창고 부가정보 저장
	 * @작성날짜 : 2023.12.12
	 * @param
	 * @return
	 */
//	@RequestMapping(value = "/saveWhouseAddInfo")
//	@ResponseBody
//	public Map<String, Object> saveWhouseAddInfo(@RequestParam Map<String, Object> param) {
//		Map<String, Object> data = whouseService.saveWhouseAddInfo(param);
//		
//		return data;
//	}

	/**
	 * @매서드명 : selectShWhouseDetailInfo
	 * @매서드기능 : 창고 공유 - 상세정보 조회
	 * @작성날짜 : 2023.07.20
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/selectShWhouseDetailInfo")
	@ResponseBody
	public Map<String, Object> selectShWhouseDetailInfo(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = whouseService.selectShWhouseDetailInfo(param);

		return data;
	}

	/**
	 * @매서드명 : insertShWhouseInfo
	 * @매서드기능 : 창고 공유 - 신규 생성
	 * @작성날짜 : 2023.08.02
	 * @return
	 */
	@RequestMapping(value = "/saveShWhouseDetailInfo")
	@ResponseBody
	public Map<String, Object> saveShWhouseDetailInfo(@RequestBody Map<String, Object> param) {

		return whouseService.saveShWhouseDetailInfo(param);
	}

	/**
	 * @매서드명 : updateShWhouseInfo
	 * @매서드기능 : 창고 공유 - 수정
	 * @작성날짜 : 2023.08.02
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/updateShWhouseInfo")
	@ResponseBody
	public Map<String, Object> updateShWhouseInfo(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = whouseService.updateShWhouseInfo(param);

		return data;
	}

	/**
	 * @매서드명 : deleteShWhouseInfo
	 * @매서드기능 : 창고 공유 - 삭제
	 * @작성날짜 : 2023.08.02
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/deleteShWhouseInfo")
	@ResponseBody
	public Map<String, Object> deleteShWhouseInfo(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = whouseService.deleteShWhouseInfo(param);

		return data;
	}

	/**
	 * @매서드명 : selectShWhouseEndlInfooh
	 * @매서드기능 : 창고 공유 - 상세정보 조회
	 * @작성날짜 : 2023.07.20
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/selectShWhouseEndlInfo")
	@ResponseBody
	public Map<String, Object> selectShWhouseEndlInfo(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = whouseService.selectShWhouseEndlInfo(param);

		return data;
	}

	/**
	 * @매서드명 : updateShEndWhouseInfo
	 * @매서드기능 : 창고 공유 - 수정
	 * @작성날짜 : 2023.08.02
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/updateShEndWhouseInfo")
	@ResponseBody
	public Map<String, Object> updateShEndWhouseInfo(@RequestParam Map<String, Object> param, Model model,HttpSession session) {

		Map<String, Object> data = whouseService.updateShEndWhouseInfo(param);

		return data;
	}

//	@RequestMapping(value = "/selectMoCmWhouseList")
//	@ResponseBody
//	public Map<String, Object> selectMoCmWhouseList(@RequestParam Map<String, Object> param, Model model,HttpSession session) {
//		return whouseService.selectMoCmWhouseList(param);
//	}
//
//	/**
//	 * @매서드명 : selectMoCmWhouseList
//	 * @매서드기능 : 모바일 창고 기본정보 목록 조회
//	 * @작성날짜 : 2023.08.29
//	 * @param model
//	 * @return
//	 */
//	@RequestMapping(value = "/saveMoWhouse")
//	@ResponseBody
//	public Map<String, Object> saveMoWhouse(@RequestBody Map<String, Object> param, Model model,HttpSession session) {
//		System.out.println("");
//		return whouseService.saveMoWhouse(param);
//	}
}
