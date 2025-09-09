package com.common.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.context.MessageSource;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.common.dto.UserVO;
import com.common.service.CommonService;
import com.configuration.jwt.util.SecurityUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/common")
public class CommonController {

	private final CommonService commonService;

	private final MessageSource msg;

	/*
	 * 공통코드 조회
	 */
	@RequestMapping(value = "/getCommCode")
	public Map<String, Object> getCarBasicInfoList(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = commonService.getCommCode(param);
		return data;
	}

	/*
	 * 공통코드 조회
	 */
	@RequestMapping(value = "/getCorpCode")
	public Map<String, Object> getCorBasicInfoList(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = commonService.getCorpCode(param);
		return data;
	}

	/*
	 * 로그인 사용자 정보 조회
	 */
	@RequestMapping(value = "/getUser")
	public Map<String, Object> getUser(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = commonService.getUser(param);
		return data;
	}

	/*
	 * 사용자 Grid Setting & Column Layout 조회
	 */
	@ResponseBody
	@GetMapping(value = "/sy/syu10Select.do")
	public Map<String, Object> syu10Select(@RequestParam Map<String, Object> param, @AuthenticationPrincipal UserVO userInfo) {
		userInfo = new UserVO();//CSH변경
		userInfo.setCompkey("100");//CSH변경:회사코드
		userInfo.setUseract(SecurityUtil.getCurrentUserId().get());//CSH변경:사용자ID
		Map<String, Object> data = new HashMap<String, Object>();//CSH변경
		data.put("gridSettingLayout", commonService.gridSettingLayout(param, userInfo));
		data.put("gridColumnLayout", commonService.gridColumnLayout(param, userInfo));
		return data;
	}

	/*
	 * 사용자 Grid Setting & Column Layout 저장
	 */
	@ResponseBody
	@PostMapping(value = "/sy/syu10Save.do")
	public Map<String, Object> syu10Save(@RequestBody Map<String, Object> param, @AuthenticationPrincipal UserVO userInfo) throws Exception {
		userInfo = new UserVO();//CSH변경
		userInfo.setCompkey("100");//CSH변경:회사코드
		userInfo.setUseract(SecurityUtil.getCurrentUserId().get());//CSH변경:사용자ID
		Map<String, Object> data = commonService.setSYU10Save(param, userInfo);
		return data;
	}

	/*
	 * 사용자 Grid Setting & Column Layout Reset
	 */
	@ResponseBody
	@RequestMapping(value = "/sy/syu10Reset.do", method = RequestMethod.DELETE)
	public Map<String, Object> syu10Reset(@RequestBody Map<String, Object> param, @AuthenticationPrincipal UserVO userInfo) {
		userInfo = new UserVO();//CSH변경:
		userInfo.setCompkey("100");//CSH변경:회사코드
		userInfo.setUseract(SecurityUtil.getCurrentUserId().get());//CSH변경:사용자ID
		Map<String, Object> data = commonService.setSYU10Reset(param, userInfo);
		return data;
	}

}
