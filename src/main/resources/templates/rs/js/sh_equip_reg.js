console.log("스크립트 START : " + window.location.href);

// var rowData = null; //기존값 전역변수
var grid;
var detailGrid = null;
var colModel;

var colModelF = [
	{ title: "기자재구분", align: "center", dataType: "string", dataIndx: "EQUIP_CD_NM" },
	{ title: "기자재업체", align: "center", dataType: "string", dataIndx: "CP_CD" },
	{ title: "사업자등록번호", align: "center", dataType: "string", dataIndx: "BR_NO" },
	{ title: "기자재ID", align: "center", dataType: "string", dataIndx: "EQUIP_ID" },
	{ title: "기자재명", align: "center", dataType: "string", dataIndx: "EQUIP_NM" },
	{ title: "차량형식", align: "center", dataType: "string", dataIndx: "FKLIFT_CD_NM" },
	{ title: "총 중량(KG)", align: "center", dataType: "string", dataIndx: "FKLIFT_WGT" },
	{ title: "마스트(단)", align: "center", dataType: "string", dataIndx: "FKLIFT_MST_NM" },
	{ title: "최대올림 높이", align: "center", dataType: "string", dataIndx: "FKLIFT_HGT" },
	{ title: "제조년도", align: "center", dataType: "string", dataIndx: "MAKE_YEAR" },
	{ title: "제조사", align: "center", dataType: "string", dataIndx: "MAKE_CP_NM" },
	{ title: "모델명", align: "center", dataType: "string", dataIndx: "FKLIFT_MODEL" },
	{ title: "시리얼번호", align: "center", dataType: "string", dataIndx: "FKLIFT_SERIAL_NO" },
	{ title: "충전기포함여부", align: "center", dataType: "string", dataIndx: "CHGR_YN_NM" },
	{ title: "기사포함여부", align: "center", dataType: "string", dataIndx: "DRIVER_YN_NM" }
];

var colModelK = [
	{ title: "기자재구분", align: "center", dataType: "string", dataIndx: "EQUIP_CD_NM" },
	{ title: "기자재업체", align: "center", dataType: "string", dataIndx: "CP_CD" },
	{ title: "기자재명", align: "center", dataType: "string", dataIndx: "EQUIP_NM" },
	{ title: "사업자등록번호", align: "center", dataType: "string", dataIndx: "BR_NO" },
	{ title: "대차종류", align: "center", dataType: "string", dataIndx: "KART_CD_NM" },
	{ title: "대차타입", align: "center", dataType: "string", dataIndx: "KART_TYP_NM" },
	{ title: "적재중량", align: "center", dataType: "string", dataIndx: "KART_WGT" },
	{ title: "대차규격", align: "center", dataType: "string", dataIndx: "KART_STD" },
	{ title: "제조년도", align: "center", dataType: "string", dataIndx: "MAKE_YEAR" },
	{ title: "제조사명", align: "center", dataType: "string", dataIndx: "MAKE_CP_NM" },
];

var colModelP = [
	{ title: "기자재구분", align: "center", dataType: "string", dataIndx: "EQUIP_CD_NM" },
	{ title: "기자재업체", align: "center", dataType: "string", dataIndx: "CP_CD" },
	{ title: "기자재명", align: "center", dataType: "string", dataIndx: "EQUIP_NM" },
	{ title: "사업자등록번호", align: "center", dataType: "string", dataIndx: "BR_NO" },
	{ title: "파레트구분", align: "center", dataType: "string", dataIndx: "PLT_CD_NM" },
	{ title: "파레트타입", align: "center", dataType: "string", dataIndx: "PLT_TYP_CD_NM" },
	{ title: "파레트중량", align: "center", dataType: "string", dataIndx: "PLT_WGT" },
	{ title: "파레트규격", align: "center", dataType: "string", dataIndx: "PLT_STD" },
	{ title: "제조년도", align: "center", dataType: "string", dataIndx: "MAKE_YEAR" },
	{ title: "제조사명", align: "center", dataType: "string", dataIndx: "MAKE_CP_NM" },
];

