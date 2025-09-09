var $cmEquipPqgrid;
var bxSlider;

//기자재별 colModel
var commColModel = [
	{title:"기자재구분", align:"center", dataType:"string", dataIndx:"equipCdNm", width:100},
	{title:"기자재 명", align:"center", dataType:"string", dataIndx:"equipNm", width:100},
	{title:"사용여부", align:"center", dataType:"string", dataIndx:"USE_YN_NM", width:80},
	{title:"공유여부", align:"center", dataType:"string", dataIndx:"SH_USE_YN_NM", width:80},
	{dataIndx:"equipId", hidden:true},
	{dataIndx:"equipCd", hidden:true},
	{dataIndx:"brNo", hidden:true},
	{dataIndx:"cpCd", hidden:true},
	{dataIndx:"makeCpNm", hidden:true},
	{dataIndx:"makeYear", hidden:true},
	{dataIndx:"dtAddr", hidden:true},
	{dataIndx:"dtAddr2", hidden:true},
	{dataIndx:"areaNm1", hidden:true},
	{dataIndx:"areaNm2", hidden:true},
	{dataIndx:"longiNo", hidden:true},
	{dataIndx:"latiNo", hidden:true},
	{dataIndx:"cmPrice", hidden:true},
	{dataIndx:"useYn", hidden:true},
	{dataIndx:"shUseYn", hidden:true},
	{dataIndx:"photoFile",hidden:true},
	{dataIndx:"photoFile2",hidden:true},
	{dataIndx:"photoFile3",hidden:true},
];

var colModelF = [
	{dataIndx:"fkliftCd", hidden:true},
	{dataIndx:"fkliftWgt", hidden:true},
	{dataIndx:"fkliftMst", hidden:true},
	{dataIndx:"fkliftHgt", hidden:true},
	{dataIndx:"fkliftModel", hidden:true},
	{dataIndx:"fkliftSerialNo", hidden:true},
	{dataIndx:"chgrYn", hidden:true},
	{dataIndx:"driverYn", hidden:true}
];

var colModelK = [
	{dataIndx:"kartCd", hidden:true},
	{dataIndx:"kartTyp", hidden:true},
	{dataIndx:"kartWgt", hidden:true},
	{dataIndx:"kartStd", hidden:true}
];

var colModelP = [
	{dataIndx:"pltCd", hidden:true},
	{dataIndx:"pltTypCd", hidden:true},
	{dataIndx:"pltWgt", hidden:true},
	{dataIndx:"pltStd", hidden:true}
];

$(function() {
	$(".equipTypeK").hide();
	$(".equipTypeP").hide();
	$(".bxslider-div").hide();
	$(".search-edit").find("select,input").prop("disabled", true);

	bxSlider = $('.bxslider').bxSlider({
		speed: 500,
		pager:true,
		captions: true,
		mode:'fade',
	});
	//검색조건
	common.setCommCode($("#cmEquipEquipCd"), "EQUIP_CD", null, 3);//공통코드 세팅

	// 입력 폼
	//common.setCorpCode($("#cpCd"), null, 2);//업체
	common.setBrnoForObj($("#brNo"));//사업자등록번호
	common.setNumOnly("cmPrice", "makeYear", "fkliftWgtF", "pltWgt");//숫자만
	common.setNumOnlyWithComma("cmPrice", "fkliftHgt", "pltWgt");//숫자만-콤마처리

	// -- 지게차 --//
	common.setCommCode($("#chgrYn"), "CHGR_YN", null, 3);//공통코드 세팅
	common.setCommCode($("#driverYn"), "DRIVER_YN", null, 3);//공통코드 세팅
	common.setCommCode($("#fkliftCd"), "FKLIFT_CD", null, 3);//공통코드 세팅
	common.setCommCode($("#fkliftMst"), "FKLIFT_MST", null, 3);//공통코드 세팅
	// -- 파렛트 --//
	common.setCommCode($("#pltCd"), "PLT_CD", null, 3);//공통코드 세팅
	common.setCommCode($("#pltTypCd"), "PLT_TYP_CD", null, 3);//공통코드 세팅
	common.setCommCode($("#pltStd"), "PLT_STD", null, 3);//공통코드 세팅
	// -- 대차 --//
	common.setCommCode($("#kartCd"), "KART_CD", null, 3);//공통코드 세팅
	common.setCommCode($("#kartTyp"), "KART_TYP", null, 3);//공통코드 세팅

	fnEvent();
	//init grid
	fnInitGrid();
});

