package com.configuration.util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CrypoUtil {

	private static String key;
	
	@Value("${spring.database.column.encrypt.key}") 
    public void setKey(String key){
		CrypoUtil.key = key;
	}
	/**
	 * @param text 암호화할 데이터
	 */
	public static String encrypto(String text) throws NoSuchPaddingException, NoSuchAlgorithmException,
			InvalidKeyException, UnsupportedEncodingException, BadPaddingException, IllegalBlockSizeException {
		final Cipher encryptCipher = Cipher.getInstance("AES");
		encryptCipher.init(Cipher.ENCRYPT_MODE, generateMySQLAESKey(key, "UTF-8"));
		String result = new String(Hex.encodeHex(encryptCipher.doFinal(text.getBytes("UTF-8")))).toUpperCase();

		return result;
	}

	/**
	 * @param text 암호화 풀 데이터
	 */
	public static String decrypto(String text)
			throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, BadPaddingException,
			IllegalBlockSizeException, UnsupportedEncodingException, DecoderException {
		final Cipher decryptCipher = Cipher.getInstance("AES");
		decryptCipher.init(Cipher.DECRYPT_MODE, generateMySQLAESKey(key, "UTF-8"));
		String result = new String(decryptCipher.doFinal(Hex.decodeHex(text.toCharArray())));

		return result;
	}

	/**
	 * @param key
	 * @param text
	 */
	public static SecretKeySpec generateMySQLAESKey(final String key, final String encoding) {
		try {
			final byte[] finalKey = new byte[16];
			int i = 0;
			for (byte b : key.getBytes(encoding))
				finalKey[i++ % 16] ^= b;
			return new SecretKeySpec(finalKey, "AES");
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
	}

}
