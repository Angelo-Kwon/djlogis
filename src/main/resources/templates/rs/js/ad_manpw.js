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

var gGrid, gColumn = null;


var changeable = ["N"]; // N: CM_MANPW.SH_YN   
var unchangeable = ["Y"]; // Y: CM_MANPW.SH_YN 

$(function(){
	common.setCommCode($("#condWrkTyp"), "WRK_TYP", null, 2);
/*	common.setCommCode($("#condShYn"), "SH_YN", null, 2);				// 공유여부(조회)*/  
	common.setCommCode($("#condUseYn"), "USEYN", null, 2, function() { 	// 사용여부(조회)
		$(this).find("option[value=S]").remove();
	});

	common.setCommCode($("#wrkCd"), "WRK_CD", null, 3);			// 인력구분
	common.setCommCode($("#wrkTyp"), "WRK_TYP", null, 3);			// 근무형태
	common.setCommCode($("#wrkGrp"), "WRK_GRP", null, 3);			// 직종
	common.setCommCode($("#wrkArea"), "WRK_AREA", null, 3);			// 희망근무지
	common.setCommCode($("#ngtYn"), "NGT_YN", null, 3);			// 야간근무여부
	common.setCommCode($("#licnYn"), "LICN_YN", null, 3);			// 자격증유무
	common.setCommCode($("#useYn"), "USEYN", null, 3, function() {	// 사용여부
		$(this).find("option[value=S]").remove();
	});

	common.setCommCode($("#condWrkCd"), "WRK_CD", null, 2);	// 인력구분(조회)
	common.setCommCode($("#wrkCd"),   	"WRK_CD"  );		// 인력구분
	common.setCommCode($("#wrkTyp"),  	"WRK_TYP" );		// 근무형태
	common.setCommCode($("#wrkGrp"),  	"WRK_GRP" ); 		// 직종
	common.setCommCode($("#wrkGrp1"),  	"WRK_GRP1"); 		// 직종중
	common.setCommCode($("#wrkGrp2"),  	"WRK_GRP2"); 		// 직종소
	/*common.setCommCode($("#condShYn"),	"SH_YN", null, 2);	// 공유여부*/
	
	var cpCd = getComboData('getCpCd', {});
	common.setCombo($("#condCpCd"), cpCd, null, 2); // 인력업체
	common.setCombo($("#cpCd"),		cpCd, null, 2); // 인력업체
	
	$("#search").click(search); 		// 조회
	$(".search-conditions input").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#search").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
		}
	});
	$("#init").click(init);				// 초기화
	$("#detailInit").click(detailInit); // 상세 초기화
	$("#save").click(save);				// 저장
	
	$(".imgRegBtn").click(checkImg); 	// 이미지 등록
	$(".imgFile").change(onloadImg);	// 이미지 로드
	//$(".btn-pic-delete").click(delImg);	// 이미지 삭제
	$(".search-edit").find("select,input,radio,textarea").not("#wrkPhtoFile, #wrkLicnFile").on("change", editsDataChange);
	
	set();
});

// rendering
function set(){
	gColumn = [
		{ title: "인력구분", dataType: "string", dataIndx: "WRK_CD_NM", align: "center" },
		{ title: "인력이름", dataType: "string", dataIndx: "MANPW_NM", align: "center" },
		{ title: "사용여부", dataType: "string", dataIndx: "USE_YN", align: "center", render: renderUseYN },
		{ title: "공유여부", dataType: "string", dataIndx: "SH_USE_YN_NM", align: "center" },

		// hidden field
		{title: "공유여부", dataType: "string", dataIndx: "SH_YN", hidden:true  },
		{title: "인력번호", align: "center", dataType: "string", dataIndx: "MANPW_NO",hidden:true, must:true},
		{title: "직종", 		dataIndx: "WRK_GRP", 	hidden:true, must:true},
		{title: "직종중분류", 	dataIndx: "WRK_GRP1",	hidden:true},
		{title: "직종소분류",	dataIndx: "WRK_GRP2", 	hidden:true},
		{title: "인력사진",	dataIndx: "WRK_PHTO",	hidden:true, must:true},
		{title: "자격중",		dataIndx: "WRK_LICN", 	hidden:true}
	]; 
	
    var options = {
        width: '100%',
        height: '99%',
        showTop: false,
        editable: false,
        numberCell: { show: true, resizable: false, title: "순번", minWidth: 45 },
		//colModel: columns,	
        selectionModel: {type: 'row', mode: 'single'},
        trackModel: {on: true},
		dataModel: {data: [], recIndx: "MANPW_NO"}
    };
    
    var gridCmmn = new GridUtil(gColumn, location.pathname, "pqgrid_div", options);
	gridCmmn.open();
	gGrid = gridCmmn.getGrid();
    
    gGrid.on("cellClick", cellClick);
}
function renderUseYN(ui) {
	if (ui.cellData === 'Y') {
		return '사용';
	} else if (ui.cellData === 'N') {
		return '미사용';
	}
	return ui.cellData;
}

// 행 선택
function cellClick(event, ui){
	detailInit();
	common.setValToComp(ui.rowData);
	
	if("Y" == ui.rowData.LICN_YN){
		$("#wrkLicnTitle").addClass("ic-title-nece");
		$("#wrkLicn").attr("must", "true");
	}
	
	(ui.rowData.WRK_PHTO) ? setImg("wrkPhtoView", "wrkPhto", "data:image;base64," + ui.rowData.WRK_PHTO) : null;
	(ui.rowData.WRK_LICN) ? setImg("wrkLicnView", "wrkLicn", "data:image;base64," + ui.rowData.WRK_LICN) : null;
	
	if(unchangeable.indexOf(ui.rowData.SH_YN) > -1) {
		detailDisable(true);
		$(".btn-pic-delete").off();
	}else{
		detailDisable(false);
		$(".btn-pic-delete").click(delImg);
	}
}

