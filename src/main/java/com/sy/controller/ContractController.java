package com.sy.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.configuration.jwt.entity.UserCustom;
import com.sy.service.ContractService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/sy/contract")
public class ContractController {

	private final ContractService contractService;

	/*
	 * 계약등록 - 시스템 목록 조회
	 */
	@RequestMapping(value = "/getSystemList")
	public Map<String, Object> getSystemList(@RequestParam Map<String, Object> param, Model model, HttpSession session, @AuthenticationPrincipal UserCustom user) {
		Map<String, Object> data = contractService.getSystemList(param);
		return data;
	}

	/*
	 * 계약등록 - 업체정보 목록 조회
	 */
	@RequestMapping(value = "/getCustInfoList")
	public Map<String, Object> getCustInfoList(@RequestParam Map<String, Object> param, Model model, HttpSession session, @AuthenticationPrincipal UserCustom user) {
		Map<String, Object> data = contractService.getCustInfoList(param);
		return data;
	}
	
	/*
	 * 계약등록 - 계약기간 시스템 중복 조회
	 */
	@RequestMapping(value = "/getContractTerm")
	public Map<String, Object> getContractTerm(@RequestParam Map<String, Object> param, Model model, HttpSession session, @AuthenticationPrincipal UserCustom user) {
		Map<String, Object> data = contractService.getContractTerm(param);
		return data;
	}

	/*
	 * 계약등록 - 계약 목록 조회
	 */
	@RequestMapping(value = "/getContractList")
	public Map<String, Object> getContractList(@RequestParam Map<String, Object> param, Model model, HttpSession session, @AuthenticationPrincipal UserCustom user) {
		Map<String, Object> data = contractService.getContractList(param);
		return data;
	}

	/*
	 * 계약등록 - 계약ID 중복 검사
	 */
	@RequestMapping(value = "/checkIdDup")
	public Map<String, Object> checkIdDup(@RequestParam Map<String, Object> param, Model model, HttpSession session, @AuthenticationPrincipal UserCustom user) {
		Map<String, Object> data = contractService.checkIdDup(param);
		return data;
	}

	/*
	 * 계약등록 - 계약 저장
	 */
	@RequestMapping(value = "/saveContractList")
	public Map<String, Object> saveContractList(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
		Map<String, Object> data = contractService.saveContractList(param);
		return data;
	}
}
