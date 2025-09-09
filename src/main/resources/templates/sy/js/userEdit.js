console.log("스크립트 START : " + window.location.href);



var isChecked = false;
var isCheckedPw = false;
$(function() {
	loadInfo();  //회원정보 로드
	$("#loginPwd, #passwordConfirm").on('input', validatePassword);// 비밀번호 일치확인
	$("#modBtn").click(modInfo); //회원가입
	$(".btn-terms").click(showPopup);  //약관 show
	$(".close.bt-popup-close").click(closePopup); //약관 close
	$("#closeModal").click(closeCheckModal); //모달창 close
	$("#resetPw").click(resetPw); //비밀번호 초기화
	$("#userPhone").on("keyup", function() {
		setPhoneFormat("#userPhone");
	});
	
	common.setCommCode($("#rsType"),"RSTYPE");

});


function setPhoneFormat(input_id) {
	let inputValue = $(input_id).val().replace(/[^0-9]/g, "");
	if (inputValue.length > 11) {
		inputValue = inputValue.substring(0, 11);
	}
	// 입력된 숫자를 `xxx-xxxx-xxxx` 형식으로 포맷팅
	if (inputValue.length < 4) {
		$(input_id).val(inputValue);
	} else if (inputValue.length < 8) {
		$(input_id).val(inputValue.replace(/(\d{3})(\d{0,4})/, "$1-$2"));
	} else {
		$(input_id).val(inputValue.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3"));
	}
}


function modInfo() {
	var param = serializeWithEmptyFields('.info-box-wrapper');
	var rePram = queryStringToObject(param);
	if (!isAllValidationsPassed(rePram)) { return; }

	modUser(rePram);
}


function closeCheckModal() {
	location.reload();
}


function resetPw() {
	var data = { loginId: $('#hLoginId').val() };

	if (confirm("비밀번호를 초기화하시겠습니까?")) {
		$.ajax({
			type: "POST",
			url: "/sy/join/resetPw",
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(data) {
				var msg = '비밀번호가 초기화되었습니다.';
				modalFunc(data.msg);
			}
		});
	}
}

function isAllValidationsPassed(param) {
	if (!isCheckedPw) { alert('비밀번호가 일치하지 않습니다.'); return false; }
	//필수입력값 확인
	if (!validateRequiredFields()) { return false; }
	//비밀번호값 유효성검사
	if (!isValidPassword(param.loginPwd)) { alert("비밀번호는 특수문자를 포함한 영문+숫자로 8-20자리 이내로 입력해주세요."); return false; }

	return true;
}


function loadInfo() {

	var data = { loginId: $('#hLoginId').val() };

	// 페이지 로드시 바로 회원 정보 요청
	$.ajax({
		type: "POST",
		url: "/sy/join/getUserInfo",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function(data) {
			setValToComp3(data);//결과 TO 콤포넌트 맵핑
		}
	});
}


function modUser(param) {
	if (confirm("회원정보를 수정하시겠습니까?")) {
		$.ajax({
			type: "POST",
			url: "/sy/join/modUser",
			data: JSON.stringify(param),
			contentType: "application/json",
			success: function(response) {
				if (response.code == 'S') {
					modalFunc(response.msg);
				} else {
					alert(response.msg);
				}
			}
		});
	}

}


//비밀번호 & 비밀번호확인 체크
function validatePassword() {
	var password = $("#loginPwd").val();
	var confirmPwd = $("#passwordConfirm").val();

	if (password && confirmPwd && password !== confirmPwd) {
		$("#msg").text("비밀번호가 일치하지않습니다.").css("color", "red");
		isCheckedPw = false;
	} else if (password == confirmPwd) {
		$("#msg").text("비밀번호가 일치합니다.").css("color", "green");
		isCheckedPw = true;
	}
	else {
		$("#msg").text("");
		isCheckedPw = false;
	}
}



function serializeWithEmptyFields(formSelector) {
	var data = {};

	$(formSelector).find('input, select, textarea').each(function() {
		var id = $(this).attr('id');
		var value = $(this).val();

		// 체크박스 처리
		if ($(this).attr('type') === 'checkbox') {
			data[id] = $(this).is(':checked') ? 'Y' : 'N';
		} else {
			if (id) {
				data[id] = value ? value : '';
			}
		}
	});

	return $.param(data);
}


function queryStringToObject(queryString) {
	var pairs = queryString.split('&');
	var result = {};

	pairs.forEach(function(pair) {
		var parts = pair.split('=');
		var key = decodeURIComponent(parts[0]);
		var value = decodeURIComponent(parts[1] || '');
		result[key] = value;
		if (value === '+') {
			value = "";
		}
	});


	return result;
}

// 필수입력확인함수
function validateRequiredFields() {
	let isValid = true;

	$(".required").each(function() {
		const input = $(this);
		const label = $("label[for='" + input.attr("id") + "']");

		if (!input.val()) {
			alert(label.text() + '은(는) 필수 항목입니다.');
			isValid = false;
			return false;
		}
	});

	$(".required-check").each(function() {
		if (!$(this).prop("checked")) {
			alert('필수약관에 체크를 하셔야 회원가입이 가능합니다.');
			isValid = false;
			return false; // each loop를 종료
		}
	});

	return isValid;
}

function isValidPassword(password) {
	// 비밀번호의 유효성 검사 정규식
	// - 최소 8자, 최대 20자
	// - 영문 대소문자, 숫자, 특수문자 중 2종류 이상 조합
	var regex = /^(?:(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])|(?=.*[^a-zA-Z0-9])(?=.*[0-9])|(?=.*[!\\.])).{8,20}$/;

	return regex.test(password);
}