// 상세영역 수정
function editsDataChange(e){
	var selectRow = gGrid.SelectRow().getSelection()[0];
	if(!selectRow){
		alert("선택한 인력이 없습니다.");
		return;
	}
	
	var dataIndx = common.cToS(e.target.id).toUpperCase();
	var value = e.target.value;
	var newData = {};
	newData[dataIndx] = value;
	
	gGrid.options.editable = true;
	gGrid.updateRow({rowIndx: selectRow.rowIndx, newRow: newData});
	gGrid.options.editable = false;
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
	gGrid.option("dataModel.data", []);
	gGrid.refreshDataAndView();
}

// 상세영역(데이터, 이미지) 초기화
function detailInit(){
	$(".search-edit").find("select, input, radio, textarea").val(""); // exInit: 초기화 제외
	imgInit();
	
	$("#wrkLicnTitle").removeClass("ic-title-nece");
	$("#wrkLicn").removeAttr("must");
}

function detailDisable(t){
	$(".search-edit").find("select,input,radio,textarea").not("#manpwNo, #wrkGrp").prop("disabled", t);
}

// 조회
function search(){
	gridInit(); 
	detailInit();
	
	var param = common.makeConditionsParam();
	$.ajax({ 
		type: "POST",
		dataType: "json",
		url: "/rs/manpw/getAd",
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

// 저장(수정)
function save(){
	if(gGrid.isDirty()){ console.log(gGrid.getChanges({format:'byVal'}));
		/*var rt = checkMust(gGrid, gColumn);
		if(rt != ""){
			alert((gMsg.kr.cm_04).replace("{{t1}}", rt));
			return;
		}*/

		$.ajax({ 
			type: "POST",
			dataType: "json",
			url: ("/rs/manpw/saveAd"),
			data:{
				data: JSON.stringify(gGrid.getChanges({format:'byVal'}))
			},
			beforeSend: function () {
	            gGrid.option("strLoading", "Saving...");
	            gGrid.showLoading();
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
	            gGrid.hideLoading();
	            gGrid.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
	        },
			error:function(e){
				alert("error: " + e);
			}   
		});
	}else{
		alert(gMsg.kr.cm_03);
	}
}

// 이미지 로드 전 유효성 확인
function checkImg(){
	var selectRow = gGrid.SelectRow().getSelection()[0];
	if(!selectRow){
		alert("선택한 인력이 없습니다."); 
		return;
	}
	$("#"+ $(this).attr("fileId")).click();	// click input type file
}

// 이미지 로드
function onloadImg(){
	var vId = $(this).attr("viewId");
	var iId = $(this).attr("inputId");
	var reader = new FileReader();
	
	reader.readAsDataURL(this.files[0]);
	reader.onload = function(e) {
		setImg(vId, iId, e.target.result);
	};
}

// 이미지 노출 및 서버 전송 데이터 입력 
function setImg(vId, iId, src){
	var div = $("#"+ vId);
	var img = $("#"+ vId).find("img");
	
	img.prop("src", src);
	div.show();
	
	var base64 = src.substring(src.indexOf(',') + 1, src.length);
	$("#"+iId).val(base64);
	
	var selectRow = gGrid.SelectRow().getSelection()[0];
	var dataIndx = common.cToS(iId).toUpperCase();
	
	gGrid.options.editable = true;
	gGrid.updateRow({rowIndx: selectRow.rowIndx, newRow: {[dataIndx]: base64}});
	gGrid.options.editable = false;
}

// 이미지 삭제 
function delImg(){
	$(this).closest(".pic-detail").hide();
	$(this).next("img").prop("src", "");
	$("#" + $(this).attr("inputId")).val("");
	$("#" + $(this).attr("inputId") + "File").val("");
	
	var selectRow = gGrid.SelectRow().getSelection()[0];
	var dataIndx = common.cToS($(this).attr("inputId")).toUpperCase();
	
	gGrid.options.editable = true;
	gGrid.updateRow({rowIndx: selectRow.rowIndx, newRow: {[dataIndx]: ""}});
	gGrid.options.editable = false;
	
}

// 이미지 초기화
function imgInit(){
	$(".pic-detail").hide();
	$(".pic-detail").find("img").prop("src", "");
	$(".imgValue").val("");
}

function getComboData(urlId, param){
	var rs = [];
	$.ajax({ 
		type: "POST",
		dataType: "json",
		url: "/rs/manpw/" + urlId,
		data: param,
		async: false,
		success:function(data, status, res){
			if(!data.error){
				rs = data.data;
			}else{
				alert(data.error);
			}
		},
		error:function(e){
			alert("error: " + gMsg.kr.rf_01);
		}   
	});
	return rs;
}

function checkMust(grid, columns){
	var rt = "";
	var gridChanges = grid.getChanges();
	var rows = [...gridChanges.addList, ...gridChanges.updateList];
	
	for (var row of rows) { 
		for (var col of columns) {
			var must = false;
			if(col.dataIndx == "WRK_LICN"){
				must = (row.LICN_YN == "Y") ? true : false;
			}else{
				must = (col.must) ? true : false;
			}
			
			if (must && common.nvl(row[col.dataIndx], "") == ""){
				rt += "인력번호 " + row.MANPW_NO + "의 " + col.title + "\r\n";
			}
		}
	}
	return rt
}