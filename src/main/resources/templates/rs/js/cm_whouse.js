var $cmWhousePqgrid = $("#cmWhousePqgridDiv");
var bxSlider;

$(function() {

	common.setCommCode($("#carEntCd"), "VHCTYPE", null, 3); // 차량진입정보 "VHCTYPE"
	common.setCommCode($("#whKnCd"), "CARTEMPCD", null, 3); // 창고종류 "CARTEMPCD""
	common.setCommCode($("#useYn"), "USEYN", null, 3, function() { // 사용여부
		$(this).find("option[value=S]").remove();
	});
	common.setNumOnly("cmPrice", "tlFlNum", "udFlNum", "lotArea", "tlArea");//숫자만
	common.setNumOnlyWithComma("cmPrice", "tlFlNum", "udFlNum", "lotArea", "tlArea");//숫자만-콤마처리
	common.setBrnoForObj($("#brNo")); // 사업자등록번호
	common.setTelNoForObj($("#telNo")); // 전화번호

	$(".bxslider-div").hide();

	bxSlider = $('.bxslider').bxSlider({
		speed: 500,
		pager: true,
		captions: true,
		mode: 'fade',
	});

	fnEvent();
	fnInitGrid();
});

// grid 기본 셋팅
function fnInitGrid() {
	var colModel = [
		{ title: "창고명", dataType: "string", dataIndx: "whNm", align: "center", width: 100 },
		{ title: "지역(시/군/구)", dataType: "string", dataIndx: "areaNm2", align: "center", width: 100 },
		{
			title: "사용여부", dataType: "string", dataIndx: "useYn", align: "center", width: 70, render: function(ui) {
				var useYn = ui.rowData.useYn;
				if (useYn === "Y") {
					return "사용";
				} else {
					return "미사용";
				}
			}
		},
		{ title: "공유여부", dataType: "string", dataIndx: "SH_USE_YN_NM", align: "center", width: 70 },

		{ title: "공유여부 코드", dataType: "string", dataIndx: "shYn", hidden: true },
		{ title: "WH_ID", dataIndx: "whId", hidden: true },
		{ title: "사업자등록번호", dataIndx: "brNo", hidden: true },
		{ title: "대표자명", dataIndx: "ceoNm", hidden: true },
		{ title: "사용여부", dataIndx: "useYn", hidden: true },
		{ title: "담당자명", dataIndx: "chNm", hidden: true },
		{ title: "공급자명", dataIndx: "userNm", hidden: true },
		{ title: "전화번호", dataIndx: "telNo", hidden: true },
		{ title: "이메일주소", dataIndx: "mailAddr", hidden: true },
		{ title: "지역(시도)", dataIndx: "areaNm1", hidden: true },
		{ title: "지역(시군구)", dataIndx: "areaNm2", hidden: true },
		{ title: "기본주소", dataIndx: "dtAddr", hidden: true },
		{ title: "상세주소", dataIndx: "dtAddr2", hidden: true },
		{ title: "전체층수", dataIndx: "tlFlNum", hidden: true },
		{ title: "지하층수", dataIndx: "udFlNum", hidden: true },
		{ title: "경도", dataIndx: "longiNo", hidden: true },
		{ title: "위도", dataIndx: "latiNo", hidden: true },
		{ title: "대지면적", dataIndx: "lotArea", hidden: true },
		{ title: "연면적", dataIndx: "tlArea", hidden: true },
		{ title: "창고종류", dataIndx: "whKnCd", hidden: true },
		{ title: "차량진입정보", dataIndx: "carEntCd", hidden: true },
		{ title: "일사용금액", dataIndx: "cmPrice", hidden: true },
		{ dataIndx: "farmYn", hidden: true },
		{ dataIndx: "fishYn", hidden: true },
		{ dataIndx: "meatYn", hidden: true },
		{ dataIndx: "foodYn", hidden: true },
		{ dataIndx: "fashionYn", hidden: true },
		{ dataIndx: "machYn", hidden: true },
		{ dataIndx: "mediYn", hidden: true },
		{ dataIndx: "furnYn", hidden: true },
		{ dataIndx: "elecYn", hidden: true },
		{ dataIndx: "metalYn", hidden: true },
		{ dataIndx: "etcYn", hidden: true },
		{ dataIndx: "isoYn", hidden: true },
		{ dataIndx: "aeoYn", hidden: true },
		{ dataIndx: "kgspYn", hidden: true },
		{ dataIndx: "tapaYn", hidden: true },
		{ dataIndx: "logiYn", hidden: true },
		{ dataIndx: "fireInsuYn", hidden: true },
		{ dataIndx: "saleInsuYn", hidden: true },
		{ dataIndx: "dockYn", hidden: true },
		{ dataIndx: "canopyYn", hidden: true },
		{ dataIndx: "cargoYn", hidden: true },
		{ dataIndx: "platYn", hidden: true },
		{ dataIndx: "autoYn", hidden: true },
		{ dataIndx: "rackYn", hidden: true },
		{ dataIndx: "verticalYn", hidden: true },
		{ dataIndx: "memo", hidden: true },
		{ dataIndx: "photo", hidden: true },
		{ dataIndx: "photo2", hidden: true },
		{ dataIndx: "photo3", hidden: true },
	];

	var options = {
		width: '100%',
		height: '99%',
		showTop: false,
		editable: false,
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		selectionModel: {type: "row", mode: "single"},
		trackModel: {on:true}, //GRID 추가,수정,삭제 처리된 상태 확인용 옵션
		dataModel: { data: [], recIndx: "whId" },
		autoColumnWidth:false,
		beforeRowSelect: function(event, ui) {
			fnSetDataForGrid();
		},
		rowClick: function(e, ui) {
			fnDetailViewClear();

			var rowData = ui.rowData;
			var shUseYn = rowData.SH_USE_YN;
			common.setValToComp(rowData);

			var removeDataIndxArr = ['WH_NM', 'AREA_NM2', 'USE_YN_NM', 'SH_USE_YN_NM',
				'SH_USE_YN', 'WH_ID', 'memo', 'photo', 'photo2', 'photo3'];
			var setDataArr = colModel.filter((item) => {
				return removeDataIndxArr.includes(item.dataIndx) === false;
			});

			setDataArr.forEach((item) => {
				var dataIndx = item.dataIndx;
				var checked = rowData[dataIndx] === "Y" ? true : false;
				$("#" + dataIndx).prop("checked", checked);
			});
			$("#memo").val(rowData.memo);

			var delBtnFlag = false;
			var $searchEdit = $(".search-edit");
			if (shUseYn === "S" || shUseYn === "A" || shUseYn === "R") {
				$searchEdit.find("select,input").prop("disabled", true);
				$("#btnWhouseReset").hide();

			} else {
				$searchEdit.find("select,input").prop("disabled", false);
				$("#whId,#userNm").prop("disabled", true);
				$("#btnWhouseReset").show();
				delBtnFlag = true;
			}
			fnInitWhousePhoto(rowData, delBtnFlag);
		}
	};

	var gridId = "cmWhousePqgridDiv";//그리드 ID
	this.gridCmmn = new GridUtil(colModel, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridCmmn.open();//그리드 생성
	$cmWhousePqgrid = gridCmmn.getGrid();//그리드 객체
}

// event 영역
function fnEvent() {
	$(".search-conditions input").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#btnSearch").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
		}
	});

	// 검색부분 초기화 버튼
	$("#btnReset").click(() => {
		$(".search-conditions").find("select").find('option:first').prop("selected", true);
		$(".search-conditions").find("input, radio, textarea").val("");
		fnDetailViewClear();
		fnResetGrid();
	});
	$("#btnAddRow").click(() => fnAddRow()); // 추가버튼
	$("#btnDelRow").click(() => fnDelRow()); // 삭제버튼
	$("#btnSearch").click(() => fnSearch()); // 조회버튼
	$("#btnSave").click(() => fnSaveCmWhouse());  // 저장버튼
	$("#adWhouseAddPhoto").click(() => fnAddWhousePhoto()); // 창고사진등록버튼
	$("#adWhousePhotoFile").change(() => fnSetImage("photo")); 	// 창고사진 체인지이벤트


	// 입력부분 초기화 버튼
	$("#btnWhouseReset").click(() => {

		var selectRow = $cmWhousePqgrid.SelectRow().getSelection()[0];
		if (!selectRow) {
			alert("선택된 창고가 없습니다.");
			return;
		}

		var rowData = selectRow.rowData;
		for (var i = 0; i < 3; i++) {
			['photo', 'photo2', 'photo3'].forEach((item) => {
				if (rowData[item]) {
					fnSetImageForGrid(selectRow, null, item);
				}
			});
		}
		fnDetailViewClear();
		$(".bxslider").empty();
	});

	$(".nav-link").click(function() {
		var navId = this.id;
		if (navId === "cmWhouseNav") {
			$("#adWhouseNav").removeClass("active");
			$("#cmWhouseNav").addClass("active");
			$("#adWhouseTabDiv").removeClass("show active").hide();
			$("#cmWhouseTabDiv").addClass("show active").show();
		} else {
			$("#cmWhouseNav").removeClass("active");
			$("#adWhouseNav").addClass("active");
			$("#cmWhouseTabDiv").removeClass("show active").hide();
			$("#adWhouseTabDiv").addClass("show active").show();
		}
	});

}

