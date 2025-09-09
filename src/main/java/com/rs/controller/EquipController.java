package com.rs.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rs.service.EquipService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/equip")
public class EquipController {

	private final EquipService equipService;

	/**
	 * 기자재조회
	 */
	@RequestMapping(value = "/getCmEquipList")
	public List<Map<String, Object>> searchEquipList(@RequestBody Map<String, Object> param, Model model,
													 HttpSession session) {
		List<Map<String, Object>> result = new ArrayList<>();
		result = equipService.getEquipList(param);
		return result;
	}

	/**
	 * 기자재 부가정보 조회
	 */
	@RequestMapping(value = "/getAdEquipList")
	public List<Map<String, Object>> searchAdEquipList(@RequestBody Map<String, Object> param) {

		return equipService.getAdEquipList(param);
	}

	/**
	 * 기자재조회
	 */
	@RequestMapping(value = "/getShEquipList")
	public List<Map<String, Object>> searchShEquipList(@RequestBody Map<String, Object> param) {

		return equipService.getShEquipList(param);
	}

	/**
	 * 기자재조회
	 */
	@RequestMapping(value = "/selectShEndEquipInfo")
	public List<Map<String, Object>> searchShEndEquipList(@RequestBody Map<String, Object> param, Model model,
														  HttpSession session) {
		List<Map<String, Object>> result = new ArrayList<>();
		result = equipService.selectShEndEquipInfo(param);
		return result;
	}

	/**
	 * 기자재 추가
	 */
	@RequestMapping(value = "/insertCmEquip")
	@ResponseBody
	public Map<String, Object> insertEquip(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();

		Map<String, Object> re = equipService.setEquipBasicInfo(param);

		if ((int) re.get("processCnt") > 0) {
			result.put("result", "S");
			result.put("errorCode", "200");
		}

		return result;
	}

	/**
	 * 기자재 추가
	 */
	@RequestMapping(value = "/saveCmEquip")
	@ResponseBody
	public Map<String, Object> saveCmEquip(@RequestBody Map<String, Object> param) {
		System.out.println("EquipController saveCmEquip");

		return equipService.saveCmEquip(param);
	}

	/**
	 * 기자재 부가정보 저장
	 */
	@RequestMapping(value = "/saveAdEquip")
	@ResponseBody
	public Map<String, Object> saveAdEquip(@RequestBody Map<String, Object> param) {
		System.out.println("EquipController saveAdEquip");

		return equipService.saveAdEquip(param);
	}

	/**
	 * 기자재 추가
	 */
	@RequestMapping(value = "/insertCmEquipTotal")
	@ResponseBody
	@Transactional
	public Map<String, Object> insertCmEquipTotal(@RequestBody Map<String, List<Map<String, Object>>> param,
												  Model model, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();


		List<Map<String, Object>> addList = param.get("addList");
		List<Map<String, Object>> deleteList = param.get("deleteList");
		List<Map<String, Object>> updateList = param.get("updateList");

		for (Map<String, Object> add : addList) {
			equipService.setEquipBasicInfo(add);
		}

		for (Map<String, Object> delete : deleteList) {
			equipService.delEquipBasicInfo(delete);
		}

		for (Map<String, Object> update : updateList) {
			equipService.upEquipBasicInfo(update);
		}

		result.put("result", "S");
		result.put("errorCode", "200");

		return result;
	}

	/**
	 * 기자재 추가
	 */
	@RequestMapping(value = "/insertAdEquipTotal")
	@ResponseBody
	@Transactional
	public Map<String, Object> insertAdEquipTotal(@RequestBody Map<String, List<Map<String, Object>>> param,
												  Model model, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();

		List<Map<String, Object>> addList = param.get("addList");
		List<Map<String, Object>> updateList = param.get("updateList");

		for (Map<String, Object> update : updateList) {

			if ("UPDATE".equals(update.get("action"))) {
				equipService.upAdEquipBasicInfo(update);
			} else {
				equipService.setAdEquipBasicInfo(update);

			}
		}

		result.put("result", "S");
		result.put("errorCode", "200");

		return result;
	}

