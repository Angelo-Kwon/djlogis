package com.sy.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.sy.service.RoleService;
import com.sy.service.UserManageService;

import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/sy/user")
public class UserManageController {

	@Autowired
	private UserManageService userManageService;
	
	@Autowired
	private RoleService roleService;
	
	/**
	 * @매서드명 : selectUserInfoList
	 * @매서드기능 : 사용자등록(유료) 목록 조회
	 * @작성날짜 : 2023.08.10
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/selectUserInfoList")
	@ResponseBody
	public Map<String, Object> selectUserInfoList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = userManageService.selectUserInfoList(param);

		return data;
	}

	/**
	 * @매서드명 : selectRoleList
	 * @매서드기능 : 사용자등록(유로) 권한정보(grid 및 조회조건) 조회
	 * @작성날짜 : 2023.08.13
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/selectRoleList")
	@ResponseBody
	public Map<String, Object> selectRoleList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = roleService.getRoleList(param);

		return data;
	}

	/**
	 * @매서드명 : selectGridInfoList
	 * @매서드기능 : 사용자등록(유로) 사용여부, 사용자유형(grid select) 조회
	 * @작성날짜 : 2023.08.13
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/selectGridInfoList")
	@ResponseBody
	public Map<String, Object> selectGridInfoList(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = userManageService.selectGridInfoList(param);

		return data;
	}

	/**
	 * @매서드명 : insertUserInfo
	 * @매서드기능 : 사용자등록(유로) 사용자 정보 변경
	 * @작성날짜 : 2023.08.13
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/insertUserInfo")
	@ResponseBody
	public Map<String, Object> insertUserInfo(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = userManageService.insertUserInfo(param);

		return data;
	}

	/**
	 * @매서드명 : updateUserInfo
	 * @매서드기능 : 사용자등록(유료) 정보 수정 - 패스워드 초기화
	 * @작성날짜 : 2023.08.13
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/updateUserPassReset")
	@ResponseBody
	public Map<String, Object> updateUserPassReset(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = userManageService.updateUserPassReset(param);

		return data;
	}

	/**
	 * @매서드명 : saveUserInfo
	 * @매서드기능 : 사용자등록(유로) 변경된 정보(수정, 삭제) 저장.
	 * @작성날짜 : 2023.08.13
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/saveUserInfo")
	public Map<String, Object> saveUserInfo(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = userManageService.saveUserInfo(param);

		return data;
	}

}