function fnSetImageForGrid(selectRow, imageURI, dataIndx) {
	$cmWhousePqgrid.options.editable = true;//수정모드
	var newRow = {};
	newRow[dataIndx] = imageURI;
	$cmWhousePqgrid.updateRow({ rowIndx: selectRow.rowIndx, newRow: newRow });
	//조회 데이터 수정
	$cmWhousePqgrid.options.editable = false;//수정모드 종료
}


function fnSetDataForGrid() {
	var selectRow = $cmWhousePqgrid.SelectRow().getSelection()[0];
	if (!selectRow) {
		return;
	}
	var rowData = selectRow.rowData;
	var shUseYn = rowData.shUseYn;
	if (shUseYn === "Y" || shUseYn === "S" || shUseYn === "R") {
		return;
	}
	//이미지와 input,select 값에 없는 항목 제외
	var removeDataIndxArr = ['USE_YN_NM', 'SH_USE_YN_NM',
		'SH_USE_YN','whId','photo','photo2','photo3'];
	var colModel = $cmWhousePqgrid.getColModel();
	var setDataArr = colModel.filter((item) => {
		return removeDataIndxArr.includes(item.dataIndx) === false;
	});
	var newData = {};
	setDataArr.forEach((item) => {
		var dataIndx = item.dataIndx;
		var $this = $("#"+dataIndx);
		if($this.is("input:checkbox")){
			newData[dataIndx] = $this.is(":checked")?"Y":"N";
		}else{
			newData[dataIndx] = $this.val();
		}
	});
	newData["memo"] = $("#memo").val();

	$cmWhousePqgrid.options.editable = true;//수정모드
	$cmWhousePqgrid.updateRow({ rowIndx: selectRow.rowIndx, newRow: newData });
	//조회 데이터 수정
	$cmWhousePqgrid.options.editable = false;//수정모드 종료
}


