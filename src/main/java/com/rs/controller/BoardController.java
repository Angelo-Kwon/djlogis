package com.rs.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.rs.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/board")
public class BoardController {

	@Autowired
	private BoardService boardService;

	/**
	 * @매서드명 : searchShBoard
	 * @매서드기능 : 소통게시판 정보 목록 조회
	 * @작성날짜 : 2023.08.07
	 * @param model
	 * @return
	 */
	@GetMapping(value = "/selectShBoardList")
	@ResponseBody
	public Map<String, Object> selectShBoard(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = boardService.selectShBoardList(param);

		return data;
	}

	/**
	 * @매서드명 : searchShBoardDetail
	 * @매서드기능 : 소통게시판 기본 - 상세정보 조회
	 * @작성날짜 : 2023.08.07
	 * @param model
	 * @return
	 */
	@GetMapping(value = "/selectShBoardDetailInfo/{com_no}")
	@ResponseBody
	public Map<String, Object> searchShBoardDetail(@PathVariable Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = boardService.selectShBoardDetailInfo(param);

		return data;
	}

	/**
	 * @매서드명 : insertShBoardInfo
	 * @매서드기능 : 소통게시판 기본정보 신규 생성
	 * @작성날짜 : 2023.08.07
	 * @param model
	 * @return
	 */
	@PostMapping(value = "/insertShBoardInfo")
	@ResponseBody
	public Map<String, Object> insertShBoardInfo(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = boardService.insertShBoardInfo(param);

		return data;
	}

	/**
	 * @매서드명 : updateShBoardInfo
	 * @매서드기능 : 소통게시판 기본정보 수정
	 * @작성날짜 : 2023.08.07
	 * @param model
	 * @return
	 */
	@PutMapping(value = "/updateShBoardInfo")
	@ResponseBody
	public Map<String, Object> updateShBoardInfo(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {
	
		String type = param.get("type").toString();
		Map<String, Object> data = new HashMap<String, Object>();
		
		if(type.equals("con")){
			data = boardService.updateShConBoardInfo(param);
		} else {
			data = boardService.updateShSupBoardInfo(param);
		}

		return data;
	}
	
	/**
	 * @매서드명 : deleteShBoardInfo
	 * @매서드기능 : 소통게시판 기본정보 삭제
	 * @작성날짜 : 2023.08.07
	 * @param model
	 * @return
	 */
	@DeleteMapping(value = "/deleteShBoardInfo")
	@ResponseBody
	public Map<String, Object> deleteShBoardInfo(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		Map<String, Object> data = boardService.deleteShBoardInfo(param);

		return data;
	}

}