function fnEvent(){
	//기자재 구분 change
	$("#cmEquipEquipCd").change(fnChangeColModel);
	//엔터키 이벤트
	$(".search-conditions input").keydown(function(e) {
		if (e.keyCode === 13) {
			fnSearch();
		}
	});

	$("#cmEquipSearchBtn").click(fnSearch); //조회 버튼
	$('#cmEquipResetBtn').click(fnResetSearch); //초기화 버튼

	$("#cmEquipAddRowBtn").click(fnAddRow);//행추가 버튼
	$("#cmEquipDelRowBtn").click(fnDelRow);//행삭제 버튼
	$("#cmEquipCancelBtn").click(fnDetailViewClear); //취소 버튼
	$("#cmEquipSaveBtn").click(fnSaveEquip);//저장 버튼

	$('#adEquipAddImageBtn').click(() => {
		var selectRow = $cmEquipPqgrid.SelectRow().getSelection()[0];
		if(!selectRow){
			alert("선택된 기자재가 없습니다.");
			return
		}

		var rowData = selectRow.rowData;
		var shUseYn = rowData.shUseYn;

		if(shUseYn === "A" || shUseYn === "S" || shUseYn === "R"){
			alert("해당 기자재는 "+rowData.SH_USE_YN_NM+"으로 삭제 및 변경할 수 없습니다.");
			return
		}
		$("#adEquipNav").click();
		$("#adEquipPhotoFile").click();
	});

	$("#adEquipPhotoFile").change(() => {//사진등록 : 기자재 사진
		fnSetImage();
	});

	//주소 찾기 버튼
	$("#cmEquipPostCodeBtn").click(function(){
		var selectRow = $cmEquipPqgrid.SelectRow().getSelection()[0];
		if(selectRow){
			var shUseYn = selectRow.rowData.shUseYn;
			if (shUseYn !== "S" && shUseYn !== "A" && shUseYn !== "R") {
				fnPostcode();
			}
		}
	});

	$(".nav-link").click(function(){
		var navId = this.id;
		if(navId === "cmEquipNav"){
			$("#adEquipNav").removeClass("active");
			$("#cmEquipNav").addClass("active");
			$("#adEquipTabDiv").removeClass("show active").hide();
			$("#cmEquipTabDiv").addClass("show active").show();
		}else{
			$("#cmEquipNav").removeClass("active");
			$("#adEquipNav").addClass("active");
			$("#cmEquipTabDiv").removeClass("show active").hide();
			$("#adEquipTabDiv").addClass("show active").show();
		}
	});
}

/**
 * 그리드 세팅
 */
function fnInitGrid() {
	//array of columns.
	var colModel = commColModel.concat(colModelF);

	var obj = {
		width: '100%',
		height: '99%',
		colModel: colModel,
		trackModel: { on: true },
		dataModel: { data: [], recIndx: "equipId" },
		showTop: false,
		editable: false,
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		selectionModel: { type: "row", mode: "single" },
		beforeRowSelect:function(event, ui){
			fnSetDataForGrid();
		},
		rowClick: function(e, ui) {
			$(".bxslider-div").hide();
			var rowData = ui.rowData;
			var shUseYn = rowData.shUseYn;
			var $searchEdit = $(".search-edit");

			$searchEdit.find("input").val("");
			$searchEdit.find("select").find('option:first').prop("selected", true);

			common.setValToComp(rowData);

			var delBtnFlag = false;
			if (shUseYn === "S" || shUseYn === "A" || shUseYn === "R") {
				$searchEdit.find("select,input").prop("disabled", true);
			} else {
				$searchEdit.find("select,input").prop("disabled", false);
				$('.cm-equip-readonly').prop("disabled", true);
				delBtnFlag = true;
			}
			fnInitEquipPhoto(rowData, delBtnFlag);
		}
	};

	var gridId = "cmEquipPqgridDiv";//그리드 ID
	this.gridCmmn = new GridUtil(colModel, location.pathname, gridId, obj);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridCmmn.open();//그리드 생성
	$cmEquipPqgrid = gridCmmn.getGrid();//그리드 객체
}

