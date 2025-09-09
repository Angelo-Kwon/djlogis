/*
 * 전역변수
 */
var grid;
var sub_grid;

$(function () {

	common.setNumOnly("edit_sh_flr", "edit_sh_squ", "edit_sh_prd", "edit_sh_prc");//숫자만 :: 공유층수
	common.setNumOnlyWithComma("edit_sh_flr", "edit_sh_squ", "edit_sh_prd", "edit_sh_prc");//숫자만-콤마처리 :: 공유층수

	common.setCommCode($("#edit_sh_rng_cls"),"SH_RNG_CLS", null, 1);
	common.setCommCode($("#edit_sh_lk_cls"),"SH_LK_CLS", null, 1);
	common.setCommCode($("#edit_sh_prd_cls"),"SH_PRD_CLS", null, 1);

	fnEvent();
	setGrid();
	setSubGrid();

});

// grid 기본 셋팅
function setGrid() {
	var autoCompleteEditor = function (ui) {
		var $inp = ui.$cell.find("input");

		//initialize the editor
		$inp.autocomplete({
			source: ["종료", "등록"],
			selectItem: { on: true }, //custom option
			highlightText: { on: true }, //custom option
			minLength: 0
		}).focus(function () {
			//open the autocomplete upon focus
			$(this).autocomplete("search", "");
		});
	}

	var columns = [
		{ title: "창고명",      dataType: "string", dataIndx: "WH_NM",    align: "left" },
		{ title: "지역(시/군/구)", dataType: "string", dataIndx: "AREA_NM2", align: "left" },
		{ title: "공유여부", dataType: "string", dataIndx: "sh_use_yn_nm", align: "center" },
		{ title: "지역(시/도)",  dataType: "string", dataIndx: "AREA_NM1", align: "left" ,hidden:true },
		{ title: 'edit_sh_prc', dataType: "string",dataIndx: "edit_sh_prc",hidden:true},
		{ title: 'edit_sh_flr', dataType: "string",dataIndx: "edit_sh_flr",hidden:true},
		{ title: 'edit_sh_lk_cls', dataType: "string",dataIndx: "edit_sh_lk_cls",hidden:true},
		{ title: 'edit_sh_lt_dt',dataType: "string", dataIndx: "edit_sh_lt_dt",hidden:true},
		{ title: 'edit_sh_prd', dataType: "string",dataIndx: "edit_sh_prd",hidden:true},
		{ title: 'edit_sh_prd_cls',dataType: "string", dataIndx: "edit_sh_prd_cls",hidden:true},
		{ title: 'edit_sh_rng_cls',dataType: "string", dataIndx: "edit_sh_rng_cls",hidden:true},
		{ title: 'edit_sh_squ', dataType: "string",dataIndx: "edit_sh_squ",hidden:true},
		{ title: 'sh_use_yn',dataType: "string", dataIndx: "sh_use_yn",hidden:true},
		{ title: 'edit_sh_use_yn',dataType: "string", dataIndx: "edit_sh_use_yn",hidden:true}
	]


	var options = {
		width: '100%',
		height: '99%',
		//important option
		editable: false,
		showTop: false,
		selectionModel: { type: 'row', mod:'single' },
		trackModel: {on:true},
		dataModel: { data: [], recIndx: "WH_ID" },
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		cellClick: fnSearchDetail,
		beforeCellClick:function(event, ui){
			var selectRow = grid.SelectRow().getSelection()[0];
			if(selectRow){
				fnSetDataForGrid(selectRow);
			}
		}
	}

	var gridId = "sh_whouse_reg_pqgrid_div";//그리드 ID
	this.gridCmmn = new GridUtil(columns, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridCmmn.open();//그리드 생성
	this.grid = gridCmmn.getGrid();//그리드 객체
}

function setSubGrid() {
	var sub_columns = [
		{ title: "지역(시/도)",  dataType: "string", dataIndx: "AREA_NM1",  align: "center" ,hidden:true },
		{ title: "지역(시/군/구)",dataType: "string", dataIndx: "AREA_NM2",  align: "center" },
		{ title: "상세주소",     dataType: "string", dataIndx: "DT_ADDR",   align: "center" },
		{ title: "전체층수",     dataType: "string", dataIndx: "TL_FL_NUM", align: "center" },
		{ title: "지하층수",     dataType: "string", dataIndx: "UD_FL_NUM", align: "center" },
		{ title: "대지면적",     dataType: "string", dataIndx: "LOT_AREA",  align: "center" },
		{ title: "연면적",      dataType: "string", dataIndx: "TL_AREA",   align: "center" }
	] ;

	var sub_options = {
		width: '100%',
		height: 'flex',
		//important option
		selectionModel: { type: 'row', mod:'single' },
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		showTop: false
	};

	var sub_gridId = "sh_whouse_reg_pqgrid_sub_div";//그리드 ID
	this.gridSubCmmn = new GridUtil(sub_columns, location.pathname, sub_gridId, sub_options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridSubCmmn.open();//그리드 생성
	this.sub_grid = gridSubCmmn.getGrid();//그리드 객체
}



// event 영역
function fnEvent() {
	// 조회 버튼
	$("#btnSearch").on("click", function() {
		fnSearch();
	});
	
	$(".search-conditions input").keydown(function(e) {
	if (e.keyCode == 13) {
        $("#btnSearch").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
    }
});
	

	// 전체 초기화 버튼
	$("#btnReset").on("click", function() {
		$("[id^='sch']").val("");
		gridInit();
		subGridInit();
		fnEditReset();
	});

	// 입력부분 초기화 버튼
	$("#btnWhouseReset").on("click", function() {
		subGridInit();
		fnEditReset();
	});

	// 저장 버튼
	$("#btnSave").on("click", function() {
		fnSave();
	});

	// 공유 시작일 변경 되면 check
	$("#edit_sh_lt_dt").on("change", function() {
		if(fn_dateCheck($(this).val())) {
			alert("공유시작일은 오늘 이후 여야 합니다.");
			$("#edit_sh_lt_dt").focus();
			return;
		}
	});
}

// 조회조건 기준 창고 기본 정보 조회(grid)
function fnSearch() {
	var param = common.makeConditionsParam();//조회조건 파라미터

	$.ajax({
		type:"POST",
		dataType:"json",
		url:"/rs/whouse/selectShWhouseDetailInfo",
		data:param,
		beforeSend: function() {
			grid.option("strLoading", "Loding...")
			grid.showLoading();
		},
		success:function(data, status, res){
			//오류확인
			if(data.error){
				alert(data.error);
				return;
			}
			//데이터 초기화
			gridInit();
			subGridInit();
			fnEditReset();

			//데이터 ADD
			var gridDataList = data.dataList;
			console.log(data.dataList);
			grid.option("dataModel.data", gridDataList);
			grid.refreshDataAndView();
		},
		error:function(e){
			alert(e);
		},
		complete:function(e){
			//로딩바 HIDE
			grid.hideLoading();
		}
	});
}

function fnSetDataForGrid(selectRow){
	var rowIndx = selectRow.rowIndx;
	var rowData = selectRow.rowData;
	var newData = {};
	if(rowData.sh_use_yn === "A" || rowData.sh_use_yn === "S"){
		return;
	}

	grid.options.editable = true;//수정모드
	$("[id^='edit']").each(function() {
		var thisVal = $("#"+this.id).val().replace(/\,/g, "");
		var rowVal = rowData[this.id];
		thisVal = !thisVal?"":thisVal;
		if((!rowVal && thisVal) || (rowVal && (rowVal != thisVal))){
			newData[this.id] = thisVal;
		}
	});

	grid.updateRow({rowIndx:rowIndx,newRow:newData});
	//조회 데이터 수정
	grid.options.editable = false;//수정모드 종료
}

// grid 에서 선택한 row의 상세 창고 정보 조회
function fnSearchDetail(event, ui) {
	var rowData = ui.rowData;

	//EDTIS 초기화
	$("[id^='edit']").val("");
	//데이터 그리드SUB 데이터 추가
	sub_grid.option("editable", true);
	sub_grid.deleteRow({rowList:[{rowIndx: 0 }]});
	sub_grid.addRow(
		{newRow:rowData}
	);
	//SELECTBOX 첫 번째 항목으로 세팅
	$(".info-edit").find("select").each(function(index){
			$(this).find("option:eq(0)").prop("selected", true);
		}
	);
	sub_grid.option("editable", false);
	//DATA TO 콤포넌트 맵핑
	common.setValToComp(rowData);
	if(rowData["sh_use_yn"] === "S" || rowData["sh_use_yn"] === "A") {
		$("[id^='edit']").prop("disabled",true);
	}else{
		$("[id^='edit']").prop("disabled",false);
	}

	//이미지 세팅
	if(rowData){
		if(rowData["WRK_PHTO"]) {
			$("#wrkPhto").prop("style", "width:100%; height:475px;")
			$("#wrkPhto").prop("src", "data:image;base64," + rowData["WRK_PHTO"]);
		} else {
			$("#wrkPhto").prop("src", "");
			$("#wrkPhto").prop("style", "");
		}
	}

	var shUseYn = rowData.sh_use_yn;
	var editShUseYn = shUseYn;

	if(shUseYn === "E" && !rowData.edit_sh_use_yn){
		editShUseYn = 'E';
	}

	if(shUseYn === "E"){
		$("#edit_sh_use_yn option").remove();
		$("#edit_sh_use_yn").append($('<option/>', {value:'E', text:'종료'}));
		$("#edit_sh_use_yn").append($('<option/>', {value:'R', text:'등록'}));
		$("#edit_sh_use_yn").val(editShUseYn);
	}else if(!shUseYn){
		$("#edit_sh_use_yn option").remove();
		$("#edit_sh_use_yn").append($('<option/>', {value:'', text:'미등록'}));
		$("#edit_sh_use_yn").append($('<option/>', {value:'R', text:'등록'}));
		$("#edit_sh_use_yn").val(editShUseYn);
	}else{
		$("#edit_sh_use_yn option").remove();
		$("#edit_sh_use_yn").append($('<option/>', {value:shUseYn, text:rowData.sh_use_yn_nm}));
		$("#edit_sh_use_yn").prop("disabled", true);
	}
}

// 창고 공유정보 저장.
function fnSave() {
	fnSetDataForGrid(grid.SelectRow().getSelection()[0]);

	var gridChanges = grid.getChanges({ format: 'byVal' });
	var dataList = gridChanges.updateList;

	console.log(dataList);
	dataList = dataList.filter((data) => {
		var editShUseYn = data.edit_sh_use_yn;
		console.log(editShUseYn);
		//종료상태인데 등록상태로 수정했거나 등록상태일때만.
		return ((data.sh_use_yn === "E" && editShUseYn !== "E") || editShUseYn === "R" || !editShUseYn);
	});

	if(dataList.length === 0){
		alert("수정된 내용이 없습니다.");
		return;
	}

	//필수체크
	var mustChkColList = [
		{column:"edit_sh_rng_cls",title:"공유범위구분"},
		{column:"edit_sh_lk_cls",title:"공유랙구분"},
		{column:"edit_sh_prd_cls",title:"공유기간구분"},
		{column:"edit_sh_prd",title:"공유기본기간"},
		{column:"edit_sh_use_yn",title:"공유여부"}
	];
	var msg = "";
	// var updateList = gridChanges.updateList;
	dataList.forEach(function(dataObj,index) {
		var validationMsg = "";
		mustChkColList.forEach(function(chkColObj) {
			var tmpCol = dataObj[chkColObj.column];
			if(!tmpCol || tmpCol === "") {
				validationMsg += "'창고 정보의' " + chkColObj.title + "'\r\n";
			}
		});
		if(validationMsg){
			msg += "["+dataList[index]["WH_NM"]+"]\n"+validationMsg+"\n";
		}
	});

	if(msg){
		alert(msg + "은(는) 필수 입력값입니다.");
		return;
	}

	let chkDate = fn_dateCheck($("#edit_sh_lt_dt").val());
	if(chkDate) {
		alert("공유게시기한은 오늘 이후 여야 합니다.");
		$("#edit_sh_lt_dt").focus();
		return;
	}
	//파라미터
	var param = {
		dataList : dataList
	}
	//호출
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"/rs/whouse/saveShWhouseDetailInfo",
		data: JSON.stringify(param),
		contentType : 'application/json; charset=utf-8',
		//로딩바 SHOW
		beforeSend: function() {
			grid.option("strLoading", "Loding...")
			grid.showLoading();
		},
		success:function(data, status, res){
			//오류확인
			if(data.error){
				alert(data.error);
				return;
			}
			//결과 알람
			alert("저장 되었습니다.");
			//조회
			fnSearch();

		},
		error:function(e){
			alert(e);
		},
		complete:function(e){
			//로딩바 HIDE
			grid.hideLoading();
		}
	});
}

