package com.rs.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.rs.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/rs/board")
public class BoardMobileController {

	@Autowired
	private BoardService boardService;

	/**
	 * @매서드명 : searchMoShBoard
	 * @매서드기능 : 소통게시판 정보 목록 조회
	 * @작성날짜 : 2023.08.07
	 * @param model
	 * @return
	 */
	@PostMapping(value = "/selectMoShBoardList")
	@ResponseBody
	public Map<String, Object> selectMoShBoard(@RequestParam Map<String, Object> param, Model model,
			HttpSession session) {

		return boardService.selectMoShBoardList(param);
	}

	/*
	 * 모바일 소통내역등록
	 */
	@RequestMapping(value = "/saveMoShBoard")
	@ResponseBody
	public Map<String, Object> saveMoBoardReqMark(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		System.out.println("BoardMobileController saveMoBoardReqMark");
		return boardService.saveMoShBoard(param);
	}
	/*
	 * 모바일 소통내역답변
	 */
	@RequestMapping(value = "/saveMoShBoardResMark")
	@ResponseBody
	public Map<String, Object> saveMoShBoardResMark(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
		return boardService.saveMoShBoardResMark(param);
	}
}