function fnInitEquipPhoto(rowData, delBtnFlag){
	var $bxsliderDiv = $(".bxslider-div");
	var $bxslider = $(".bxslider");
	$bxslider.empty();

	var equipPhotoLength = 0;
	["photoFile","photoFile2","photoFile3"].forEach((item) => {
		if(rowData[item]){
			var $equipPhotoLi = $('<li/>');
			if(delBtnFlag){
				$equipPhotoLi.append($('<button/>', {id:item,class:'btn-pic-delete'}).click((e) => fnRemoveImage(e)));
			}
			$equipPhotoLi.append($('<img/>', {src:"data:image;base64,"+rowData[item], style:'height:600px'}));
			$bxslider.append($equipPhotoLi);
			equipPhotoLength++;
		}
	});

	if(equipPhotoLength < 1){
		return;
	}

	bxSlider.reloadSlider();
	$bxsliderDiv.show();
}

function fnSetImage(){
	var selectRow = $cmEquipPqgrid.SelectRow().getSelection()[0];
	if(!selectRow){
		alert("선택된 기자재가 없습니다.");
		return;
	}

	var rowData = selectRow.rowData;

	var equipPhotoArr = ["photoFile", "photoFile2", "photoFile3"];
	equipPhotoArr = equipPhotoArr.filter((item) => {
		return !rowData[item];
	});

	if(equipPhotoArr.length === 0){
		alert("사진은 3개까지 등록 가능합니다.");
		return;
	}

	var thisFile = $("#adEquipPhotoFile")[0].files[0];
	var reader = new FileReader();
	reader.readAsDataURL(thisFile);
	reader.onload = function() {
		var imageURI = reader.result;
		var $equipPhotoLi = $('<li/>');
		$equipPhotoLi.append($('<button/>', {id:equipPhotoArr[0], class:'btn-pic-delete new-equip-photo'}).click((e) => fnRemoveImage(e)));
		$equipPhotoLi.append($('<img/>', {src:imageURI, style:'height:600px'}));
		$(".bxslider").append($equipPhotoLi);
		bxSlider.reloadSlider();
		bxSlider.goToPrevSlide();

		var startIdx = imageURI.indexOf(',');
		imageURI = imageURI.substring(startIdx+1, imageURI.length);
		fnSetImageForGrid(selectRow, imageURI, equipPhotoArr[0]);

		$(".bxslider-div").show();
		$("#adEquipPhotoFile").val("");
	};
}

// 검색조건 기자재 구분 변경 시 colmodel 변경 이벤트
function fnChangeColModel(e){
	var equipType = $("#cmEquipEquipCd").val();
	var colModel = [];
	if(equipType === "F"){
		colModel = commColModel.concat(colModelF);
		$(".equipTypeK").hide();
		$(".equipTypeP").hide();
		$(".equipTypeF").show();
	}else if(equipType === "K"){
		colModel = commColModel.concat(colModelK);
		$(".equipTypeF").hide();
		$(".equipTypeP").hide();
		$(".equipTypeK").show();
	}else if(equipType === "P"){
		colModel = commColModel.concat(colModelP);
		$(".equipTypeF").hide();
		$(".equipTypeK").hide();
		$(".equipTypeP").show();
	}

	fnDetailViewClear();
	$(".search-edit").find("select,input").prop("disabled", true);
	fnResetGrid();
	$cmEquipPqgrid.refreshCM(colModel);
}

//조회
function fnSearch() {
	var param = common.makeConditionsParam();//조회조건 파라미터

	$.ajax({
		url: '/rs/equip/getCmEquipList',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(param),
		beforeSend: function(jqXHR, settings) {
			$cmEquipPqgrid.showLoading();
		},
		success: function(result) {
			fnDetailViewClear();
			$("#cmEquipNav").click();
			$cmEquipPqgrid.option("dataModel.data", result);
			$cmEquipPqgrid.refreshDataAndView();
		},
		error: function(error) {
			console.log('error::::' + error);
		},
		complete: function() {
			$cmEquipPqgrid.hideLoading();
		}
	});
}

//입력된 값을 grid rowData에 저장
function fnSetDataForGrid() {
	var selectRow = $cmEquipPqgrid.SelectRow().getSelection()[0];
	if (!selectRow) {
		return;
	}

	var rowIndx = selectRow.rowIndx;
	var rowData = selectRow.rowData;
	var shUseYn = rowData.shUseYn;
	if (shUseYn === "Y" || shUseYn === "S" || shUseYn === "R") {
		return;
	}

	var newData = {};
	var colModel = $cmEquipPqgrid.getColModel();

	var removeDataIndxArr = ['USE_YN_NM', 'SH_USE_YN_NM', 'equipId', 'shUseYn',"photoFile", "photoFile2", "photoFile3"];
	var setDataArr = colModel.filter((item) => {
		return removeDataIndxArr.includes(item.dataIndx) === false;
	});
	setDataArr.forEach((item) => {
		var dataIndx = item.dataIndx;
		var elValue = $("#"+item.dataIndx).val();
		newData[dataIndx] = elValue;

		if(dataIndx === "cmPrice" && !elValue){
			newData[dataIndx] = "0";
		}
	});

	$cmEquipPqgrid.options.editable = true;//수정모드
	$cmEquipPqgrid.updateRow({rowIndx: rowIndx, newRow: newData});
	//조회 데이터 수정
	$cmEquipPqgrid.options.editable = false;//수정모드 종료
}