// 그리드 행추가
function fnAddRow() {
	var addRowIdx = $cmWhousePqgrid.pageData().length;
	$cmWhousePqgrid.addRow(
		{ newRow: { 'addRowIdx': addRowIdx }, rowIndx: addRowIdx }
	);
	if ($cmWhousePqgrid.SelectRow().getSelection()[0]) {
		$cmWhousePqgrid.setSelection(null);
	}
	$cmWhousePqgrid.setSelection({ rowIndx: addRowIdx });
	fnDetailViewClear();
}

// 그리드 행삭제
function fnDelRow() {
	var selectRow = $cmWhousePqgrid.SelectRow().getSelection()[0];
	var rowData = selectRow.rowData;
	var shUseYn = rowData.SH_USE_YN;
	if (!selectRow) {
		alert("선택한 창고가 없습니다.");
		return;

	} else if (shUseYn === "S" || shUseYn === "A" || shUseYn === "R") {
		alert("해당 창고는 공유" + rowData.SH_USE_YN_NM + "으로 수정 및 삭제 할 수 없습니다.");
		return;
	} else if (!rowData["WH_ID"]) {
		if (confirm("작성한 내용이 삭제됩니다.\n삭제하시겠습니까?")) {
			$cmWhousePqgrid.deleteRow({ rowIndx: selectRow.rowIndx });
			fnDetailViewClear();
		}
	} else {
		if (confirm("삭제하시겠습니까?")) {
			$cmWhousePqgrid.deleteRow({ rowIndx: selectRow.rowIndx });
			fnDetailViewClear();
			alert("행 삭제 후 저장 버튼을 클릭하세요");
		}
	}
}

function fnInitWhousePhoto(rowData, delBtnFlag) {
	var $bxslider = $(".bxslider");
	var $bxsliderDiv = $(".bxslider-div");

	$bxsliderDiv.hide();
	$bxslider.empty();

	var whousePhotoLength = 0;
	["photo", "photo2", "photo3"].forEach((item) => {
		if (rowData[item]) {
			var $whousePhotoLi = $('<li/>');
			if (delBtnFlag) {
				$whousePhotoLi.append($('<button/>', { id: item, class: 'btn-pic-delete' }).click((e) => fnRemoveImage(e)));
			}
			$whousePhotoLi.append($('<img/>', { src: "data:image;base64," + rowData[item], style: 'height:300px' }));
			$bxslider.append($whousePhotoLi);
			whousePhotoLength++;
		}
	});

	if (whousePhotoLength < 1) {
		return;
	}

	bxSlider.reloadSlider();
	$bxsliderDiv.show();
}


