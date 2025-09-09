package com.common.util;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.extern.slf4j.Slf4j;

@Component  
@Slf4j
@SuppressWarnings("unused")
public class SseEmitters {  
	private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;
	private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
	private final Map<String, Object> cache = new ConcurrentHashMap<>();
	
	/* 
	 * connect sever 
	 */
    public SseEmitter subscribe(String name, String id, String lastEventId) {
    	SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
    	String nmId = name + "_" + id;
    	String emtId = nmId + "_" + System.currentTimeMillis();
    	
    	emitters.put(emtId, emitter);
        
        emitter.onCompletion(() -> {  
            emitters.remove(emtId);
        });
        
        emitter.onTimeout(() -> {  
        	emitters.remove(emtId);
        });
        
        emitter.onError((e) -> {  
            emitters.remove(emtId);
        });
        
        // 더미데이터 전송(503 에러 방지)
        sendToClient(emitter, name, emtId, "subscribed"); 
        
        // 유실데이터 전송
        if (!lastEventId.isEmpty()) { 
            Map<String, Object> loss = getCache(nmId);
            loss.entrySet().stream()
            	.filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
	            .forEach(entry -> sendToClient(emitter, name, entry.getKey(), entry.getValue()));
        }
  
        return emitter;  
    }
    
    /* 
	 * send data to front end 
	 */
    private void sendToClient(SseEmitter emitter, String name, String id, Object data) {
        try {
            emitter.send(SseEmitter.event()
            	   .name(name)
                   .id(id)
                   .data(data, MediaType.APPLICATION_JSON));
        } catch (IOException exception) {
        	emitters.remove(id);
            emitter.completeWithError(exception);
        }
    }
	
    /* 
	 * call SSE 
	 */
    public void send(String name, String id, Object data) {
    	String nmId = name + "_" + id ;
        
        Map<String, SseEmitter> sseEmitters = getEmitters(nmId);
        sseEmitters.forEach(
        		(key, emitter) -> {
        			cache.put(key, data);
                    sendToClient(emitter, name, key, data);
                }
        );
    }
    
    public Map<String, SseEmitter> getEmitters(String nmId) {
        return emitters.entrySet().stream()
        			   .filter(entry -> entry.getKey().startsWith(nmId))
        			   .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
    
    public Map<String, Object> getCache(String nmId) {
        return cache.entrySet().stream()
        			.filter(entry -> entry.getKey().startsWith(nmId))
        			.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}