	/**
	 * 기자재 추가
	 */
	@RequestMapping(value = "/insertShEquipTotal")
	@ResponseBody
	@Transactional
	public Map<String, Object> insertShEquipTotal(@RequestBody Map<String, List<Map<String, Object>>> param, Model model, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();
		System.out.println("EquipController insertShEquipTotal() ");
		List<Map<String, Object>> addList = param.get("addList");
		List<Map<String, Object>> updateList = param.get("updateList");

		for (Map<String, Object> update : updateList) {

			if ("UPDATE".equals(update.get("action"))) {
				equipService.upShEquipBasicInfo(update);
			} else {
				equipService.setShEquipBasicInfo(update);

			}
		}

		result.put("result", "S");
		result.put("errorCode", "200");

		return result;
	}
	/**
	 * 기자재 추가
	 */
	@RequestMapping(value = "/saveShEquip")
	@ResponseBody
	public Map<String, Object> saveShEquip(@RequestParam Map<String, Object> param) throws JsonProcessingException {
		System.out.println("EquipController saveShEquip");

		return equipService.saveShEquip(param);
	}

	/**
	 * 기자재 추가
	 */
	@RequestMapping(value = "/insertShEquip")
	@ResponseBody
	public Map<String, Object> insertShEquip(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();

		Map<String, Object> re = equipService.setShEquipBasicInfo(param);

		if ((int) re.get("processCnt") > 0) {
			result.put("result", "S");
			result.put("errorCode", "200");
		}

		return result;
	}

	/**
	 * 기자재 수정
	 */
	@RequestMapping(value = "/updateCmEquip")
	@ResponseBody
	public Map<String, Object> updateCmEquip(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();

		Map<String, Object> re = equipService.upEquipBasicInfo(param);
		if ((int) re.get("processCnt") > 0) {
			result.put("result", "S");
			result.put("errorCode", "200");
		}

		return result;
	}

	/**
	 * 기자재 수정
	 */
	@RequestMapping(value = "/updateShEquip")
	@ResponseBody
	public Map<String, Object> updateShEquip(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();

		Map<String, Object> re = equipService.upShEquipBasicInfo(param);
		if ((int) re.get("processCnt") > 0) {
			result.put("result", "S");
			result.put("errorCode", "200");
		}

		return result;
	}

	/**
	 * 기자재 삭제
	 */
	@RequestMapping(value = "/deleteCmEquip")
	@ResponseBody
	public Map<String, Object> deleteEquip(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();
		Map<String, Object> re = equipService.delEquipBasicInfo(param);
		if ((int) re.get("processCnt") > 0) {
			result.put("result", "S");
			result.put("errorCode", "200");
		}

		return result;
	}

	/**
	 * 기자재 삭제
	 */
	@RequestMapping(value = "/deleteShEndEquip")
	@ResponseBody
	public Map<String, Object> deleteShEndEquip(@RequestBody List<Map<String, Object>> param, Model model,
												HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();
		Map<String, Object> re = equipService.delShEndEquipBasicInfo(param);
		if ((int) re.get("processCnt") > 0) {
			result.put("result", "S");
			result.put("errorCode", "200");
		}

		return result;
	}

	/**
	 * 기자재 삭제
	 */
	@RequestMapping(value = "/deleteShEquip")
	@ResponseBody
	public Map<String, Object> deleteShEquip(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();
		Map<String, Object> re = equipService.delEquipShBasicInfo(param);
		if ((int) re.get("processCnt") > 0) {
			result.put("result", "S");
			result.put("errorCode", "200");
		}

		return result;
	}

