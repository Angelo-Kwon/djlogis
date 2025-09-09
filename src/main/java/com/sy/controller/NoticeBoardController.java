package com.sy.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.sy.service.NoticeBoardService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/sy/board")
public class NoticeBoardController {

	@Autowired
	private NoticeBoardService noticeBoardService;

	/**
	 * @매서드명 : selectNoticeList
	 * @매서드기능 : 공지사항 목록 조회
	 * @작성날짜 : 2023.10.25
	 * @param param
	 * @return Map<String, Object>
	 */
	@GetMapping(value = "/selectNoticeList")
	@ResponseBody
	public Map<String, Object> selectNoticeList(@RequestParam Map<String, Object> param) {

		Map<String, Object> data = noticeBoardService.selectNoticeList(param);

		return data;
	}
	
	/**
	 * @매서드명 : selectNoticeDetailInfo
	 * @매서드기능 : 공지사항 목록 상세 조회
	 * @작성날짜 : 2023.10.25
	 * @param param
	 * @return Map<String, Object>
	 */
	@PostMapping(value = "/selectNoticeDetailInfo")
	@ResponseBody
	public Map<String, Object> selectNoticeDetailInfo(@RequestParam Map<String, Object> param, Model model) {

		Map<String, Object> data = noticeBoardService.selectNoticeDetailInfo(param);
		
		model.addAttribute("type", "detail");
		return data;
	}

	/**
	 * @매서드명 : insertNoticeBoardInfo
	 * @매서드기능 : 공지사항 신규 생성 및 수정
	 * @작성날짜 : 2023.10.25
	 * @param param
	 * @return Map<String, Object>
	 */
	@PostMapping(value = "/insertNoticeInfo")
	@ResponseBody
	public Map<String, Object> insertNoticeInfo(@RequestParam Map<String, Object> param) {

		Map<String, Object> data = noticeBoardService.insertNoticeInfo(param);
		return data;

	}
	
	/**
	 * @매서드명 : updateNoticeUseYn
	 * @매서드기능 : 공지사항 사용여부 수정
	 * @작성날짜 : 2023.10.25
	 * @param param
	 * @return Map<String, Object>
	 */
	@PostMapping(value = "/updateNoticeUseYn")
	@ResponseBody
	public Map<String, Object> updateNoticeUseYn(@RequestParam Map<String, Object> param
			, HttpSession session){

		Map<String, Object> data = noticeBoardService.updateNoticeUseYn(param);
		return data;

	}
	
	/**
	 * @매서드명 : updateNoticHitCnt
	 * @매서드기능 : 공지사항 조회수 수정
	 * @작성날짜 : 2023.10.25
	 * @param param
	 * @return Map<String, Object>
	 */
	@PutMapping(value = "/updateNoticeHitCnt")
	@ResponseBody
	public Map<String, Object> updateNoticeHitCnt(@RequestParam Map<String, Object> param){

		Map<String, Object> data = noticeBoardService.updateNoticeHitCnt(param);
		
		return data;
	}
	
	@GetMapping(value = "/selectNewsList")
	@ResponseBody
	public Map<String, Object> selectNewsList(@RequestParam Map<String, Object> param) {

		Map<String, Object> data = noticeBoardService.selectNewsList(param);

		return data;
	}

}