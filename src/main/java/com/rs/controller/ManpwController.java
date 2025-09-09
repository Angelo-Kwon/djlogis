package com.rs.controller;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.configuration.jwt.entity.UserCustom;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.rs.service.ManpwService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpSession;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/manpw")
public class ManpwController {

	private final ManpwService manpwService;

	/*
	 * 인력 기본정보 - 인력 기본정보 목록 조회
	 */
	@RequestMapping(value = "/getManpwBasicInfoList")
	public Map<String, Object> getManpwBasicInfoList(@RequestParam Map<String, Object> param, Model model, HttpSession session, @AuthenticationPrincipal UserCustom user) {
		Map<String, Object> data = manpwService.getManpwBasicInfoList(param);
		data.put("userNm", user.getNickname());// 사용자명
		return data;
	}
	
	/*
	 * 인력 기본정보 - 인력 기본정보 저장
	 */
	@RequestMapping(value = "/saveManpwBasicInfo")
	@ResponseBody
	public Map<String, Object> saveManpwBasicInfo(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		System.out.println("ManpwController saveManpwBasicInfo");

		return manpwService.saveManpwBasicInfo(param);
	}
	
	/*
	 * @RequestMapping(value = "/createAd") public Map<String, Object>
	 * createAd(@RequestParam Map<String, Object> param, Model model) { Map<String,
	 * Object> data = manpwService.createAd(param); return data; }
	 * 
	 * @RequestMapping(value = "/updateAd") public Map<String, Object>
	 * updateAd(@RequestParam Map<String, Object> param, Model model) { Map<String,
	 * Object> data = manpwService.updateAd(param); return data; }
	 * 
	 * @RequestMapping(value = "/deleteAd") public Map<String, Object>
	 * deleteAd(@RequestParam Map<String, Object> param, Model model) { Map<String,
	 * Object> data = manpwService.deleteAd(param); return data; }
	 */

	@RequestMapping(value = "/getSh")
	public Map<String, Object> getSh(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = manpwService.getSh(param);
		return data;
	}

	@RequestMapping(value = "/saveSh")
	public Map<String, Object> saveSh(@RequestParam Map<String, Object> param, Model model) throws JsonMappingException, JsonProcessingException {
		Map<String, Object> data = manpwService.saveSh(param);
		return data;
	}
	
	/*
	 * @RequestMapping(value = "/createSh") public Map<String, Object>
	 * createSh(@RequestParam Map<String, Object> param, Model model) { Map<String,
	 * Object> data = manpwService.createSh(param); return data; }
	 * 
	 * @RequestMapping(value = "/updateSh") public Map<String, Object>
	 * updateSh(@RequestParam Map<String, Object> param, Model model) { Map<String,
	 * Object> data = manpwService.updateSh(param); return data; }
	 * 
	 * @RequestMapping(value = "/deleteSh") public Map<String, Object>
	 * deleteSh(@RequestParam Map<String, Object> param, Model model) { Map<String,
	 * Object> data = manpwService.deleteSh(param); return data; }
	 */

	@RequestMapping(value = "/endSh")
	public Map<String, Object> endSh(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = manpwService.endSh(param);
		return data;
	}

	@RequestMapping(value = "/getWrkCd")
	public Map<String, Object> getWrkCd(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = manpwService.getWrkCd(param);
		return data;
	}

	@RequestMapping(value = "/getManpwNo")
	public Map<String, Object> getManpwNo(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = manpwService.getManpwNo(param);
		return data;
	}

	@RequestMapping(value = "/getCpCd")
	public Map<String, Object> getCpCd(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = manpwService.getCpCd(param);
		return data;
	}

	@RequestMapping(value = "/getBrNo")
	public Map<String, Object> getBrNo(@RequestParam Map<String, Object> param, Model model) {
		Map<String, Object> data = manpwService.getBrNo(param);
		return data;
	}
}
