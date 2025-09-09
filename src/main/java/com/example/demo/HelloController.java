package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
public class HelloController {

	/**
	 * @매서드명 : index
	 * @매서드기능 :
	 * @작성날짜 : 2023.06.30
	 * @param model
	 * @return
	 */
	@RequestMapping(value = { "/hello" }, method = RequestMethod.GET)
	public String index(HttpServletRequest request, Model model, HttpSession session) {
		String path = "index";
		model.addAttribute("data", " Hello Sakura Co. World - INDEX ");

		return path;
	}
}
