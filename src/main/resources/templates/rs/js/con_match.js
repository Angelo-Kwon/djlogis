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
var wColumns, cColumns, eColumns, mColumns = null;
var nowColumns, nowGridId = null;

$(function(){
	wColumns = [
		{
	 		title: "",	align: "center", dataType: 'bool', dataIndx: "checked", type: 'checkBoxSelection',
	 		editable: function(ui){
				 return ui.rowData.SH_USE_YN == 'S'
			},
		 	cb: {all: false, header: true}
		},
	    {title: "공급자ID", 	dataType: "string", dataIndx: "SUP_LOGIN_ID", 	halign: "center", align: "center"},
	    {title: "공급자명", 	dataType: "string", dataIndx: "SUP_NM", 		halign: "center", align: "center"},
	    {title: "창고ID", 	dataType: "string", dataIndx: "WH_ID", 			halign: "center", align: "center"},
	    {title: "창고명", 	dataType: "string", dataIndx: "WH_NM", 			halign: "center", align: "center"},
	    {title: "매칭일자", 	dataType: "string", dataIndx: "MAT_CON_DT",		halign: "center", align: "center"},
	    {title: "사용일자", 	dataType: "string", dataIndx: "SH_ST_DT",		halign: "center", align: "center"},
	    {title: "공유범위구분", dataType: "string", dataIndx: "SH_RNG_CLS_NM",	halign: "center", align: "center"},
	    {title: "공유층수", 	dataType: "string", dataIndx: "SH_FLR", 		halign: "center", align: "center"},
	    {title: "공유랙구분", 	dataType: "string", dataIndx: "SH_LK_CLS_NM", 	halign: "center", align: "center"},
	    {title: "공유기간구분", dataType: "string", dataIndx: "SH_PRD_CLS_NM", 	halign: "center", align: "center"},
	    {title: "공유기본기간", dataType: "string", dataIndx: "SH_PRD", 		halign: "center", align: "right"},
	    {title: "공유금액", 	dataType: "string", dataIndx: "SH_PRC", 		halign: "center", align: "right"},
	    {title: "공유여부", 	dataType: "string", dataIndx: "SH_USE_YN_NM",	halign: "center", align: "center"}, 
	];
	
	cColumns = [
		{
	 		title: "",	align: "center", dataType: 'bool', dataIndx: "checked", type: 'checkBoxSelection',
			editable: function(ui){
				 return ui.rowData.SH_USE_YN == 'S'
			}, 
		 	cb: {all: false, header: true}
		},
	    {title: "공급자ID", 		dataType: "string", dataIndx: "SUP_LOGIN_ID", 	halign: "center", align: "center"},
	    {title: "공급자명", 		dataType: "string", dataIndx: "SUP_NM", 		halign: "center", align: "center"},
	    {title: "차량ID", 		dataType: "string", dataIndx: "CAR_ID", 		halign: "center", align: "center"},
	    {title: "차량번호(FULL)", 	dataType: "string", dataIndx: "CAR_FULL_NO", 	halign: "center", align: "center"},
	    {title: "매칭일자", 		dataType: "string", dataIndx: "MAT_CON_DT",		halign: "center", align: "center"},
	    {title: "사용일자", 		dataType: "string", dataIndx: "SH_ST_DT",		halign: "center", align: "center"},
	    {title: "차량구분", 		dataType: "string", dataIndx: "CAR_CLS_CD_NM",	halign: "center", align: "center"},
	    {title: "운송구분", 		dataType: "string", dataIndx: "CAR_OPR_CD_NM", 	halign: "center", align: "center"},
	    {title: "차종구분", 		dataType: "string", dataIndx: "CAR_MOD_CD_NM", 	halign: "center", align: "center"},
	    {title: "공유기간구분", 	dataType: "string", dataIndx: "SH_PRD_CLS_NM", 	halign: "center", align: "center"},
	    {title: "공유기본기간", 	dataType: "string", dataIndx: "SH_PRD", 		halign: "center", align: "right"},
	    {title: "공유금액", 		dataType: "string", dataIndx: "SH_PRC", 		halign: "center", align: "right"},
	    {title: "공유여부", 		dataType: "string", dataIndx: "SH_USE_YN_NM",	halign: "center", align: "center"},  
	];
	
	eColumns = [
		{
	 		title: "",	align: "center", dataType: 'bool', dataIndx: "checked", type: 'checkBoxSelection',
	 		editable: function(ui){
				 return ui.rowData.SH_USE_YN == 'S'
			}, 
		 	cb: {all: false, header: true}
		},
	    {title: "공급자ID", 	dataType: "string", dataIndx: "SUP_LOGIN_ID", 	halign: "center", align: "center"},
	    {title: "공급자명", 	dataType: "string", dataIndx: "SUP_NM", 		halign: "center", align: "center"},
	    {title: "기자재ID", 	dataType: "string", dataIndx: "EQUIP_ID", 		halign: "center", align: "center"},
	    {title: "기자재구분", 	dataType: "string", dataIndx: "EQUIP_CD_NM",	halign: "center", align: "center"},
	    {title: "매칭일자", 	dataType: "string", dataIndx: "MAT_CON_DT",		halign: "center", align: "center"},
	    {title: "사용일자", 	dataType: "string", dataIndx: "SH_ST_DT",		halign: "center", align: "center"},
	    {title: "기자재명", 	dataType: "string", dataIndx: "EQUIP_NM",		halign: "center", align: "center"},
	    {title: "공유수량", 	dataType: "string", dataIndx: "SH_QTY", 		halign: "center", align: "right"},
	    {title: "제조년도", 	dataType: "string", dataIndx: "MAKE_YEAR", 		halign: "center", align: "center"},
	    {title: "공유기간구분", dataType: "string", dataIndx: "SH_PRD_CLS_NM", 	halign: "center", align: "center"},
	    {title: "공유기본기간", dataType: "string", dataIndx: "SH_PRD", 		halign: "center", align: "right"},
	    {title: "공유금액", 	dataType: "string", dataIndx: "SH_PRC", 		halign: "center", align: "right"}, 
	    {title: "공유여부", 	dataType: "string", dataIndx: "SH_USE_YN_NM",	halign: "center", align: "center"}, 
	];
	
	mColumns = [
		{
	 		title: "",	align: "center", dataType: 'bool', dataIndx: "checked", type: 'checkBoxSelection',
	 		editable: function(ui){
				 return ui.rowData.SH_USE_YN == 'S'
			}, 
		 	cb: {all: false, header: true}
		},
	    {title: "공급자ID", 	dataType: "string", dataIndx: "SUP_LOGIN_ID", 	halign: "center", align: "center"},
	    {title: "공급자명", 	dataType: "string", dataIndx: "SUP_NM", 		halign: "center", align: "center"},
	    {title: "인력ID", 	dataType: "string", dataIndx: "MANPW_NO", 		halign: "center", align: "center"},
	    {title: "성명", 		dataType: "string", dataIndx: "MANPW_NM", 		halign: "center", align: "center"},
	    {title: "매칭일자", 	dataType: "string", dataIndx: "MAT_CON_DT",		halign: "center", align: "center"},
	    {title: "사용일자", 	dataType: "string", dataIndx: "SH_ST_DT",		halign: "center", align: "center"},
	    {title: "근무형태", 	dataType: "string", dataIndx: "WRK_TYP_NM", 	halign: "center", align: "center"},
	    {title: "직종", 		dataType: "string", dataIndx: "WRK_GRP_NM", 	halign: "center", align: "center"},
	    {title: "공유기본기간", dataType: "string", dataIndx: "SH_PRD", 		halign: "center", align: "right"},
	    {title: "공유금액기준", dataType: "string", dataIndx: "SH_PRC_STD_NM", 	halign: "center", align: "center"},
	    {title: "공유금액", 	dataType: "string", dataIndx: "SH_PRC", 		halign: "center", align: "right"}, 
	    {title: "공유여부", 	dataType: "string", dataIndx: "SH_USE_YN_NM",	halign: "center", align: "center"}, 
	];
	
	$("#search").click(search);
	$("#init").click(init);
	$("#save").click(save);
	$("#condMatCd").change(matCdChange)
	
	init();
});