// 공유정보 입력 부분 초기화
function fnEditReset() {
	$("[id^='edit']").val("");
	$("#wrkPhto").prop("src", "");
	$("#wrkPhto").prop("style", "");
}

function gridInit() {
	grid.option("dataModel.data", []);
	grid.refreshDataAndView();
}

function subGridInit() {
	sub_grid.option("dataModel.data", []);
	sub_grid.refreshDataAndView();
}

// 필수 값 항목 체크
function fnValCheck() {
	let result = true;
	$("[id^='edit']").each(function() {
		let id = "#"+this.id;
		let name = $(id).attr("alt");

		if(!$(id).is(":disabled")) {
			if($(id).val() == "")
			{
				alert("필수 입력값인 "+name+" 항목이 입력되지 않았습니다.");
				this.focus();
				result = false;
				return false;
			}
		}
	});
	return result;
}

function fn_dateCheck(vDate) {
	let date = new Date();
	let year = date.getFullYear();
	let month = new String(date.getMonth()+1);
	let day = new String(date.getDate());
	let tDay;
	let chkResult = false;

	// 한자리수일 경우 앞에 0을 채워준다.
	if(month.length === 1){
		month = '0' + month;
	}
	if(day.length === 1){
		day = '0' + day;
	}

	tDay = year+"-"+month+"-"+day;
	if(vDate <= tDay) {
		chkResult = true;
	}

	return chkResult;
} 