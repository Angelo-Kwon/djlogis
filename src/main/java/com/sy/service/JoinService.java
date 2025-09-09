package com.sy.service;

import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.common.dto.MemberVO;
import com.common.dto.UserVO;
import com.configuration.util.CrypoUtil;
import com.sy.mapper.JoinMapper;
import com.sy.mapper.MenuMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JoinService {

   private final JoinMapper joinMapper;

   private final PasswordEncoder passwordEncoder;

   public int checkUserId(Map<String, Object> param) {
      return joinMapper.checkUserId(param);
   }

   @Transactional
   public int userInsert(Map<String, Object> param) {
      try {
         // 데이터 암호화
         String encodePw = passwordEncoder.encode(param.get("loginPwd").toString());
         param.put("loginPwd", encodePw);
         String encodePhone = CrypoUtil.encrypto(param.get("userPhone").toString());
         param.put("userPhone", encodePhone);
         if (StringUtils.isNotBlank((String) param.get("userEmail"))) {
            String encodeEmail = CrypoUtil.encrypto(param.get("userEmail").toString());
            param.put("userEmail", encodeEmail);
         }

      } catch (InvalidKeyException | NoSuchPaddingException | NoSuchAlgorithmException | UnsupportedEncodingException
            | BadPaddingException | IllegalBlockSizeException e) {
         e.printStackTrace();
      }
                  
      // TODO 임시데이터
      param.put("cpcd", null); // 어카운트업체id
      param.put("accountId", 0);// 어카운트업체 null일때 or 무료일때 0
      param.put("useYn", "Y");
       //유저타입 일단 무료회원가입 = CUSTOMER 하드코딩 추후변경사항오면 변경예정
      param.put("userType", "CUSTOMER");

      
      String getUserIdSeq = joinMapper.getUserIdSeq();
      param.put("userIdSeq", getUserIdSeq);
      
      param.put("creUserId", getUserIdSeq);
      param.put("modUserId", getUserIdSeq);
      
      int join = joinMapper.userInsert(param);
      
      //TODO 임시 권한 세팅
      param.put("rgId","RG00000000");
      
      int auth = joinMapper.userInsertAuth(param);
      int i =1;
      
      return i; // i 값은 어디서 오는지 모르겠지만, 여기에 정의된 것을 사용합니다.          
   }

   public int userModify(Map<String, Object> param) {
      try {
         // 데이터 암호화
         String encodePw = passwordEncoder.encode(param.get("loginPwd").toString());
         param.put("loginPwd", encodePw);
         if (param.get("userEmail") != null) {
            String encodeEmail = CrypoUtil.encrypto(param.get("userEmail").toString());
            param.put("userEmail", encodeEmail);
         }
         String encodePhone = CrypoUtil.encrypto(param.get("userPhone").toString());
         param.put("userPhone", encodePhone);

      } catch (InvalidKeyException | NoSuchPaddingException | NoSuchAlgorithmException | UnsupportedEncodingException
            | BadPaddingException | IllegalBlockSizeException e) {
         e.printStackTrace();
      }

      // TODO 임시데이터
      param.put("cpcd", null); // 어카운트업체id
      param.put("accountId", 0);// 어카운트업체 null일때 or 무료일때 0
      param.put("useYn", "Y");
      param.put("modUserId", param.get("loginId").toString());

      return joinMapper.userModify(param);
   }

   public Map<String, Object> getUserInfo(Map<String, Object> param) {
      Map<String, Object> decResult = joinMapper.getUserInfo(param);
      // 데이터 복호화
      try {
         if (decResult.get("USER_EMAIL") != null) {
            String decodeEmail = CrypoUtil.decrypto(decResult.get("USER_EMAIL").toString());
            decResult.put("USER_EMAIL", decodeEmail);
         }
         if (decResult.get("USER_PHONE") != null) {
            String decodePhone = CrypoUtil.decrypto(decResult.get("USER_PHONE").toString());
            decResult.put("USER_PHONE", decodePhone);
         }
      } catch (InvalidKeyException | NoSuchPaddingException | NoSuchAlgorithmException | BadPaddingException
            | IllegalBlockSizeException | UnsupportedEncodingException | DecoderException e) {
         // TODO Auto-generated catch block
         e.printStackTrace();
      }

      return decResult;
   }

   public int resetPassword(Map<String, Object> param) {

      // 데이터 암호화
      String encodePw = passwordEncoder.encode(param.get("loginPwd").toString());
      param.put("loginPwd", encodePw);

      param.put("modUserId", param.get("loginId").toString());

      return joinMapper.resetPassword(param);
   }

    public boolean withdrawMember(MemberVO member) {     
        MemberVO user = joinMapper.findById(member.getUserName());
        
        if (user != null)  {
           String formPassword = member.getPassword();
           String storedPassword = user.getPassword();  
           
           try { 
               if (CrypoUtil.encrypto(member.getUserPhone()).equals(user.getUserPhone()) 
            		   && user.getName().equals(member.getName())
            		   && passwordEncoder.matches(formPassword, storedPassword)) {
                     joinMapper.updateMember(member);
                     return true;    
               }
           } catch(Exception e) {
              e.printStackTrace();
           }
       }
        return false;
    }

}