	@Transactional
	@RequestMapping(value = "/insertAdEquip")
	public Map<String, Object> insertAdEquip(@RequestParam("file") MultipartFile file,
											 @RequestParam("equipNo") String equipNo, @RequestParam("equipCd") String equipCd) {
		// 파일 저장 디렉토리
		Map<String, Object> dataMap = new HashMap<>();
		Map<String, Object> result = new HashMap<>();

		try {
			byte[] fileBytes = file.getBytes();
			// String encodedString = Base64.getEncoder().encodeToString(fileBytes);
			dataMap.put("fileData", fileBytes);
			dataMap.put("equipId", equipNo);
			dataMap.put("equipCd", equipCd);
			result = equipService.setAdEquipBasicInfo(dataMap);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.put("errorCode", e);
			return result;
		}

		// 작업 성공 메시지 반환
		return result;

	}

	@Transactional
	@RequestMapping(value = "/updateAdEquip")
	public Map<String, Object> updateAmEquip(@RequestParam("file") MultipartFile file,
											 @RequestParam("equipNo") String equipNo, @RequestParam("equipCd") String equipCd) {
		// 파일 저장 디렉토리
		Map<String, Object> dataMap = new HashMap<>();
		Map<String, Object> result = new HashMap<>();

		try {
			byte[] fileBytes = file.getBytes();
			// String encodedString = Base64.getEncoder().encodeToString(fileBytes);
			dataMap.put("fileData", fileBytes);
			dataMap.put("equipId", equipNo);
			dataMap.put("equipCd", equipCd);
			result = equipService.upAdEquipBasicInfo(dataMap);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.put("errorCode", e);
			return result;
		}

		// 작업 성공 메시지 반환
		return result;
	}

	/**
	 * 기자재조회
	 */
	@RequestMapping(value = "/selectAdEquip")
	@ResponseBody
	public Map<String, Object> searchAdEquip(@RequestBody Map<String, Object> param) {
		System.out.println("EquipController searchAdEquip()");
		Map<String, Object> result = equipService.selectAdEquip(param);

		if(result == null){
			result = new HashMap<>();
		}

		return result;
	}

//	@RequestMapping(value = "/selectAdEquip")
//	@ResponseBody
//	public Map<String, Object> searchAdEquip(@RequestParam("equipId") String equipId, Model model, HttpSession session) {
//		System.out.println("EquipController searchAdEquip");
//		Map<String, Object> dataMap = new HashMap<>();
//		dataMap.put("equipId", equipId);
//		Map<String, Object> result = equipService.selectAdEquip(dataMap);
//		if (result == null) {
//			dataMap.put("sCode", "no");
//			return dataMap;
//		}
//
//		return result;
//	}

	/**
	 * 기자재조회
	 */
	@RequestMapping(value = "/selectShEquip")
	@ResponseBody
	public Map<String, Object> searchShEquip(@RequestParam("equipNo") String equipNo, Model model, HttpSession session) {
		Map<String, Object> dataMap = new HashMap<>();
		dataMap.put("equipNo", equipNo);
		Map<String, Object> result = equipService.selectShEquip(dataMap);
		if (result == null) {
			dataMap.put("SH_LK_CLS", "");
			dataMap.put("SH_LT_DT", "");
			dataMap.put("SH_NO", "");
			dataMap.put("SH_PRC", "");
			dataMap.put("SH_SQU ", "");
			dataMap.put("SH_USE_YN ", "");
			dataMap.put("USE_YN ", "");
			dataMap.put("SH_PRC ", "");
			dataMap.put("SH_PRD ", "");
			dataMap.put("SH_PRD_CLS", "");
			dataMap.put("SH_QTY", "");
			return dataMap;
		}

		return result;
	}

//	@RequestMapping(value = "/selectMoEquipList")
//	@ResponseBody
//	public Map<String, Object> selectMoEquipList(@RequestParam Map<String, Object> param, Model model, HttpSession session) {
//		return equipService.selectMoEquipList(param);
//	}
//
//	@RequestMapping(value = "/saveMoEquip")
//	@ResponseBody
//	public Map<String, Object> saveMoEquip(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
//		return equipService.saveMoEquip(param);
//	}
}
