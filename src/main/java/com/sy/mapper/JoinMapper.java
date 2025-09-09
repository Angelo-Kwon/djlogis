package com.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.common.dto.MemberVO;

@Mapper
public interface JoinMapper {
   

   public int checkUserId(Map<String, Object> param);
   
   public int userInsert(Map<String, Object> param);
   
   public int userInsertAuth(Map<String, Object> param);
   
   public String getUserIdSeq();
   
   public int userModify(Map<String, Object> param);
   
   public int resetPassword(Map<String, Object> param);
   
   public Map<String, Object> getUserInfo(Map<String, Object> param);

   public MemberVO findById(String userName);
      
   public void updateMember(MemberVO member);

}