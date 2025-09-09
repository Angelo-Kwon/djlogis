var $cmManpwPqGrid = $("#cmManpwPqgridDiv");
var bxSlider;

$(function() {
	common.setCommCode($("#cmManpwdWrkCd"), "WRK_CD", null, 2);				// 인력구분(조회)
	common.setCommCode($("#cmManpwWrkTyp"), "WRK_TYP", null, 2);
	common.setCommCode($("#cmManpwUseYn"), "USEYN", null, 2, function() { 	// 사용여부(조회)
		$(this).find("option[value=S]").remove();
	});

	common.setCommCode($("#wrkCd"), "WRK_CD", null, 3);			// 인력구분
	common.setCommCode($("#wrkTyp"), "WRK_TYP", null, 3);			// 근무형태
	common.setCommCode($("#wrkGrp"), "WRK_GRP", null, 3);			// 직종
	common.setCommCode($("#WRK_GRP1"), "WRK_GRP1"); 		// 직종중
	common.setCommCode($("#WRK_GRP2"), "WRK_GRP2"); 		// 직종소
	common.setCommCode($("#wrkArea"), "WRK_AREA", null, 3);			// 희망근무지
	common.setCommCode($("#ngtYn"), "NGT_YN", null, 3);			// 야간근무여부
	common.setCommCode($("#licnYn"), "LICN_YN", null, 3);			// 자격증유무
	common.setCommCode($("#useYn"), "USEYN", null, 3, function() {	// 사용여부
		$(this).find("option[value=S]").remove();
	});

	common.setNumOnlyWithComma("wrkReqMon"); 	// 희망근무월수
	common.setNumOnlyForObj($("#condBrNo"));	// 사업자등록번호
	common.setBrnoForObj($("#brNo"));		 	// 사업자등록번호

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

function fnEvent() {
	//검색 조회
	$("#cmManpwSearchBtn").click(() => fnSearch());
	$(".search-conditions input").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#cmManpwSearchBtn").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
		}
	});
	//검색 초기화 
	$("#cmManpwSeacrhClearBtn").click(() => {
		$(".search-conditions").find("select").find('option:first').prop("selected", true);
		$(".search-conditions").find("input").val("");
		fnDetailViewClear();
		fnResetGrid();
	});
	//추가
	$("#addRowBtn").click(() => fnAddRow());
	//삭제
	$("#delRowBtn").click(() => fnDelRow());

	//저장
	$("#saveBtn").click(() => fnSave());

	$("#adManpwphoto").click(() => fnManpwphot("photo")); // 인력사진등록버튼
	$("#adManpwLicn").click(() => fnManpwphot("card")); // 자격증사진등록버튼
	$("#adManpwphotoFile").change(() => fnSetImage("photo")); //인력사진 체인지이벤트
	$("#adManpwLicnFile").change(() => fnSetImage("card")); //인력사진 체인지이벤트

	//인력사진 삭제.
	$("#adManpwphotoDelBtn").click(() => {
		var selectRow = $cmManpwPqGrid.SelectRow().getSelection()[0];

		if (confirm("삭제하시겠습니까?")) {
			fnSetImageForGrid(selectRow, null, 'WRK_PHTO');
			$(".pic-car-card").hide();
			alert("저장버튼을 눌러야 삭제됩니다.");
		}
	});


	$("#clearEditsBtn").click(() => {
		var selectRow = $cmManpwPqGrid.SelectRow().getSelection()[0];
		if (!selectRow) {
			alert("선택된 인력이 없습니다.");
			return;
		}

		var rowData = selectRow.rowData;
		for (var i = 0; i < 3; i++) {
			['WRK_LICN', 'WRK_LICN2', 'WRK_LICN3'].forEach((item) => {
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
		if (navId === "cmManpwNav") {
			$("#adManpwNav").removeClass("active");
			$("#cmManpwNav").addClass("active");
			$("#adManpwTabDiv").removeClass("show active").hide();
			$("#cmManpwTabDiv").addClass("show active").show();
		} else {
			$("#cmManpwNav").removeClass("active");
			$("#adManpwNav").addClass("active");
			$("#cmManpwTabDiv").removeClass("show active").hide();
			$("#adManpwTabDiv").addClass("show active").show();
		}
	});
}

function fnInitGrid() {
	var colModel = [
		{ title: "인력구분", dataIndx: "wrkCdNm", dataType: "string", align: "center" },
		{ title: "인력이름", dataIndx: "MANPW_NM", dataType: "string", align: "center" },
		{ title: "사용여부", dataIndx: "USE_YN", dataType: "string", align: "center", render: renderUseYN },
		{ title: "공유여부", dataIndx: "SH_USE_YN_NM", dataType: "string", align: "center" },
		// hidden field
		{ title: "공유여부", dataIndx: "SH_YN", hidden: true },
		{ title: "인력번호", dataIndx: "MANPW_NO", hidden: true },
		{ title: "직종", dataIndx: "WRK_GRP", hidden: true },
		{ title: "직종중분류", dataIndx: "WRK_GRP1", hidden: true },
		{ title: "직종소분류", dataIndx: "WRK_GRP2", hidden: true },
		{ title: "인력사진", dataIndx: "WRK_PHTO", hidden: true },
		{ title: "자격중", dataIndx: "WRK_LICN", hidden: true },
		{ title: "자격중2", dataIndx: "WRK_LICN2", hidden: true },
		{ title: "자격중3", dataIndx: "WRK_LICN3", hidden: true },
		{ title: "공유여부", dataIndx: "SH_USE_YN", hidden: true },
		{ title: "인력구분", dataIndx: "wrkCd", hidden: true },
		{ title: "사업자등록번호", dataIndx: "brNo", hidden: true },
		{ title: "인력업체", dataIndx: "cpCd", hidden: true },
		{ title: "인력이름", dataIndx: "manpwNm", hidden: true },
		{ title: "근무형태", dataIndx: "wrkTyp", hidden: true },
		{ title: "근무시간1", dataIndx: "wrkTime1", hidden: true },
		{ title: "근무시간2", dataIndx: "wrkTime2", hidden: true },
		{ title: "직종", dataIndx: "wrkGrp", hidden: true },
		{ title: "야간근무여부", dataIndx: "ngtYn", hidden: true },
		{ title: "지격증유무", dataIndx: "licnYn", hidden: true },
		{ title: "희망근무지", dataIndx: "wrkArea", hidden: true },
		{ title: "희망근무월수", dataIndx: "wrkReqMon", hidden: true },
		{ title: "일사용금액", dataIndx: "cmPrice", hidden: true },
		{ title: "사용여부", dataIndx: "useYn", hidden: true }
	];
	function renderUseYN(ui) {
		if (ui.cellData === 'Y') {
			return '사용';
		} else if (ui.cellData === 'N') {
			return '미사용';
		}
		return ui.cellData;
	}
	var options = {
		width: '100%',
		height: '99%',
		showTop: false,
		editable: false,
		numberCell: { show: true, resizable: false, title: "순번", minWidth: 45 },
		colModel: colModel,
		selectionModel: { type: "row", mode: "single" },
		trackModel: { on: true }, //GRID 추가,수정,삭제 처리된 상태 확인용 옵션
		dataModel: { data: [], recIndx: "manpwNo" },
		beforeCellClick: function(event, ui) {
			fnSetDataForGrid();
		},
		rowClick: function(e, ui) {
			fnDetailViewClear();

			var rowData = ui.rowData;
			var shUseYn = rowData.SH_USE_YN;
			common.setValToComp(rowData);

			var delBtnFlag = false;
			var $searchEdit = $(".search-edit");
			if (shUseYn === "S" || shUseYn === "A" || shUseYn === "R") {
				$searchEdit.find("select,input").prop("disabled", true);
				$("#clearEditsBtn").hide();
				$("#adManpwphotoDelBtn").hide();
			} else {
				$searchEdit.find("select,input").prop("disabled", false);
				$("#clearEditsBtn").show();
				$("#adManpwphotoDelBtn").show();
				delBtnFlag = true;
			}

			fnInitManpwPhot(rowData, delBtnFlag);
			if (rowData.WRK_PHTO) {
				$("#adManpwphotoImage").attr("src", "data:image;base64," + rowData.WRK_PHTO);
				$(".pic-car-card").show();
			}
		}
	};

	var gridId = "cmManpwPqgridDiv";//그리드 ID
	this.gridCmmn = new GridUtil(colModel, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridCmmn.open();//그리드 생성
	$cmManpwPqGrid = gridCmmn.getGrid();//그리드 객체
}

//입력된 값을 grid rowData에 저장
function fnSetDataForGrid() {
	var selectRow = $cmManpwPqGrid.SelectRow().getSelection()[0];
	if (!selectRow) {
		return;
	}

	var rowIndx = selectRow.rowIndx;
	var rowData = selectRow.rowData;
	var shUseYn = rowData.SH_USE_YN_NM;
	if (shUseYn === "A" || shUseYn === "S" || shUseYn === "R") {
		return;
	}

	var newData = {};
	var colModel = $cmManpwPqGrid.getColModel();

	var removeDataIndxArr = ['wrkCdNm', 'MANPW_NM', 'USE_YN', 'SH_USE_YN', 'SH_USE_YN_NM', 'WRK_PHTO', 'WRK_LICN', 'WRK_LICN2', 'WRK_LICN3'];
	var setDataArr = colModel.filter((item) => {
		return removeDataIndxArr.includes(item.dataIndx) === false;
	});
	setDataArr.forEach((item) => {
		var dataIndx = item.dataIndx;
		var elValue = $("#" + item.dataIndx).val();
		newData[dataIndx] = elValue;

		if (dataIndx === "cmPrice" && !elValue) {
			newData[dataIndx] = "0";
		}
	});

	$cmManpwPqGrid.options.editable = true;//수정모드
	$cmManpwPqGrid.updateRow({ rowIndx: rowIndx, newRow: newData });
	//조회 데이터 수정
	$cmManpwPqGrid.options.editable = false;//수정모드 종료
}

function fnAddRow() {
	fnSetDataForGrid();

	var addRowIdx = $cmManpwPqGrid.pageData().length;
	$cmManpwPqGrid.addRow({
		rowIndx: addRowIdx,
		newRow: { 'addRowIdx': addRowIdx }
	});

	$cmManpwPqGrid.options.editable = true;//수정모드
	$cmManpwPqGrid.updateRow({
		rowIndx: addRowIdx,
		newRow: {}
	});
	//조회 데이터 수정
	$cmManpwPqGrid.options.editable = false;//수정모드 종료

	if ($cmManpwPqGrid.SelectRow().getSelection()[0]) {
		$cmManpwPqGrid.setSelection(null);
	}
	fnSearchEditInit();

	$cmManpwPqGrid.setSelection({ rowIndx: addRowIdx });
	common.setValToComp($cmManpwPqGrid.getRowData({ rowIndx: addRowIdx }));
}

function fnDelRow() {
	var selectRow = $cmManpwPqGrid.SelectRow().getSelection()[0];
	var rowData = selectRow.rowData;
	var shUseYn = rowData.SH_USE_YN;

	if (!selectRow) {
		alert("선택한 인력이 없습니다.");
		return;
	}

	if (shUseYn === "S" || shUseYn === "R" || shUseYn === "A") {
		alert("해당 인력은 공유" + rowData.SH_USE_YN_NM + " 으로 수정 및 삭제할 수 없습니다.");
		return;
	}

	if (!rowData.manpwNo) {
		if (confirm("입력한 내용이 삭제됩니다.\n삭제하시겠습니까?")) {
			$cmManpwPqGrid.deleteRow({ rowIndx: selectRow.rowIndx });
		}
	} else {
		if (confirm("삭제하시겠습니까?")) {
			$cmManpwPqGrid.deleteRow({ rowIndx: selectRow.rowIndx });
			alert("행 삭제 후 저장 버튼을 클릭하세요");
		}
	}

	fnSearchEditInit();
}

function fnInitManpwPhot(rowData, delBtnFlag) {
	var $bxslider = $(".bxslider");
	var $bxsliderDiv = $(".bxslider-div");

	$bxsliderDiv.hide();
	$bxslider.empty();

	var manpwPhotLength = 0;
	["WRK_LICN", "WRK_LICN2", "WRK_LICN3"].forEach((item) => {
		if (rowData[item]) {
			var $licnLi = $('<li/>');
			if (delBtnFlag) {
				$licnLi.append($('<button/>', { id: item, class: 'btn-pic-delete' }).click((e) => fnRemoveImage(e)));
			}
			$licnLi.append($('<img/>', { src: "data:image;base64," + rowData[item], style: 'height:300px' }));
			$bxslider.append($licnLi);
			manpwPhotLength++;
		}
	});

	if (manpwPhotLength < 1) {
		return;
	}

	bxSlider.reloadSlider();
	$bxsliderDiv.show();
}



function fnManpwphot(type) {
	var selectRow = $cmManpwPqGrid.SelectRow().getSelection()[0];
	if (!selectRow) {
		alert("선택된 인력이 없습니다.");
		return;
	}

	var rowData = selectRow.rowData;
	var shUseYn = rowData.SH_USE_YN;

	if (shUseYn === "A" || shUseYn === "S" || shUseYn === "R") {
		alert("해당 인력은 공유" + rowData.SH_USE_YN_NM + "으로 이미지 등록이 불가능합니다.");
		return false;
	}

	if (type === "photo") {
		$("#adManpwphotoFile").click();
		console.log("사진클릭");
	} else {
		$("#adManpwLicnFile").click();
	}
}

function fnSetImage(type) {
	var selectRow = $cmManpwPqGrid.SelectRow().getSelection()[0];
	if (!selectRow) {
		alert("선택된 인력이 없습니다.");
		return;
	}

	var rowData = selectRow.rowData;
	var reader = new FileReader();

	if (type === "card") {
		var licnPhotArr = ['WRK_LICN', 'WRK_LICN2', 'WRK_LICN3'];
		licnPhotArr = licnPhotArr.filter((item) => {
			return !rowData[item];
		});

		if (licnPhotArr.length === 0) {
			alert("사진은 3개까지 등록 가능합니다.");
			return;
		}
		var thisFile = $("#adManpwLicnFile")[0].files[0];

		reader.readAsDataURL(thisFile);
		reader.onload = function() {
			var imageURI = reader.result;
			var $licnLi = $('<li/>');
			$licnLi.append($('<button/>', { id: licnPhotArr[0], class: 'btn-pic-delete' }).click((e) => fnRemoveImage(e)));
			$licnLi.append($('<img/>', { src: imageURI, style: 'height:300px' }));
			$(".bxslider").append($licnLi);
			bxSlider.reloadSlider();
			bxSlider.goToPrevSlide();

			var startIdx = imageURI.indexOf(',');
			imageURI = imageURI.substring(startIdx + 1, imageURI.length);
			fnSetImageForGrid(selectRow, imageURI, licnPhotArr[0]);

			$(".bxslider-div").show();
			$("#adManpwLicnFile").val("");
		};
	} else {
		var thisFile = $("#adManpwphotoFile")[0].files[0];
		reader.readAsDataURL(thisFile);
		reader.onload = function() {
			var imageURI = reader.result;
			$("#adManpwphotoImage").attr("src", reader.result);

			var startIdx = imageURI.indexOf(',');
			imageURI = imageURI.substring(startIdx + 1, imageURI.length);
			fnSetImageForGrid(selectRow, imageURI, "WRK_PHTO");
			$(".pic-car-card").show();
			$("#adManpwphotoFile").val("");
		}
	}
}

function fnRemoveImage(e) {
	if (confirm("삭제하시겠습니까?")) {
		var selectRow = $cmManpwPqGrid.SelectRow().getSelection()[0];
		var targetEl = $("#" + e.target.id);
		if (selectRow.rowData.MANPW_NO) {
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

function fnSetImageForGrid(selectRow, imageURI, dataIndx) {
	$cmManpwPqGrid.options.editable = true;//수정모드
	var newRow = {};
	newRow[dataIndx] = imageURI;
	$cmManpwPqGrid.updateRow({ rowIndx: selectRow.rowIndx, newRow: newRow });
	//조회 데이터 수정
	$cmManpwPqGrid.options.editable = false;//수정모드 종료
}



function fnSearch() {
	var param = {
		'wrkCd': $("#cmManpwdWrkCd").val(),
		'wrkTyp': $("#cmManpwWrkTyp").val(),
		'manpwNm': $("#cmManpwManpwNm").val(),
		'useYn': $("#cmManpwUseYn").val(),
		'shUseYn': $("#cmManpwShUseYn").val(),
	}

	$.ajax({
		type: "POST",
		url: "/rs/manpw/getManpwBasicInfoList",
		data: param,
		beforeSend: function() {
			$cmManpwPqGrid.option("strLoading", "Searching...");
			$cmManpwPqGrid.showLoading();
		},
		success: function(data) {
			console.log("JSON.stringify(data) : " + JSON.stringify(data));

			fnDetailViewClear();
			$("#cmManpwNav").click();

			// 수정된 부분: 그리드 옵션 변경
			$cmManpwPqGrid.option("dataModel.data", data.dataList);
			$cmManpwPqGrid.refreshDataAndView();
		},
		error: function(e) {
			$cmManpwPqGrid.hideLoading();
		},
		complete: function(e) {
			// 로딩바 HIDE
			$cmManpwPqGrid.hideLoading();
			// 그리드 히스토리 초기화
			$cmManpwPqGrid.History().reset();
		},
	});
}

function fnSave() {
	fnSetDataForGrid();

	if (!$cmManpwPqGrid.isDirty()) {
		alert("수정된 내용이 없습니다.");
		return;
	}

	var mustChkColList = [
		{ title: "인력구분", column: "wrkCd" },
		{ title: "사업자등록번호", column: "brNo" },
		{ title: "인력업체", column: "cpCd" },
		{ title: "인력이름", column: "manpwNm" },
		{ title: "근무형태", column: "wrkTyp" }
	];

	//검증
	var gridChanges = $cmManpwPqGrid.getChanges({ format: 'byVal' });
	var addList = gridChanges.addList;
	var updateList = gridChanges.updateList;

	var msg = "";
	updateList.forEach(function(dataObj) {
		var validationMsg = "";
		mustChkColList.forEach(function(chkColObj) {
			var tmpCol = dataObj[chkColObj.column];
			if (!tmpCol && chkColObj.column) { // 수정된 부분: 상세주소는 예외로 처리
				validationMsg += "'인력 기본정보' 의 " + "'" + chkColObj.title + "'\r\n";
			}
		});
		if (validationMsg) {
			msg += "[" + dataObj["manpwNm"] + "]\n" + validationMsg + "\n";
		}
	});
	addList.forEach(function(dataObj) {
		var validationMsg = "";
		mustChkColList.forEach(function(chkColObj) {
			var tmpCol = dataObj[chkColObj.column];
			if (!tmpCol && chkColObj.column) { // 수정된 부분: 상세주소는 예외로 처리
				validationMsg += "'인력 기본정보' 의 " + "'" + chkColObj.title + "'\r\n";
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
		var param = $cmManpwPqGrid.getChanges({ format: 'byVal' });

		$cmManpwPqGrid.showLoading();
		$.ajax({
			url: "/rs/manpw/saveManpwBasicInfo",
			type: "POST",
			data: JSON.stringify(param),
			contentType: 'application/json',
			dataType: 'json',
			success: function(result) {

				console.log(" result : " + result);
				console.log("JSON.stringify(param) : " + JSON.stringify(param));
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
				$cmManpwPqGrid.hideLoading();
			}
		});
	}
}




function fnSearchEditInit() {
	$(".search-edit").find("select,input, radio, textarea").val("").prop("disabled", false);
	$(".search-edit").find("select").find('option:first').prop("selected", true);

	imgInit();

	$("#wrkLicnTitle").removeClass("ic-title-nece");
	$("#wrkLicn").removeAttr("must");
}





// 이미지 노출 및 서버 전송 데이터 입력 
function setImg(vId, iId, src) {
	var div = $("#" + vId);
	var img = $("#" + vId).find("img");

	img.prop("src", src);
	div.show();

	var base64 = src.substring(src.indexOf(',') + 1, src.length);
	$("#" + iId).val(base64);

	var selectRow = gGrid.SelectRow().getSelection()[0];
	var dataIndx = common.cToS(iId).toUpperCase();

	gGrid.options.editable = true;
	gGrid.updateRow({ rowIndx: selectRow.rowIndx, newRow: { [dataIndx]: base64 } });
	gGrid.options.editable = false;
}

// 이미지 삭제 
function delImg() {
	$(this).closest(".pic-detail").hide();
	$(this).next("img").prop("src", "");
	$("#" + $(this).attr("inputId")).val("");
	$("#" + $(this).attr("inputId") + "File").val("");

	var selectRow = gGrid.SelectRow().getSelection()[0];
	var dataIndx = common.cToS($(this).attr("inputId")).toUpperCase();

	gGrid.options.editable = true;
	gGrid.updateRow({ rowIndx: selectRow.rowIndx, newRow: { [dataIndx]: "" } });
	gGrid.options.editable = false;

}

// 이미지 초기화
function imgInit() {
	$(".pic-detail").hide();
	$(".pic-detail").find("img").prop("src", "");
	$(".imgValue").val("");
}

// 그리드 초기화
function fnResetGrid() {
	$cmManpwPqGrid.option("dataModel.data", []);
	$cmManpwPqGrid.refreshDataAndView();
}

function fnCheckRequiredValue(changeGridData) {
	var addList = changeGridData.addList;
	var updateList = changeGridData.updateList;

	// console.log(addList);
	// console.log(updateList);
	updateList.forEach(function(dataObj) {
		console.log(dataObj);
		console.log("==========");
		var validationMsg = "";
		checkRequiredList.forEach(function(chkColObj) {
			console.log(chkColObj);
			var tmpCol = dataObj[chkColObj.column];
			console.log("---------------------------");
			console.log(tmpCol);
			console.log("chkColObj.column : " + chkColObj.column);
			console.log("---------------------------");
			if (!tmpCol && chkColObj.column) { // 수정된 부분: 상세주소는 예외로 처리
				validationMsg += "'인력 기본정보' 의 " + "'" + chkColObj.title + "'\r\n";
			}
		});
		if (validationMsg) {
			msg += "[" + dataObj["manpwNm"] + "]\n" + validationMsg + "\n";
		}
	});

	addList.forEach(function(dataObj) {
		var validationMsg = "";
		checkRequiredList.forEach(function(chkColObj) {
			var tmpCol = dataObj[chkColObj.column];
			if (!tmpCol && chkColObj.column) { // 수정된 부분: 상세주소는 예외로 처리
				validationMsg += "'인력 기본정보' 의 " + "'" + chkColObj.title + "'\r\n";
			}
		});
		if (validationMsg) {
			msg += "[" + (dataObj["addRowIdx"] + 1) + "] 번째 행 \n" + validationMsg + "\n";
		}
	});

	console.log(msg);

	return msg;
}

function fnDetailViewClear() {
	$(".pic-detail").hide();
	$(".bxslider-div").hide();
	var $searchEdit = $(".search-edit");
	$searchEdit.find("select").find('option:first').prop("selected", true);
	$searchEdit.find("input").val("");
	$searchEdit.find("select,input").prop("disabled", false);
}