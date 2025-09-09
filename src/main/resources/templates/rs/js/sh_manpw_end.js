var gMsg = { // [r, c, u, d][c, s, f]||[cm]_[99] // [read, create, update, delete][confirm, success, fail] or [common]
	kr: {
		rs_01: "조회되었습니다.",
		rf_01: "조회 시 문제가 발생하였습니다.",
		cc_01: "등록하시겠습니까?",
		cs_01: "저장되었습니다.",
		cf_01: "등록 시 문제가 발생하였습니다.",
		uc_01: "수정하시겠습니까?",
		uc_02: "처리하시겠습니까?",
		us_01: "저장되었습니다.",
		us_02: "처리하였습니다.",
		uf_01: "수정 시 문제가 발생하였습니다.",
		uf_02: "해당 인력은 공유등록/공유사용 중으로 수정할 수 없습니다.",
		dc_01: "삭제하시겠습니까?",
		ds_01: "삭제되었습니다.",
		df_01: "삭제 시 문제가 발생하였습니다.",
		df_02: "해당 인력은 공유등록/공유사용 중으로 삭제할 수 없습니다.",
		cm_01: "데이터가 존재하지 않습니다.",
		cm_02: "선택된 데이터가 없습니다.",
		cm_03: "변경된 내역이 존재하지 않습니다.",
		cm_05: "처리하였습니다."
	}
}

var gGrid, gColumn = null;

// 공유상태(SH_XXX.SH_USE_YN)
var changeable   = ["R","N", "E" ];  // R: 공유정보등록, A: 공유사용신청, S: 공유정보승인
var unchangeable = ["A", "S"];			// E: 공유사용종료

$(function(){
	
	common.setCommCode($("#condWrkCd"),   "WRK_CD",    null, 2);			// 인력구분
	common.setCommCode($("#condWrkTyp"), "WRK_TYP", null, 2);	// 인력구분(조회)
	common.setCommCode($("#wrkCd"),   	"WRK_CD");			// 인력구분
	common.setCommCode($("#condShUseYn"), "SH_USE_YN", null, 2, function(){
		$(this).find("option[value=D]").remove();
	});
	
	$("#search").click(search);
	$(".search-conditions input").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#search").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
		}
	});
	$("#init").click(init);
	$("#save").click(save);
	
	searchInit();
	set();
});

// rendering
function set(){
	gColumn = [
		{title: "",	align: "center", dataType: 'bool', dataIndx: "checked", type: 'checkBoxSelection', 
	 		editable: function(ui){
				//공유여부가 '공유등록' 또는 '공유신청' 일 경우만 체킹 가능
				if(ui.rowData){
					var shUseYn = ui.rowData["SH_USE_YN"];
				  if(shUseYn == "R" || shUseYn == "A"){
						return true;
					}	
				}
			},
		 	cb: {
	            all: false,  // checkbox selection in the header affect current page only.
	            header: true // show checkbox in header. 
	        }
		},
		{title: "인력번호", 	halign: "center", align: "center", 	dataType: "string", dataIndx: "MANPW_NO"},
		{title: "인력구분", 	halign: "center", align: "center", 	dataType: "string", dataIndx: "WRK_CD_NM"},
		{title: "인력이름", 	halign: "center", align: "center", 	dataType: "string", dataIndx: "MANPW_NM"},
		{title: "인력업체", 	halign: "center", align: "center", 	dataType: "string", dataIndx: "CP_CD"},
		{title: "공유기간구분", halign: "center", align: "center", 	dataType: "string", dataIndx: "SH_PRD_CLS_NM"},
		{title: "공유기본기간", halign: "center", align: "center", 	dataType: "string", dataIndx: "SH_PRD"},
		{title: "공유시작일", 	halign: "center", align: "center", 	dataType: "string", dataIndx: "SH_LT_DT"},
		{title: "공유여부", 	halign: "center", align: "center", 	dataType: "string", dataIndx: "SH_USE_YN",  render: renderShareYN}
	]; 
	
    var options = {
        width: '100%',
        height: '99%',
        showTop: false,
        editable: false,
        numberCell: { show: true, resizable: false, title: "순번", minWidth: 45 },
        selectionModel: {type: 'row', mode: 'single'}
    };
    
    var gridCmmn = new GridUtil(gColumn, location.pathname, "sh_manpw_end_pqgrid_div", options);
	gridCmmn.open();
	gGrid = gridCmmn.getGrid();
}

function renderShareYN(ui) {
    if (ui.cellData === 'N') {
        return '미등록';
    } else if (ui.cellData === 'E') {
        return '종료';
    } else if (ui.cellData === 'R') {
        return '등록';
    } else if (ui.cellData === 'A') {
        return '신청';
    } else if (ui.cellData === 'S') {
        return '승인';
    }
    return ui.cellData;
}


// 조회
function search(){
	gridInit();
	
	var param = common.makeConditionsParam();
	param.callFrom = "shEnd";
	$.ajax({ 
		type: "POST",
		dataType: "json",
		url: "/rs/manpw/getSh",
		data: param,
		beforeSend: function () {
			gGrid.option("strLoading", "Searching...");
			gGrid.showLoading();
		},
		success:function(data){
			if(!data.error){
				gGrid.option("dataModel.data", data.data);
				gGrid.refreshDataAndView();
			}else{
				alert(data.error);
			}
		},
		complete: function () {
			gGrid.hideLoading();
			gGrid.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
		},
		error:function(e){
			alert("error: " + gMsg.kr.rf_01);
		}   
	});
}

// 초기화
function init(){
	searchInit(); 
	gridInit();
}

// 검색영역 초기화
function searchInit(){
	$(".setting-grid").find("select, input, radio, textarea").val("");
	
	var param = {
		callFrom:"shEnd"
	}

}

// 그리드 초기화
function gridInit(){
	gGrid.option("dataModel.data", []);
	gGrid.refreshDataAndView();
}

// 저장(공유종료)
function save(){
	var manpwNoArr = [];
	var shNoArr = [];
	var data = gGrid.Checkbox('checked').getCheckedNodes();
	
	if(data.length == 0){
		alert(gMsg.kr.cm_02);
		return;
	}
	
	for(var i = 0 ; i < data.length ; i++){
		if(unchangeable.indexOf(data[i].SH_USE_YN) > -1){  
			alert(gMsg.kr.df_02 + "\n인력번호: " + data[i].MANPW_NO);
			return false;
		}
		manpwNoArr.push(data[i].MANPW_NO);
		shNoArr.push(data[i].SH_NO);
	}
	
	var param = {
		 manpwNoList: JSON.stringify(manpwNoArr)
		,shNoList: JSON.stringify(shNoArr)
	}
	
	if(confirm("공유종료를 " + gMsg.kr.uc_02)){
		$.ajax({ 
			type: "POST",
			dataType: "json",
			url: "/rs/manpw/endSh",
			data: param,
			async: false,
			beforeSend: function (jqXHR, settings) {
				gGrid.option("strLoading", "Saving...");
				gGrid.showLoading();
			},
			success: function(data, status, res){
				if(data.error){
					alert(data.error);
					return;
				}
				alert(gMsg.kr.us_02);
				searchInit();
				search();
			},
			complete: function () {
				gGrid.hideLoading();
				gGrid.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
			},
			error:function(e){
				alert("error: " + e)
			}   
		});
	}
}