$(function() {
	//   -----'조회' 버튼클릭시 이벤트-----   //
	$('#searchButton').click(search);
	$(".search-conditions input").keydown(function(e) {
    if (e.keyCode == 13) {
        $("#searchButton").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
    }
});
	//   -----'조회쪽 기자재구분 SELECT박스'' 버튼클릭시 이벤트-----   //
	$('#equipCdS').change(selectBoxSet);
	//   -----기자재 등록 / 수정라인-----   //
	$(".inBtn").click(saveSh);

	//공통코드 세팅******
	common.setCommCode($("#shPrdCls"), "SH_PRD_CLS", '', 1);//공통코드 세팅
	common.setCommCode($("#equipCdS"), "EQUIP_CD", null, 3, selectBoxSet);//공통코드 세팅
	common.setNumOnly("shPrc", "shQty");//숫자만
	common.setNumOnlyWithComma("shPrc", "shQty");//숫자만-콤마처리
	common.setCommCode($("#shareUseYnS"), "SH_USE_YN", null, 2, function(dataList) {
		$(this).find("option[value=D]").remove();//'삭제' 옵션제거
	});

	//공통코드 세팅******

	//초기화버튼(조회부분)
	$('#clearButton').click(clearButton);
	//초기화버튼(디테일)
	$('#wrReset').click(wrReset);

	//그리드
	setCmGrid();
});


function showLoad() {
	$("#sh_equip_reg_pqgrid_div").pqGrid("option", "strLoading", "Loading..");
	$("#sh_equip_reg_pqgrid_div").pqGrid("showLoading");

}
function hideLoad() {
	$("#sh_equip_reg_pqgrid_div").pqGrid("hideLoading");
	$("#sh_equip_reg_pqgrid_div").pqGrid("option", "strLoading", $.paramquery.pqGrid.defaults.strLoading);
}

function search() {
	var param = common.makeConditionsParam();//조회조건 파라미터

	$.ajax({
		url: '/rs/equip/getShEquipList',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(param),
		beforeSend: function(jqXHR, settings) {
			showLoad();
		},
		success: function(result) {
			$("#sh_equip_reg_pqgrid_div").pqGrid("option", "dataModel.data", result);
			$("#sh_equip_reg_pqgrid_div").pqGrid("refreshDataAndView");
			resetSearch();

		},
		error: function(error) {
			hideLoad();
		},
		complete: function() {
			hideLoad();
		}
	});
}

function clearButton() {
	searchInit();
	gridInit();
}

function wrReset() {
	searchInit();
	gridDetailInit();
}
function searchInitPart() {
	$(".setting-grid").find("select:not(#equipCdS,#equipCpCodeS,#shareUseYnS,#useYnS), input:not(#equipType,#equipCd,#equipIdS,#equipComNumS), radio, textarea").val("");
	$(".info-edit").find("select").prop("selectedIndex",0);
}
function searchInit() {
	$(".setting-grid").find("select:not(#equipCdS), input, radio, textarea").val("");
	$(".info-edit").find("select").prop("selectedIndex",0);
	$('#previewImage').attr('src', '').hide();  // 빈 문자열로 설정
}
function resetSearch() {
	$('#previewImage').attr('src', '').hide();  // 빈 문자열로 설정	
	gridDetailInit();
	searchInitPart();	
}


// 그리드 초기화
function gridInit() {
	// rowData = null;

	$("#sh_equip_reg_pqgrid_div").pqGrid("option", "dataModel.data", []);
	$("#sh_equip_reg_pqgrid_div").pqGrid("refreshDataAndView");

	$("#sh_equip_reg_pqgrid_div_detail").pqGrid("option", "dataModel.data", []);
	$("#sh_equip_reg_pqgrid_div_detail").pqGrid("refreshDataAndView");
}

