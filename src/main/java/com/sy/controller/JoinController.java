package com.sy.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.common.dto.MemberVO;
import com.common.dto.UserVO;
import com.configuration.jwt.entity.User;
import com.sy.mapper.JoinMapper;
import com.sy.service.JoinService;
import com.sy.util.ValidationUtil;

import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/sy/join")
public class JoinController {

   private final JoinService joinService;
   private final JoinMapper joinMapper;

   @RequestMapping(value = "/checkId")
   @ResponseBody
   public Map<String, Object> checkId(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
      Map<String, Object> result = new HashMap<>();
      int checkId = joinService.checkUserId(param);

      if (checkId == 0) {
         result.put("code", "S");
      } else {
         result.put("code", "E");
      }

      return result;
   }

   @RequestMapping(value = "/signup")
   @ResponseBody
   public Map<String, Object> registerUser(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
      Map<String, Object> result = new HashMap<>();
      Map<String, String> keyToName = new HashMap<>();
      keyToName.put("loginId", "아이디");
      keyToName.put("loginPwd", "패스워드");
      keyToName.put("userNm", "이름");
      keyToName.put("userPhone", "연락처");

      // 필수문자 유효성체크
      List<String> requiredKeys = Arrays.asList("loginId", "loginPwd", "userNm","userPhone");
      for (String key : requiredKeys) {
         if (param.get(key) == null || param.get(key).toString().isEmpty()) {
            result.put("code", "E");
            result.put("msg", keyToName.get(key) + "는 필수 항목입니다.");
            return result;
         }
      }
      // 아이디 유효성체크
      if (!ValidationUtil.isValidId(param.get("loginId").toString())) {
         result.put("code", "E");
         result.put("msg", "아이디는 영문자+숫자 아니면 영문자만 6~15자리 이내로 입력해주세요.");
         return result;
      }
      // 패스워드 유효성체크
      if (!ValidationUtil.isValidPassword(param.get("loginPwd").toString())) {
         result.put("code", "E");
         result.put("msg", "비밀번호는 특수문자를 포함한 영문+숫자로 8-20자리 이내로 입력해주세요.");
         return result;
      }
      //회원가입
      int sign = joinService.userInsert(param);
      result.put("code", "S");
      result.put("msg", "회원가입이 완료되었습니다.");
      return result;
   }
   
   @RequestMapping(value = "/getUserInfo")
   @ResponseBody
   public Map<String, Object> findUserInfo(@RequestBody Map<String, Object> param , Model model, HttpSession session) {
      Map<String, Object> result =joinService.getUserInfo(param);                        
      return result;
   }
   
   
   @RequestMapping(value = "/modUser")
   @ResponseBody
   public Map<String, Object> modUser(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
      Map<String, Object> result = new HashMap<>();
      Map<String, String> keyToName = new HashMap<>();
      keyToName.put("loginId", "아이디");
      keyToName.put("loginPwd", "패스워드");
      keyToName.put("userNm", "이름");
      keyToName.put("userPhone", "연락처");

      // 필수문자 유효성체크
      List<String> requiredKeys = Arrays.asList("loginId", "loginPwd", "userNm","userPhone");
      for (String key : requiredKeys) {
         if (param.get(key) == null || param.get(key).toString().isEmpty()) {
            result.put("code", "E");
            result.put("msg", keyToName.get(key) + "는 필수 항목입니다.");
            return result;
         }
      }
      // 패스워드 유효성체크
      if (!ValidationUtil.isValidPassword(param.get("loginPwd").toString())) {
         result.put("code", "E");
         result.put("msg", "비밀번호는 특수문자를 포함한 영문+숫자로 8-20자리 이내로 입력해주세요.");
         return result;
      }
      //회원정보수정
      int mod = joinService.userModify(param);
      result.put("code", "S");
      result.put("msg", "회원수정이 완료되었습니다.");
      return result;
   }
   

   @RequestMapping(value = "/resetPw")
   @ResponseBody
   public Map<String, Object> resetPw(@RequestBody Map<String, Object> param, Model model, HttpSession session) {
      Map<String, Object> result = new HashMap<>();      
      
      //초기화비밀번호
      String resetPw= param.get("loginId").toString()+"1234!@";
      param.put("loginPwd", resetPw);
      int mod = joinService.resetPassword(param);
      result.put("code", "S");
      result.put("msg", "비밀번호가 초기화되었습니다.");
      return result;
   }

   @PostMapping("/withdraw")
    @ResponseBody
   public String withdraw(@RequestBody MemberVO member) {
        boolean success = joinService.withdrawMember(member);
        if (success) {
            return "true";
        } else {
            return "false";
        }
    }

}