function showPopup() {
	$("#modal-background").fadeIn(300);
	$(".popup-terms").css("display", "flex").hide().fadeIn();
	$("body").css("overflow", "hidden");
}

function closePopup() {
	$("#modal-background").fadeOut(300);
	$(".popup-terms").fadeOut(300);
	$("body").css("overflow", "auto");
}

function modalFunc(msg) {
	$("#modal-background").fadeIn(300);
	$(".popup-msg").css("display", "flex").hide().fadeIn();
	$("body").css("overflow", "hidden");
	$("#checkMsg").text(msg);
}


function setValToComp3(dataObj) {
	var mappingResult = "";
	if (!dataObj) {//데이터가 없을경우 모든값 "" 처리
		mappingResult = "데이터가 null 이거나 undefined 입니다.";
	} else {
		var keys = Object.keys(dataObj);
		keys.forEach(function(item, index) {
			var dataVal = dataObj[item];
			var resultId = item;
			var camelCaseId;
			if (item === "LOGIN_PWD") return;
			var lowerCaseId = item.toLowerCase();  // 대문자를 소문자로 변환
			if (item.indexOf("_") >= 0) {//언더바 포함 단어일 경우
				camelCaseId = item.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());//KEY 카멜케이스 변환
			}
			if (item === "EMAIL_YN" || item === "SMS_YN" || item === "POL_GPS_YN") {  // 체크박스 처리			
				$("#" + camelCaseId).prop('checked', dataVal === 'Y');
			}
			if ($("#" + resultId).length) {
				if ($("#" + resultId).prop("type") != "file") {//파일 콤포넌트 제외
					$("#" + resultId).val(dataVal);
					$("#" + resultId).keyup();//키업이벤트 : 3자리 콤마처리
				}
			} else if (camelCaseId && $("#" + camelCaseId).length) {
				if ($("#" + camelCaseId).prop("type") != "file") {//파일 콤포넌트 제외
					$("#" + camelCaseId).val(dataVal);
					$("#" + camelCaseId).keyup();//키업이벤트 : 3자리 콤마처리
				}
			} else if ($("#" + resultId.toLowerCase()).length) {
				if ($("#" + resultId.toLowerCase()).prop("type") != "file") {
					$("#" + resultId.toLowerCase()).val(dataVal);
					$("#" + resultId.toLowerCase()).keyup();
				}
			} else {
				mappingResult += "KEY '" + item + "' 맵핑 실패, ";
			}
		});
		if (mappingResult == "") mappingResult = "전체 처리 완료.";
	}
	return mappingResult;
}

function goBack() {
	window.history.back();
}
