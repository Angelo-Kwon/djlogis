package com.common.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.common.util.SseEmitters;

import lombok.extern.slf4j.Slf4j;



@RestController  
@Slf4j  
@RequestMapping(value = "/sse")
public class SseController {  
	
	@Autowired
    private SseEmitters sseEmitters;  

	/*
	 * 사용자 권한 체크
	 */
    @GetMapping(value = "/role/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)  
    public SseEmitter role(@PathVariable String id, @RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId) {  
    	return sseEmitters.subscribe("role", id, lastEventId);
    }
}