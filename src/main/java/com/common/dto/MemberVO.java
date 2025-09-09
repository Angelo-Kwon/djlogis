package com.common.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Data
public class MemberVO {
   private String userName; // 로그인 id
   private String password; // 비밀번호
   private String name; // 사용자명
   private String userPhone; // 핸드폰 
   private String useYn; // 사용여부 
}