function fnRemoveImage(e){
	if(confirm("삭제하시겠습니까?")){
		var selectRow = $cmEquipPqgrid.SelectRow().getSelection()[0];
		var targetEl = $("#"+e.target.id);
		if(selectRow.rowData.equipId){
			alert("저장버튼을 눌러야 삭제됩니다.");
		}
		targetEl.parent().remove();
		if($(".bxslider > li").length === 0){
			$(".bxslider-div").hide();
		}
		fnSetImageForGrid(selectRow, null, e.target.id);
		bxSlider.reloadSlider();
	}
}

function fnSetImageForGrid(selectRow, imageURI, dataIndx){
	$cmEquipPqgrid.options.editable = true;//수정모드
	var newRow = {};
	newRow[dataIndx] = imageURI;
	$cmEquipPqgrid.updateRow({rowIndx: selectRow.rowIndx, newRow: newRow});
	//조회 데이터 수정
	$cmEquipPqgrid.options.editable = false;//수정모드 종료
}

/*
 * 그리드 ROW 추가
 */
function fnAddRow() {
	fnSetDataForGrid();

	var addRowIdx = $cmEquipPqgrid.pageData().length;
	$cmEquipPqgrid.addRow({
		rowIndx: addRowIdx,
		newRow: {'addRowIdx':addRowIdx }
	});

	$cmEquipPqgrid.options.editable = true;//수정모드
	$cmEquipPqgrid.updateRow({
		rowIndx: addRowIdx,
		newRow: {
			'equipCd':$("#cmEquipEquipCd").val(),
			'equipCdNm':$("#cmEquipEquipCd :selected").text(),
			'cmPrice':"0"
		}
	});
	//조회 데이터 수정
	$cmEquipPqgrid.options.editable = false;//수정모드 종료

	if($cmEquipPqgrid.SelectRow().getSelection()[0]){
		$cmEquipPqgrid.setSelection( null );
	}
	fnDetailViewClear();

	$cmEquipPqgrid.setSelection({rowIndx: addRowIdx});
	common.setValToComp($cmEquipPqgrid.getRowData({rowIndx: addRowIdx}));
}

/*
 * 그리드 ROW 삭제
 */
function fnDelRow() {
	var selectRow = $cmEquipPqgrid.SelectRow().getSelection()[0];
	var rowData = selectRow.rowData;
	var shUseYn = rowData.shUseYn;

	if(!selectRow){
		alert("선택한 창고가 없습니다.");
		return;
	}

	if (shUseYn === "S" || shUseYn === "R"|| shUseYn === "A") {
		alert("해당 기자재는 공유"+rowData.SH_USE_YN_NM+" 으로 수정 및 삭제할 수 없습니다.");
		return;
	}

	if(!rowData.equipId){
		if(confirm("입력한 내용이 삭제됩니다.\n삭제하시겠습니까?")){
			$cmEquipPqgrid.deleteRow({rowIndx: selectRow.rowIndx});
		}
	}else{
		if(confirm("삭제하시겠습니까?")) {
			$cmEquipPqgrid.deleteRow({rowIndx: selectRow.rowIndx});
			fnDetailViewClear();
			alert("행 삭제 후 저장 버튼을 클릭하세요");
		}
	}
}

function fnSaveEquip() {
	fnSetDataForGrid();

	if (!$cmEquipPqgrid.isDirty()) {
		alert("수정된 내용이 없습니다.");
		return;
	}

	var param = $cmEquipPqgrid.getChanges({ format: 'byVal' });
	var msg = fnCheckRequiredValue(param);

	if(msg){
		alert(msg + "은(는) 필수 입력값입니다.");
		return;
	}

	param.equipCd = $("#cmEquipEquipCd").val();
	if(confirm("저장하시겠습니까?")) {
		$.ajax({
			type: 'POST',
			url: '/rs/equip/saveCmEquip',
			data: JSON.stringify(param),
			contentType: 'application/json',
			dataType: 'json',
			beforeSend: function(jqXHR, settings) {
				$cmEquipPqgrid.showLoading();
			},
			success: function(result) {
				var changeGridData = param.addList.length + param.updateList.length + param.deleteList.length;

				if(changeGridData !== result.saveCnt){
					alert("기자재 저장중 오류가 발생했습니다.");
					return;
				}

				alert("저장 되었습니다.");
				fnSearch();
			},
			error: function(error) {
				// 서버로부터 응답이 실패로 돌아왔을 때 실행할 코드
				console.log('Error occurred:', error);
			},
			complete: function() {
				$cmEquipPqgrid.hideLoading();
			}
		});
	}
}