function fnAddWhousePhoto() {
	var selectRow = $cmWhousePqgrid.SelectRow().getSelection()[0];
	if (!selectRow) {
		alert("선택된 창고가 없습니다.");
		return;
	}

	var rowData = selectRow.rowData;
	var shUseYn = rowData.SH_USE_YN;

	if (shUseYn === "A" || shUseYn === "S" || shUseYn === "R") {
		alert("해당 창고는 공유" + rowData.SH_USE_YN_NM + "으로 이미지 등록이 불가능합니다.");
		return false;
	}

	$("#adWhousePhotoFile").click();
}

function fnSetImage() {
	var selectRow = $cmWhousePqgrid.SelectRow().getSelection()[0];
	if (!selectRow) {
		alert("선택된 창고가 없습니다.");
		return;
	}
	var rowData = selectRow.rowData;

	var whousePhotoArr = ['photo', 'photo2', 'photo3'];
	whousePhotoArr = whousePhotoArr.filter((item) => {
		return !rowData[item];
	});

	if (whousePhotoArr.length === 0) {
		alert("사진은 3개까지 등록 가능합니다.");
		return;
	}

	var thisFile = $("#adWhousePhotoFile")[0].files[0];
	var reader = new FileReader();
	reader.readAsDataURL(thisFile);
	reader.onload = function() {
		var imageURI = reader.result;
		var $whousePhotoLi = $('<li/>');
		$whousePhotoLi.append($('<button/>', { id: whousePhotoArr[0], class: 'btn-pic-delete new-whouse-photo' }).click((e) => fnRemoveImage(e)));
		$whousePhotoLi.append($('<img/>', { src: imageURI, style: 'height:300px' }));
		$(".bxslider").append($whousePhotoLi);
		bxSlider.reloadSlider();
		bxSlider.goToPrevSlide();

		var startIdx = imageURI.indexOf(',');
		imageURI = imageURI.substring(startIdx + 1, imageURI.length);
		fnSetImageForGrid(selectRow, imageURI, whousePhotoArr[0]);

		$(".bxslider-div").show();
		$("#adWhousePhotoFile").val("");
	};
}

function fnRemoveImage(e) {
	if (confirm("삭제하시겠습니까?")) {
		var selectRow = $cmWhousePqgrid.SelectRow().getSelection()[0];
		var targetEl = $("#" + e.target.id);
		if (!targetEl.hasClass('new-whouse-photo')) {
			alert("저장버튼을 눌러야 삭제됩니다.");
		}
		targetEl.parent().remove();
		if ($(".bxslider > li").length === 0) {
			$(".bxslider-div").hide();
		}
		fnSetImageForGrid(selectRow, null, e.target.id);
		bxSlider.reloadSlider();
	}
}

function fnSearch() {
	var param = {
		'schWhNm': $('#schWhNm').val(),
		'schDtAddr': $('#schDtAddr').val(),
		'schChNm': $('#schChNm').val(),
		'schUseYn': $('#schUseYn').val(),
		'schShYn': $('#schShYn').val()
	} //조회조건 파라미터
	//로딩바 SHOW
	$cmWhousePqgrid.showLoading();
	//호출
	$.ajax({
		url: "/rs/whouse/getWhouseBasicInfoList",
		data: param,
		type: "POST",
		dataType: "json",
		success: function(data) {
			fnDetailViewClear();
			$("#cmWhouseNav").click();
			// 변경된 부분: 그리드에 데이터 할당
			$cmWhousePqgrid.option("dataModel.data", data.dataList);
			$cmWhousePqgrid.refreshDataAndView();
		},
		error: function(e) {
			console.error('에러 발생:', e);
			$cmWhousePqgrid.hideLoading();
		},
		complete: function(e) {
			//로딩바 HIDE
			$cmWhousePqgrid.hideLoading();
			//그리드 히스토리 초기화
			$cmWhousePqgrid.History().reset();
		},
	});
}

/*
 * 저장
 */
