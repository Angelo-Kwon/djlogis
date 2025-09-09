var gMsg = {  // [r, c, u, d][c, s, f]||[cm]_[99] // [read, create, update, delete][confirm, success, fail] or [common]
	kr: {
		rs_01: "조회되었습니다.",
		rf_01: "조회 시 문제가 발생하였습니다.",
		cc_01: "등록하시겠습니까?",
		cs_01: "저장되었습니다.",
		cf_01: "등록 시 문제가 발생하였습니다.",
		uc_01: "수정하시겠습니까?",
		us_01: "저장되었습니다.",
		uf_01: "수정 시 문제가 발생하였습니다.",
		uf_02: "해당 인력은 공유등록/공유사용 중으로 수정할 수 없습니다.",
		dc_01: "삭제하시겠습니까?",
		ds_01: "삭제되었습니다.",
		df_01: "삭제 시 문제가 발생하였습니다.",
		df_02: "해당 인력은 공유등록/공유사용 중으로 삭제할 수 없습니다.",
		cm_01: "데이터가 존재하지 않습니다.",
		cm_02: "선택된 데이터가 없습니다.",
		cm_03: "변경된 내역이 존재하지 않습니다.",
		cm_04: "{{t1}}은(는) 필수 입력값입니다."
	}
}

var gGrid1, gGrid2 = null;
var gColumn1, gColumn2 = null;

// 공유상태(SH_XXX.SH_USE_YN)
var changeable   = ["R","N", "E" ]; 			 	 // R: 공유정보등록,  N: 공유미등록
var unchangeable = ["A", "S"]; // A: 공유사용신청, S: 공유정보승인, E: 공유사용종료, D: 공유정보삭제

$(function(){
	common.setCommCode($("#condWrkCd"),   "WRK_CD",    null, 2);			// 인력구분
	common.setCommCode($("#condWrkTyp"), "WRK_TYP", null, 2);	// 인력구분(조회)
	common.setCommCode($("#wrkCd"),   	"WRK_CD");			// 인력구분
	common.setCommCode($("#wrkTyp"),  	"WRK_TYP");			// 근무형태
	common.setCommCode($("#wrkGrp"),  	"WRK_GRP"); 		// 직종
	common.setCommCode($("#shPrdCls"),  "SH_PRD_CLS", null, 3);		// 공유기간구분
	common.setCommCode($("#wrkGrp1"),  	"WRK_GRP1"); 		// 직종중
	common.setCommCode($("#wrkGrp2"),  	"WRK_GRP2"); 		// 직종소
	
	common.setNumOnlyWithComma("shPrd", "shPrc");
	
	$("#search").click(search); 		// 조회
	$(".search-conditions input").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#search").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
		}
	});
	$("#init").click(init);				// 초기화
	$("#detailInit").click(detailInit); // 상세 초기화
	$("#save").click(save);				// 저장
	$(".info-edit").find("select,input,radio,textarea").on("change", editsDataChange);
	
	set();
});

