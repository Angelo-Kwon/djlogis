var gMsg = { // [r, c, u, d][c, s, f]||[cm]_[99] // [read, create, update, delete][confirm, success, fail] or [common]
	kr: {
		rs_01: "조회되었습니다.",
		rf_01: "조회 시 문제가 발생하였습니다.",
		cc_01: "등록하시겠습니까?",
		cs_01: "등록되었습니다.",
		cf_01: "등록 시 문제가 발생하였습니다.",
		uc_01: "수정하시겠습니까?",
		uc_02: "처리하시겠습니까?",
		us_01: "수정되었습니다.",
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

var gGrid = null;

// 공유상태(SH_XXX.SH_USE_YN)
var changeable   = ["S", "E"];	// S: 공유정보승인, E: 공유사용종료
var unchangeable = ["R", "A"];	// R: 공유정보등록, A: 공유사용신청

$(function(){
	$("#search").click(search);
	$("#init").click(init);
	$("#save").click(save);
	$("#condMatCd").change(matCdChange);
	
	searchInit();
	set();
});

// rendering
function set(){
	var columns = [
		{
	 		title: "", align: "center", dataType: 'bool', dataIndx: "checked", type: 'checkBoxSelection', editable: true,
		 	cb: {all: false, header: true}
		},
		{title: "수요자ID", 	halign: "center", align: "center", dataType: "string", dataIndx: "CON_LOGIN_ID"},
		{title: "수요자명", 	halign: "center", align: "center", dataType: "string", dataIndx: "CON_NM"},
		{title: "공유ID", 	halign: "center", align: "center", dataType: "string", dataIndx: "SH_NO"},
		{title: "매칭구분", 	halign: "center", align: "center", dataType: "string", dataIndx: "MAT_CD_NM"},
		{title: "매칭일자", 	halign: "center", align: "center", dataType: "string", dataIndx: "MAT_CON_DT"},
		{title: "사용일자", 	halign: "center", align: "center", dataType: "string", dataIndx: "SH_ST_DT"},
		{title: "공유기본기간", halign: "center", align: "center", dataType: "string", dataIndx: "SH_PRD"},
		//{title: "공유금액기준", halign: "center", align: "center", dataType: "string", dataIndx: "SH_PRC"}, // SH_MANPW 테이블에만 존재하는 컬럼. 그리고 정산시 불필요한 필드
		{title: "총사용금액", 	halign: "center", align: "right", dataType: "string", dataIndx: "TOTAL_POC"},
		{title: "수수료금액", 	halign: "center", align: "right", dataType: "string", dataIndx: "CHARGE_PRC"},
		{title: "정산여부", 	halign: "center", align: "center", dataType: "string", dataIndx: "SUP_PRC_YN"}
	]; 
	
    var options = {
        width: '100%',
        height: '99%',
        showTop: false,
        editable: false,
        selectionModel: {type: 'row', mode: 'single'},
    };
    
    var gridCmmn = new GridUtil(columns, location.pathname, "pqgrid_div", options);
	gridCmmn.open();
	gGrid = gridCmmn.getGrid();
}

// 조회
function search(){
	gridInit();
	
	var param = common.makeConditionsParam();
	$.ajax({ 
		type: "POST",
		dataType: "json",
		url: "/rs/charge/getMat",
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
	
	common.setCommCode($("#condMatCd"), "MAT_CD", "W", 3);
	setCondCombo();
	
	$("#condSupId").val($("#prcpUserNm").text());
	$("#condSupNm").val($("#prcpNickNm").text());
}

// 그리드 초기화
function gridInit(){
	gGrid.option("dataModel.data", []);
	gGrid.refreshDataAndView();
}

// renewal
function matCdChange(){
	gridInit();
	setCondCombo();
}

// 수요자 정보 조회
function setCondCombo(){
	var param = common.makeConditionsParam();
	common.setCombo($("#condConId"), getComboData('getConId', param), null, 2);
	common.setCombo($("#condConNm"), getComboData('getConNm', param), null, 2);
}

// 저장(수수료 정산)
function save(){
	var data = gGrid.Checkbox('checked').getCheckedNodes();
	
	if(data.length == 0){
		alert(gMsg.kr.cm_02);
		return;
	}
	
	var param = {
		 target: JSON.stringify(data)
	}
	
	if(confirm("[공유정산] " + gMsg.kr.uc_02)){
		$.ajax({ 
			type: "POST",
			dataType: "json",
			url: "/rs/charge/charge",
			data: param,
			async: false,
			beforeSend: function () {
	            gGrid.option("strLoading", "Saving...");
	            gGrid.showLoading();
	        },
			success: function(data){
				if(data.error){
					alert(data.error);
					return;
				}
				alert(gMsg.kr.us_02);
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

// 조회
function getData(param){
	var rs = [];
	$.ajax({ 
		type: "POST",
		dataType: "json",
		url: "/rs/charge/getMat",
		data: param,
		async: false,
		success:function(data, status, res){
			if(data.error){
				alert(data.error);
				return rs;
			}
			
			rs = data.data;	
		},
		error:function(e){
			alert("error: " + gMsg.kr.rf_01);
		}   
	});
	return rs;
}

function getComboData(urlId, param){
	var rs = [];
	$.ajax({ 
		type: "POST",
		dataType: "json",
		url: "/rs/charge/" + urlId,
		data: param,
		async: false,
		success:function(data, status, res){
			if(data.error){
				alert(data.error);
				return rs;
			}
			
			rs = data.data;
		},
		error:function(e){
			alert("error: " + gMsg.kr.rf_01);
		}   
	});
	return rs;
}