function fnSaveCmWhouse() {
	fnSetDataForGrid();

	console.log($cmWhousePqgrid.getChanges({ format: 'byVal' }));
	if (!$cmWhousePqgrid.isDirty()) {
		alert("수정된 내용이 없습니다.");
		return;
	}

	//필수체크
	var mustChkColList = [
		{ column: "whNm", title: "창고명" }
		, { column: "brNo", title: "사업자등록번호" }
		, { column: "ceoNm", title: "대표자명" }
		, { column: "chNm", title: "담당자명" }
		, { column: "telNo", title: "전화번호" }
		, { column: "mailAddr", title: "이메일" }
		, { column: "areaNm1", title: "주소" }

	];

	//검증
	var gridChanges = $cmWhousePqgrid.getChanges({ format: 'byVal' });
	var addList = gridChanges.addList;
	var updateList = gridChanges.updateList;

	var msg = "";
	updateList.forEach(function(dataObj) {
		var validationMsg = "";
		mustChkColList.forEach(function(chkColObj) {
			var tmpCol = dataObj[chkColObj.column];
			if (!tmpCol && chkColObj.column) { // 수정된 부분: 상세주소는 예외로 처리
				validationMsg += "'창고 기본정보' 의 " + "'" + chkColObj.title + "'\r\n";
			}
		});
		if (validationMsg) {
			msg += "[" + dataObj["WH_NM"] + "]\n" + validationMsg + "\n";
		}
	});
	addList.forEach(function(dataObj) {
		var validationMsg = "";
		mustChkColList.forEach(function(chkColObj) {
			var tmpCol = dataObj[chkColObj.column];
			if (!tmpCol && chkColObj.column) { // 수정된 부분: 상세주소는 예외로 처리
				validationMsg += "'창고 기본정보' 의 " + "'" + chkColObj.title + "'\r\n";
			}
		});
		if (validationMsg) {
			msg += "[" + (dataObj["addRowIdx"] + 1) + "] 번째 행 \n" + validationMsg + "\n";
		}
	});
	if (msg) {
		alert(msg + "은(는) 필수 입력값입니다.");
		return;
	}

	if (confirm("저장하시겠습니까?")) {
		var param = $cmWhousePqgrid.getChanges({ format: 'byVal' });

		$cmWhousePqgrid.showLoading();
		$.ajax({
			url: "/rs/whouse/saveWhouseBasicInfo",
			type: "POST",
			data: JSON.stringify(param),
			contentType: 'application/json',
			dataType: 'json',
			success: function(result) {
				if (result.error) {
					alert(result.error);
					return;
				}
				alert("저장 되었습니다.");
				fnSearch();
			},
			error: function(e) {
				alert(e);
			},
			complete: function(e) {
				// 로딩바 감춤
				$cmWhousePqgrid.hideLoading();
			}
		});
	}
}

function fnDetailViewClear() {
	$(".bxslider-div").hide();
	var $searchEdit = $(".search-edit");
	$searchEdit.find("select").find('option:first').prop("selected", true);
	$searchEdit.find("input").prop('checked', false);
	$searchEdit.find("input").val("");
	$searchEdit.find("select,input").prop("disabled", false);
	$searchEdit.find("input,textarea").prop("disabled", false);
	$("#memo").val("");
	$(".addr").prop("disabled", true);
	$("#whId,#userNm").prop("disabled", true);
}

function fnResetGrid() {
	$cmWhousePqgrid.option("dataModel.data", []);
	$cmWhousePqgrid.refreshDataAndView();
}

function execPostcode() {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 각 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var addr = ''; // 주소 변수
			//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
				addr = data.roadAddress;
			} else { // 사용자가 지번 주소를 선택했을 경우(J)
				addr = data.jibunAddress;
			}

			var geocoder = new kakao.maps.services.Geocoder();

			var callback = function(result, status) {
				if (status === kakao.maps.services.Status.OK) {
					$("#longiNo").val(result[0].x);
					$("#latiNo").val(result[0].y);
				}
			};
			geocoder.addressSearch(data.roadAddress, callback);

			// 주소 정보를 해당 필드에 넣는다.
			document.getElementById("dtAddr").value = addr + ' ';
			document.getElementById("dtAddr").readOnly = false;

			// 시도, 시군구 정보를 해당 필드에 넣는다.
			document.getElementById('areaNm1').value = data.sido;
			document.getElementById('areaNm2').value = data.sigungu;

			// 커서를 상세주소 필드로 이동한다.
			document.getElementById("dtAddr2").focus();
		}
	}).open();
}