// rendering
function set(){
	gColumn1 = [
		{title: "인력구분", halign: "center", align: "center", dataType: "string", dataIndx: "WRK_CD_NM", must:true },
		{title: "인력이름", align: "center", dataType: "string", dataIndx: "MANPW_NM"},
		{title: "공유여부", halign: "center", align: "center", dataType: "string", dataIndx: "SH_USE_YN_NM", render: renderShareYN },
	
		// hidden field
		{title: "인력구분", 	dataIndx: "WRK_CD", 	hidden:true, must:true},
		{title: "인력번호", align: "center", dataType: "string", dataIndx: "MANPW_NO", 	hidden:true},
		{title: "공유기간구분", dataIndx: "SH_PRD_CLS", hidden:true, must:true},
		{title: "공유기본기간",	dataIndx: "SH_PRD", 	hidden:true, must:true},
		{title: "공유시작일", 	dataIndx: "SH_LT_DT", 	hidden:true, must:true},
		{title: "공유여부", dataIndx: "SH_USE_YN", hidden:true, must:true},
	];
	
    var options1 = {
        width: '100%',
        height: '99%',
        showTop: false,
        editable: false,
        selectionModel: {type: 'row', mode: 'single'},
        numberCell: { show: true, resizable: false, title: "순번", minWidth: 45 },
        trackModel: {on: true},
		dataModel: {data: [], recIndx: "MANPW_NO"},
    };
    var gridCmmn1 = new GridUtil(gColumn1, location.pathname, "sh_manpw_reg_pqgrid_div1", options1);
	gridCmmn1.open();
	gGrid1 = gridCmmn1.getGrid();
    gGrid1.on("cellClick", cellClick);
	
	gColumn2 = [
		{title: "근무형태", 	halign: "center", align: "center", 	dataType: "string", dataIndx: "WRK_TYP_NM"},
		{title: "근무시간(F)",	halign: "center", align: "center", 	dataType: "string", dataIndx: "WRK_TIME1"},
		{title: "근무시간(T)",	halign: "center", align: "center", 	dataType: "string", dataIndx: "WRK_TIME2"},
		{title: "직종", 		halign: "center", align: "center", 	dataType: "string", dataIndx: "WRK_GRP_NM"},
		{title: "야간근무여부", halign: "center", align: "center", 	dataType: "string", dataIndx: "NGT_YN"},
		{title: "자격증유무", 	halign: "center", align: "center", 	dataType: "string", dataIndx: "LICN_YN"},
		{title: "희망근무지", 	halign: "center", align: "center", 	dataType: "string", dataIndx: "WRK_AREA_NM"},
		{title: "희망근무월수", halign: "center", align: "right", 	dataType: "string", dataIndx: "WRK_REQ_MON"}
	];
	
    var options2 = {
        width: '100%',
        height: 'flex',
        showTop: false,
        editable: false,
        numberCell: { show: true, resizable: false, title: "순번", minWidth: 45 },
        selectionModel: {type: 'row', mode: 'single'}, // row로 단일 선택
    };
    
    var gridCmmn2 = new GridUtil(gColumn2, location.pathname, "sh_manpw_reg_pqgrid_div2", options2);
	gridCmmn2.open();
	gGrid2 = gridCmmn2.getGrid();
}
function renderShareYN(ui) {
    if (ui.cellData === 'N') {
        return '미등록';
    } else if (ui.cellData === 'R') {
        return '등록중';
    } else if (ui.cellData === 'A') {
        return '신청중';
    } else if (ui.cellData === 'S') {
        return '공유중';
    }
    return ui.cellData;
}
// 행 선택
function cellClick(event, ui){
	detailInit();
	$(".info-edit").find("select,input,radio,textarea").val("");//EDTIS 초기화
	//SELECTBOX 첫 번째 항목으로 세팅
	$(".info-edit").find("select").each(function(index){
			$(this).find("option:eq(0)").prop("selected", true);
		}
	);

	var rowData = ui.rowData;
	gGrid2.option("dataModel.data", [ui.rowData]);
	gGrid2.refreshDataAndView();
	
	common.setValToComp(ui.rowData);
	
	if(rowData.WRK_PHTO) {
		$("#wrkPhto").prop("src", "data:image;base64," + rowData.WRK_PHTO);
	} 
	
	if(unchangeable.indexOf(rowData.SH_YN) > -1) {
		detailDisable(true);
	}else{
		detailDisable(false);
			$("#shLtDt").attr('min', common.getToday(2));
	}

	var shUseYn = rowData.SH_USE_YN;

	$("#shUseYn option").remove();
	if(shUseYn === "E"){
		$("#shUseYn").append($('<option/>', {value:'E', text:'종료'}));
		$("#shUseYn").append($('<option/>', {value:'R', text:'등록'}));
		$("#shUseYn").val(shUseYn);
	}else if(!shUseYn){
		$("#shUseYn").append($('<option/>', {value:'', text:'미등록'}));
		$("#shUseYn").append($('<option/>', {value:'R', text:'등록'}));
		$("#shUseYn").val(shUseYn);
	}else{
		$("#shUseYn").append($('<option/>', {value:shUseYn, text:rowData.SH_USE_YN_NM}));
		$("#shUseYn").prop("disabled", true);
	}
}