// 초기화
function init(){
	nowColumns = wColumns;
	nowGridId = "pqgrid_div_W";
	changeGrid("W");
	
	searchInit();
	set(); 
	gridInit();
}

// 검색영역 초기화
function searchInit(){
	$(".setting-grid").find("select, input, radio, textarea").val("");
	
	common.setCommCode($("#condMatCd"), "MAT_CD", "W", 3, matCdChange);
	setCondCombo();
	
	$("#condConId").val($("#prcpUserNm").text());
	$("#condConNm").val($("#prcpNickNm").text());
}

// 그리드 초기화
function gridInit(){
	gGrid.option("dataModel.data", []);
	gGrid.refreshDataAndView();
}

// rendering
function set(){
	if(gGrid){
		gGrid.destroy();
	}
	
    var options = {
        width: '100%',
        height: '99%',
        showTop: false,
        editable: false,
        selectionModel: {type: 'row', mode: 'single'}, // row로 단일 선택
    };
    
    var gridCmmn = new GridUtil(nowColumns, location.pathname, nowGridId, options);
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
		url: "/rs/conMatch/getMat",
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

// renewal
function matCdChange(){
	var matCd = $("#condMatCd").val();
	changeGrid(matCd);
	
	switch(matCd) {
		case "W": nowColumns = wColumns; break;
    	case "C": nowColumns = cColumns; break;
    	case "E": nowColumns = eColumns; break;
    	case "M": nowColumns = mColumns; break;
  		default : nowColumns = wColumns; break;
	}
	set()
	setCondCombo();
}

function changeGrid(matCd){
	nowGridId = "pqgrid_div_" + matCd;
	$(".pqgrid_div").hide();
	$("#" + nowGridId).show();
}

// 공급자 정보 조회
function setCondCombo(){
	var param = common.makeConditionsParam();
	param.condMatCd = (param.condMatCd) ? param.condMatCd : "W";
	
	common.setCombo($("#condSupId"), getComboData('getSupId', param), null, 2);
	common.setCombo($("#condSupNm"), getComboData('getSupNm', param), null, 2);
}

// 저장(매칭승인)
function save(){
	var cmNoArr = [];
	var shNoArr = [];
	var matNoArr = [];
	var data = gGrid.Checkbox('checked').getCheckedNodes();
	
	if(data.length == 0){
		alert(gMsg.kr.cm_02);
		return;
	}
	
	for(var i = 0 ; i < data.length ; i++){
		cmNoArr.push(data[i].CM_NO);
		shNoArr.push(data[i].SH_NO);
		matNoArr.push(data[i].MAT_NO);
	}
	
	var param = common.makeConditionsParam();
	param.cmNoList = JSON.stringify(cmNoArr);
	param.shNoList = JSON.stringify(shNoArr);
	param.matNoList = JSON.stringify(matNoArr);
	
	if(confirm("[사용종료] " + gMsg.kr.uc_02)){
		$.ajax({ 
			type: "POST",
			dataType: "json",
			url: "/rs/conMatch/matEnd",
			data: param,
			async: false,
			success: function(data, status, res){
				if(data.error){
					alert(data.error);
					return;
				}
				alert(gMsg.kr.us_02);
				search();
			},
			error:function(e){
				alert("error: " + e)
			}   
		});
	}
}

function getComboData(urlId, param){
	var rs = [];
	$.ajax({ 
		type: "POST",
		dataType: "json",
		url: "/rs/conMatch/" + urlId,
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