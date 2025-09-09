package com.common.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
public class SmsService {

	private final String smsActive;
	private final String smsId;
	private final String smsPw;
	private final String smsDevUrl;
	private final String smsProdUrl;
	private final String smsFrom;

	public SmsService(@Value("${sms.active}") String smsActive, @Value("${sms.id}") String smsId,
			@Value("${sms.pw}") String smsPw, @Value("${sms.dev-url}") String smsDevUrl,
			@Value("${sms.prod-url}") String smsProdUrl, @Value("${sms.from}") String smsFrom) {
		this.smsActive = smsActive;
		this.smsId = smsId;
		this.smsPw = smsPw;
		this.smsDevUrl = smsDevUrl;
		this.smsProdUrl = smsProdUrl;
		this.smsFrom = smsFrom;
	}

	/*
	 * SMS 전송.
	 */
	public Map<String, Object> putSms(Map<String, Object> param) {

		String accesstoken = null;
		Map<String, Object> smsRes = new HashMap<String, Object>();
		String input = null;
		StringBuffer result = new StringBuffer();
		URL url = null;
		BufferedReader in = null;

		try {
			System.out.println("smsActive  :   " + smsActive);
			/** SSL 인증서 무시 : 비즈뿌리오 API 운영을 접속하는 경우 해당 코드 필요 없음 **/
			if (smsActive.equals("prod")) {
				url = new URL(smsProdUrl + "/v3/message");
			} else {
				TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
					public X509Certificate[] getAcceptedIssuers() {
						return null;
					}

					public void checkClientTrusted(X509Certificate[] chain, String authType) {

					}

					public void checkServerTrusted(X509Certificate[] chain, String authType) {

					}
				} };

				SSLContext sc = SSLContext.getInstance("SSL");
				sc.init(null, trustAllCerts, new java.security.SecureRandom());
				HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

				url = new URL(smsDevUrl + "/v3/message");

			}

			// 인증 토큰 발급.
			accesstoken = getToken();

			// 인증 토큰이 없을 경우.
			if (!StringUtils.hasText(accesstoken)) {
				smsRes.put("code", "9999");
				smsRes.put("description", "token is null");
				System.out.println("smsRes : " + smsRes);
				return smsRes;
			}

			/** Connection 설정 **/
			HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
			connection.setRequestMethod("POST");
			connection.addRequestProperty("Content-Type", "application/json");
			connection.addRequestProperty("Accept-Charset", "UTF-8");
			connection.addRequestProperty("Authorization", "Bearer"+" "+ accesstoken);
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setUseCaches(false);
			connection.setConnectTimeout(15000);

			/** Request **/
			OutputStream os = connection.getOutputStream();
			String sms = "{\"account\":\"" + smsId+ "\","
					+ "\"refkey\":\"rms\","
					+ "\"type\":\"sms\","
					+ "\"from\":\"" + smsFrom + "\","
					+ "\"to\":\"" + param.get("toPhone")+ "\","
					+ "\"content\":{\"sms\":{\"message\":\"" + param.get("msg") + "\"}}}";
			os.write(sms.getBytes("UTF-8"));
			os.flush();

			/** Response **/
			if (100 <= connection.getResponseCode() && connection.getResponseCode() <= 399) {
				in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
			} else {
				in = new BufferedReader(new InputStreamReader(connection.getErrorStream(), "UTF-8"));
			}

			while ((input = in.readLine()) != null) {
				result.append(input);
			}

			connection.disconnect();

			// Json Parser
			smsRes = jsonToMap(result.toString());
			return smsRes;

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return smsRes;
		}
	}

	/*
	 * 인증 토큰 발급
	 */
	public String getToken() {

		String idPw = smsId + ":" + smsPw;
		String input = null;
		StringBuffer result = new StringBuffer();
		URL url = null;
		BufferedReader in = null;

		/* base64 encoding */
		String encodedIdPw = new String(Base64.encodeBase64(idPw.getBytes()));

		try {
			if (smsActive.equals("prod")) {
				url = new URL(smsProdUrl + "/v1/token");
			} else {
				/** SSL 인증서 무시 : 비즈뿌리오 API 운영을 접속하는 경우 해당 코드 필요 없음 **/
				TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
					public X509Certificate[] getAcceptedIssuers() {
						return null;
					}

					public void checkClientTrusted(X509Certificate[] chain, String authType) {

					}

					public void checkServerTrusted(X509Certificate[] chain, String authType) {

					}
				} };

				SSLContext sc = SSLContext.getInstance("SSL");
				sc.init(null, trustAllCerts, new java.security.SecureRandom());
				HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

				url = new URL(smsDevUrl + "/v1/token");

			}

			/** Connection 설정 **/
			HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
			connection.setRequestMethod("POST");
			connection.addRequestProperty("Content-Type", "application/json");
			connection.addRequestProperty("Accept-Charset", "UTF-8");
			connection.addRequestProperty("Authorization", "Basic " + encodedIdPw);
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setUseCaches(false);
			connection.setConnectTimeout(15000);

			/** Response **/
			if (100 <= connection.getResponseCode() && connection.getResponseCode() <= 399) {
				in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
			} else {
				in = new BufferedReader(new InputStreamReader(connection.getErrorStream(), "UTF-8"));
			}

			while ((input = in.readLine()) != null) {
				result.append(input);
			}

			connection.disconnect();

			System.out.println("Response : " + result.toString());

			if (100 <= connection.getResponseCode() && connection.getResponseCode() <= 399) {
				// Json Parser
				JsonObject jsonResult = (JsonObject) JsonParser.parseString(result.toString());
				return jsonResult.get("accesstoken").getAsString();
			} else {
				return null;
			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

	public Map<String, Object> jsonToMap(String json) throws Exception {
		ObjectMapper objectMapper = new ObjectMapper();
		TypeReference<Map<String, Object>> typeReference = new TypeReference<Map<String, Object>>() {
		};

		return objectMapper.readValue(json, typeReference);
	}
}