//필수값체크
function fnCheckRequiredValue(changeGridData) {
	var equipCd = $("#cmEquipEquipCd").val();
	var fnCheckRequiredList = [];

	if (equipCd === 'F') {
		fnCheckRequiredList = [
			{ column: "equipNm", title: "기자재명" },
			{ column: "cpCd", title: "기자재업체" },
			{ column: "makeCpNm", title: "제조사" },
			{ column: "fkliftCd", title: "차량형식" },
			{ column: "fkliftMst", title: "마스트" },
			{ column: "fkliftModel", title: "모델명" },
			{ column: "dtAddr", title: "주소" }
		];

	} else if (equipCd === 'P') {
		fnCheckRequiredList = [
			{ column: "equipNm", title: "기자재명" },
			{ column: "cpCd", title: "기자재업체" },
			{ column: "pltCd", title: "파레트구분" },
			{ column: "pltTypCd", title: "파레트타입" },
			{ column: "dtAddr", title: "주소" }
		];
	} else {
		fnCheckRequiredList = [
			{ column: "equipNm", title: "기자재명" },
			{ column: "cpCd", title: "기자재업체" },
			{ column: "kartCd", title: "대차종류" },
			{ column: "kartWgt", title: "적재중량" },
			{ column: "dtAddr", title: "주소" }
		];
	}
	var addList = changeGridData.addList;
	var updateList = changeGridData.updateList;

	var msg = "";
	updateList.forEach(function (dataObj) {
		var validationMsg = "";
		fnCheckRequiredList.forEach(function (chkColObj) {
			var tmpCol = dataObj[chkColObj.column];
			if (!tmpCol && chkColObj.column) { // 수정된 부분: 상세주소는 예외로 처리
				validationMsg += "'기자재 기본정보' 의 " + "'" + chkColObj.title + "'\r\n";
			}
		});
		if(validationMsg){
			msg += "["+dataObj["equipNm"]+"]\n"+validationMsg+"\n";
		}
	});

	addList.forEach(function (dataObj) {
		var validationMsg = "";
		fnCheckRequiredList.forEach(function (chkColObj) {
			var tmpCol = dataObj[chkColObj.column];
			if (!tmpCol && chkColObj.column) { // 수정된 부분: 상세주소는 예외로 처리
				validationMsg += "'기자재 기본정보' 의 " + "'" + chkColObj.title + "'\r\n";
			}
		});
		if(validationMsg){
			msg += "["+(dataObj["addRowIdx"]+1)+"] 번째 행 \n"+validationMsg+"\n";
		}
	});

	return msg;
}

function fnResetSearch() {
	$(".search-conditions").find("select").find('option:first').prop("selected", true);
	$(".search-conditions").find("input").val("");
	fnDetailViewClear();
	fnResetGrid();
}

function fnDetailViewClear() {
	$(".search-edit").find("select,input").val("").prop("disabled", false);
	$(".search-edit").find("select").find('option:first').prop("selected", true);
	$(".cm-equip-readonly").prop("disabled", true);
}

// 그리드 초기화
function fnResetGrid() {
	$cmEquipPqgrid.option("dataModel.data", []);
	$cmEquipPqgrid.refreshDataAndView();
}

function fnPostcode() {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
			var addr = data.userSelectedType==="R"?data.roadAddress:data.jibunAddress;

			// 주소 정보를 해당 필드에 넣는다.
			$("#dtAddr").val(addr);
			$("#areaNm1").val(data.sido);
			$("#areaNm2").val(data.sigungu);
			$("#dtAddr2").focus();

			//위경도
			var geocoder = new kakao.maps.services.Geocoder();
			var callback = function(result, status) {
				if (status === kakao.maps.services.Status.OK) {
					$("#longiNo").val(result[0].x);
					$("#latiNo").val(result[0].y);
				}
			};
			geocoder.addressSearch(data.roadAddress, callback);
		}
	}).open();
}