// 상세영역 수정
function editsDataChange(e){
	var selectRow = gGrid1.SelectRow().getSelection()[0];
	if(!selectRow){
		alert("선택한 인력이 없습니다.");
		return;
	}
	
	var dataIndx = common.cToS(e.target.id).toUpperCase();
	var value = e.target.value;
	var newData = {};
	newData[dataIndx] = value;
	
	gGrid1.options.editable = true;
	gGrid1.updateRow({rowIndx: selectRow.rowIndx, newRow: newData});
	gGrid1.options.editable = false;
}

// 초기화
function init(){
	searchInit(); 
	gridInit();
	detailInit();
}

// 검색영역 초기화
function searchInit(){
	$(".setting-grid").find("select, input, radio, textarea").val("");
}

// 그리드 초기화
function gridInit(){
	gGrid1.option("dataModel.data", []);
	gGrid1.refreshDataAndView();
}

// 상세영역(grid2, 이미지, input) 초기화
function detailInit(){
	gGrid2.option("dataModel.data", []);
	gGrid2.refreshDataAndView();
	
	$("#wrkPhto").prop("src", "");
	$(".info-edit").find("select, input, radio, textarea").val("");
	
	$("#shLtDt").removeAttr("min");
}

function detailDisable(t){
	$(".info-edit").find("select,input,radio,textarea").prop("disabled", t);
}

// 조회
function search(){
	gridInit(); 
	detailInit();
	
	var param = common.makeConditionsParam();
	$.ajax({ 
		type: "POST",
		dataType: "json",
		url: "/rs/manpw/getSh",
		data: param,
		beforeSend: function () {
			gGrid1.option("strLoading", "Searching...");
			gGrid1.showLoading();
		},
		success:function(data){
			if(!data.error){ console.log(data);
				gGrid1.option("dataModel.data", data.data);
				gGrid1.refreshDataAndView();
			}else{
				alert(data.error);
			}
		},
		complete: function () {
			gGrid1.hideLoading();
			gGrid1.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
		},
		error:function(e){
			alert("error: " + gMsg.kr.rf_01);
		}   
	});
}

// 저장(신규, 수정)
function save(){
	if(gGrid1.isDirty()){
		var rt = checkMust(gGrid1, gColumn1);
		if(rt != ""){
			alert((gMsg.kr.cm_04).replace("{{t1}}", rt));
			return;
		}
		
		$.ajax({ 
			type: "POST",
			dataType: "json",
			url: ("/rs/manpw/saveSh"),
			data:{
				data: JSON.stringify(gGrid1.getChanges({format:'byVal'}))
			},
			beforeSend: function () {
	            gGrid1.option("strLoading", "Saving...");
	            gGrid1.showLoading();
	        },
			success:function(data){
				if(!data.error){
					alert(gMsg.kr.cs_01);
					search();
				}else{
					alert(data.error);
				}
			},
	        complete: function () {
	            gGrid1.hideLoading();
	            gGrid1.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
	        },
			error:function(e){
				alert("error: " + e);
			}   
		});
	}else{
		alert(gMsg.kr.cm_03);
	}
}

function checkMust(grid, columns){
	var rt = "";
	var gridChanges = grid.getChanges();
	var rows = [...gridChanges.addList, ...gridChanges.updateList];
	
	for (var row of rows) { 
		for (var col of columns) {
			if (col.must && common.nvl(row[col.dataIndx], "") == ""){
				rt += "인력번호 " + row.MANPW_NO + "의 " + col.title + "\r\n";
			}
		}
	}
	return rt
}
