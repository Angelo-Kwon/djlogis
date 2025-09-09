package com.sy.util;

import java.util.regex.Pattern;

public class ValidationUtil {
	 // 영문자+숫자 혹은 영문자만 6~15자리
    private static final String ID_PATTERN = "^(?=.*[A-Za-z])[A-Za-z0-9]{6,15}$";
    
    // 특수문자를 포함한 영문+숫자 8-20자리
    private static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!.]).{8,20}$";

    public static boolean isValidId(String id) {
        return Pattern.matches(ID_PATTERN, id);
    }

    public static boolean isValidPassword(String password) {
        return Pattern.matches(PASSWORD_PATTERN, password);
    }
}