// 그리드 초기화
function gridDetailInit() {
	// rowData = null;
	$("#sh_equip_reg_pqgrid_div_detail").pqGrid("option", "dataModel.data", []);
	$("#sh_equip_reg_pqgrid_div_detail").pqGrid("refreshDataAndView");
}
function setCmGrid() {
	var colModel = [
		{title:"기자재 구분",align:"center",dataType:"string",dataIndx:"EQUIP_CD_NM"},
		{title:"기자재 명",align:"center",dataType:"string",dataIndx:"EQUIP_NM"},
		{title:"공유여부",align: "center",dataType:"string",dataIndx:"SH_USE_YN_NM" },
		{dataIndx: "shPrdCls", hidden: true },
		{dataIndx: "shPrd", hidden: true },
		{dataIndx: "shPrc", hidden: true },
		{dataIndx: "shQty", hidden: true },
		{dataIndx: "shSqu", hidden: true },
		{dataIndx: "shLkCls", hidden: true },
		{dataIndx: "shLtDt", hidden: true },
		{dataIndx: "shUseYn", hidden: true },
		{dataIndx: "shNo", hidden: true },
		{dataIndx: "editShUseYn", hidden: true },

	];
	var options = {
		width: '100%',
		height: '99%',
		colModel: colModel,
		showTop: false,
		scrollModal: "auto",
		dataModel: { data: [], recIndx: "EQUIP_ID" },
		editable: false,
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		trackModel: { on: true },
		selectionModel: {
			type: "row",
			mode: "single"
		},
		cellClick: gridCellClick,
		beforeCellClick:function(event, ui){
			var selectRow = grid.SelectRow().getSelection()[0];
			if(selectRow){
				fnSetDataForGrid(selectRow);
			}
		}
	};
	//var grid = $("#pqgrid_div").pqGrid(obj);
	var gridId = "sh_equip_reg_pqgrid_div";//그리드 ID
	this.gridCmmn = new GridUtil(colModel, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridCmmn.open();//그리드 생성
	this.grid = gridCmmn.getGrid();//그리드 객체
}

function fnSetDataForGrid(selectRow){
	if(!selectRow){
		return;
	}
	var rowIndx = selectRow.rowIndx;
	var rowData = selectRow.rowData;
	var newData = {};

	if(rowData.shUseYn === "A" || rowData.shUseYn === "S"){
		return;
	}

	grid.options.editable = true;//수정모드
	$(".info-edit").find("select,input,radio,textarea").each(function() {
		var thisVal = $("#"+this.id).val();
		thisVal = !thisVal?"":thisVal.replace(/\,/g, "");
		var rowVal = rowData[this.id];

		if((!rowVal && thisVal) || (rowVal && (rowVal != thisVal))){
			newData[this.id] = thisVal;
		}
	});

	grid.updateRow({rowIndx:rowIndx,newRow:newData});
	//조회 데이터 수정
	grid.options.editable = false;//수정모드 종료
}

function gridCellClick(event, ui) {
	$(".info-edit").find("select,input,radio,textarea").val("");
	$(".info-edit").find("select").each(function(index){
		$(this).find("option:eq(0)").prop("selected", true);
	});
	var rowData = ui.rowData;
	setDetailGrid(rowData);

	if (rowData["shUseYn"] === 'S' || rowData["shUseYn"] === 'A') {
		$(".info-edit").find("select,input,radio,textarea").prop("disabled", true);
	} else {
		$(".info-edit").find("select,input,radio,textarea").prop("disabled", false);
	}
	common.setValToComp(rowData);   //sh정보

	var shUseYn = rowData.shUseYn;
	var editShUseYn = shUseYn;

	if(shUseYn === "E" && !rowData.editShUseYn){
		editShUseYn = 'E';
	}

	if(shUseYn === "E"){
		$("#editShUseYn option").remove();
		$("#editShUseYn").append($('<option/>', {value:'E', text:'종료'}));
		$("#editShUseYn").append($('<option/>', {value:'R', text:'등록'}));
		$("#editShUseYn").val(editShUseYn);
	}else if(!shUseYn){
		$("#editShUseYn option").remove();
		$("#editShUseYn").append($('<option/>', {value:'', text:'미등록'}));
		$("#editShUseYn").append($('<option/>', {value:'R', text:'등록'}));
		$("#editShUseYn").val(editShUseYn);
	}else{
		$("#editShUseYn option").remove();
		$("#editShUseYn").append($('<option/>', {value:shUseYn, text:rowData.SH_USE_YN_NM}));
		$("#editShUseYn").prop("disabled", true);
	}
}

function setDetailGrid(params) {
	if(detailGrid) detailGrid.destroy();//초기화
	var colModel = colModelK;
	var equipCd = params.EQUIP_CD;
	var equipId = params.EQUIP_ID;

	if(equipCd === 'F'){
		colModel = colModelF;
	}else if(equipCd === "P") {
		colModel = colModelP;
	}

	var options = {
		width: '100%',
		height: 'flex',
		showTop: false,
		colModel: colModel,
		dataModel: { data: [] },
		editable: false,
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
	};
	var gridId = "sh_equip_reg_pqgrid_div_detail";//그리드 ID
	var progNm = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	var gridCmmn = new GridUtil(colModel, progNm, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	gridCmmn.open();//그리드 생성
	this.detailGrid = gridCmmn.getGrid();//그리드

	if(equipId){
		var sendData = {
				'equipId': equipId,
				'equipCd': equipCd,
		};

		$.ajax({
			url: '/rs/equip/selectAdEquip',  // 해당 기자재의 부가 정보를 제공하는 서버의 URL을 입력해주세요.
			type: 'POST',
			data: JSON.stringify(sendData),
			dataType: 'json',
			contentType: "application/json",
			beforeSend: function(jqXHR, settings) {
				showLoad();
			},
			success: function(data) {
				var newData = [];
				newData.push(data); // 또는 적절한 데이터 설정
				if (data['PHOTO_FILE']) {
					var base64Image = "data:image/png;base64," + data['PHOTO_FILE'];
					// 이미지의 소스를 base64로 된 이미지 데이터로 설정합니다.
					$('#previewImage').attr('src', base64Image).show();
				} else {
					$('#previewImage').hide();
				}
				$("#sh_equip_reg_pqgrid_div_detail").pqGrid("option", "dataModel.data", newData);
				$("#sh_equip_reg_pqgrid_div_detail").pqGrid("refreshDataAndView");

				hideLoad();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// 요청이 실패했을 때 오류 메시지를 출력합니다.
				console.error('Error:', textStatus, errorThrown);
				hideLoad();
			}
		});
	}
}


function saveSh() {

	fnSetDataForGrid(grid.SelectRow().getSelection()[0]);

	var gridChanges = grid.getChanges({ format: 'byVal' });
	var dataList = gridChanges.updateList;

	dataList = dataList.filter((data) => {
		var editShUseYn = data.editShUseYn;
		//종료상태인데 등록상태로 수정했거나 등록상태일때만.
		return ((data.sh_use_yn === "E" && editShUseYn !== "E") || editShUseYn === "R" || !editShUseYn);
	});

	if(dataList.length === 0){
		alert("수정된 내용이 없습니다.");
		return;
	}

	var mustChkColList = [
		{ column: "shPrdCls", title: "공유기간구분" },
		{ column: "shPrd", title: "공유기본기간" },
		{ column: "shQty", title: "공유기본수량" },
		{ column: "shLtDt", title: "공유시작일" },
		{ column: "editShUseYn", title: "공유여부" }
	];

	var msg = "";
	dataList.forEach(function(dataObj,index){
		var validationMsg = "";
		mustChkColList.forEach(function(chkColObj){
			var tmpCol = dataObj[chkColObj.column];
			if(chkColObj.column === "shLtDt"){
				if(fn_dateCheck(tmpCol)) {
					validationMsg += "'" + chkColObj.title + " 은 오늘 이후 여야 합니다.'\r\n";
				}
			}else if(!tmpCol || tmpCol.trim() === ""){
				validationMsg += "'" + chkColObj.title + "'\r\n";
			}
		});
		if(validationMsg){
			msg += "기자재번호 ["+dataObj["EQUIP_ID"]+"]\n"+validationMsg+"\n";
		}
	});

	if(msg){
		alert(msg + "은(는) 필수 입력값입니다.");
		return;
	}

	var param = { "dataList " : dataList};

	if (confirm("저장하시겠습니까?")) {
		$.ajax({
			type: 'POST',
			url: '/rs/equip/saveShEquip',
			data: {"gridList" : JSON.stringify(gridChanges)},
			// contentType: 'application/json',
			dataType: 'json',
			beforeSend: function(jqXHR, settings) {
				$("#sh_equip_reg_pqgrid_div").pqGrid("option", "strLoading", "Saving..");
				$("#sh_equip_reg_pqgrid_div").pqGrid("showLoading");
			},
			success: function(result) {
				alert("저장 되었습니다.");
				search();
			},
			error: function(error) {
				// 서버로부터 응답이 실패로 돌아왔을 때 실행할 코드
				console.log('Error occurred:', error);
			},
			complete: function() {
				$("#sh_equip_reg_pqgrid_div").pqGrid("hideLoading");
				$("#sh_equip_reg_pqgrid_div").pqGrid("option", "strLoading", $.paramquery.pqGrid.defaults.strLoading);
			}
		});

	}
}

function selectBoxSet() {
	var selectedOption = $(this).val();
	$('#select' + selectedOption).show();
	$('#previewImage').hide();
	$("#sh_equip_reg_pqgrid_div").pqGrid("option", "dataModel.data", []);
	$("#sh_equip_reg_pqgrid_div").pqGrid("refreshDataAndView");
	$('#equipSh').find('input[type="text"], input[type="date"]').val('');
	$(".info-edit").find("select").prop("selectedIndex",0);
	setDetailGrid({EQUIP_CD : $("#equipCdS").val()});
}

function setDate(){
	var today = new Date().toISOString().split('T')[0];
        $("#shLtDt").attr('min', today);
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