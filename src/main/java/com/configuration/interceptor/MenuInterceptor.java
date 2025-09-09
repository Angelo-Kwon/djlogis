package com.configuration.interceptor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.sy.service.LogService;
import com.sy.service.MenuService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class MenuInterceptor implements HandlerInterceptor {

	private final MenuService menuService;
	private final LogService logService;

	@Autowired
	public MenuInterceptor(MenuService menuService, LogService logService) {
		this.menuService = menuService;
		this.logService = logService;
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("requestUrl", request.getRequestURI());
		
		Map<String, Object> menuInfo = menuService.getMenuInfo(map);
		System.out.println("postHandle menuInfo : " + menuInfo);
		
		String url = request.getRequestURI();

		if (modelAndView != null) {
			modelAndView.addObject("menuInfo", menuInfo);
			
			
			// 로그 등록
			Map<String, Object> logData = new HashMap<String, Object>();
			logData.put("log_div", "PAGE");
			logData.put("log_info", url);

			Map<String, Object> userLog = logService.insertLog(logData, request);
		}
	}
}
