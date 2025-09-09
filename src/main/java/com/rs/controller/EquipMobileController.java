package com.rs.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.rs.service.EquipService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/equip")
public class EquipMobileController {

	@Autowired
	private EquipService equipService;

	/**
	 * @매서드명 : selectMoEquipList
	 * @매서드기능 : 모바일 기자재 기본정보 목록 조회
	 * @작성날짜 : 2023.08.29
	 * @return
	 */
	@RequestMapping(value = "/selectMoEquipList")
	@ResponseBody
	public Map<String, Object> selectMoEquipList(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		System.out.println("EquipMobileController selectMoEquipList ");
		return equipService.selectMoEquipList(param);
	}

	@RequestMapping(value = "/saveMoEquip")
	@ResponseBody
	public Map<String, Object> saveMoEquip(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		return equipService.saveMoEquip(param);
	}
}
