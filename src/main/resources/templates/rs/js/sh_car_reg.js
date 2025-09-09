console.log("스크립트 START : " + window.location.href);

/*
 * 전역변수
 */
var grid;
var gridSub;
var gridDataList;

$(function(){
	/*
	 * 콤포넌트 세팅
	 */
	common.setNumOnly("condCarNo","condBrNo","shPrd");//숫자만
	common.setNumOnlyWithComma("shPrc");//숫자만 3자리콤마
	common.setCommCode($("#shPrdCls"),"SH_PRD_CLS",'',1);//공통코드
	common.setCommCode($("#shSqu"),"USEYN",'',1,function(dataList){$(this).find("option[value=S]").remove();});//공통코드:사용여부
	common.setCommCode($("#shLkCls"),"USEYN",'',1,function(dataList){$(this).find("option[value=S]").remove();});//공통코드:사용여부

	/*
	 * 콤포넌트 이벤트 처리
	 */
	$("#btnSearch").click(search);//조회 버튼
	$(".search-conditions input").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#btnSearch").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
		}
	});
	$("#btnClearAll").click(clearAll);//상단 초기화 버튼
	$("#btnClearEdits").click(clearEdits);//하단 초기화 버튼
	$("#btnDel").click(save);//행삭제 버튼
	$("#btnSave").click(save);//저장 버튼
	// $(".info-edit").find("select,input,radio,textarea").change(editsDataChange);//EDITS 수정여부
	$(".search-conditions").keydown(function(e){if(e.keyCode==13){search();}});//조회 조건 엔터키 입력 이벤트

	/*
	 * 그리드
	 */
	setGrid();
	setSubGrid();
});

/*
 * 그리드
 */
function setGrid(){
	//초기화
	//$( "#pqgrid_div" ).pqGrid( "deleteRow", { rowIndx: 1 } );

	//Grid
	var columns = [
		
		{title:"차량번호(FULL)",halign:"center",align:"center",dataType:"string",dataIndx:"carFullNo"},
		{title: "적재중량(kg)", dataType: "string", dataIndx: "carLodWgt", align: "center" },
		{title:"공유여부",halign:"center",align:"center",dataType:"string",dataIndx:"shYn"},
		{title:"차량번호",halign:"center",align:"center",dataType:"string",width:'90',dataIndx:"carNo", hidden:true},
		{dataIndx: "action",hidden:true},
		{dataIndx: "shPrdCls", title:'shPrdCls', hidden:true},
		{dataIndx: "shPrd", title:'shPrd', hidden:true},
		{dataIndx: "shSqu", title:'shSqu', hidden:true},
		{dataIndx: "shLkCls", title:'shLkCls', hidden:true},
		{dataIndx: "shLtDt", title:'shLtDt', hidden:true},
		{dataIndx: "shUseYn", title:'shUseYn', hidden:true},
	];
	var options = {
		width: '100%',
		height: '99%',
		showTop: false,
		editable: false,
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		selectionModel: {type: "row", mode: "single"},
		trackModel: {on:true}, //GRID 추가,수정,삭제 처리된 상태 확인용 옵션
		dataModel: { data: [], recIndx: "carId" },
		cellClick: gridCellClick,
		beforeCellClick:function(event, ui){
			var selectRow = grid.SelectRow().getSelection()[0];
			if(selectRow){
				fnSetDataForGrid(selectRow);
			}
		}
	};
	//this.grid = pq.grid($("#pqgrid_div"),options);
	var gridId = "sh_car_reg_grid";//그리드 ID
	var progNm = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	var gridCmmn = new GridUtil(columns, progNm, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	gridCmmn.open();//그리드 생성
	this.grid = gridCmmn.getGrid();//그리드
}

/*
 * 그리드
 */
function setSubGrid(){
	//초기화
	//$( "#pqgrid_div" ).pqGrid( "deleteRow", { rowIndx: 1 } );

	//Grid
	var columns = [
		{title:"운송사",halign:"center",align:"center",dataType:"string",width:'100',dataIndx:"carCpNm"},
		{title:"차량구분",halign:"center",align:"center",dataType:"string",width:'100',dataIndx:"carClsNm"},
		{title:"운송구분",halign:"center",align:"center",dataType:"string",width:'100',dataIndx:"carOprNm"},
		{title:"온도구분",halign:"center",align:"center",dataType:"string",width:'100',dataIndx:"carTempNm"},
		{title:"차종구분",halign:"center",align:"center",dataType:"string",width:'100',dataIndx:"carModNm"},
		{title:"적재CBM",halign:"center",align:"center",dataType:"string",width:'100',dataIndx:"carLodCbm"},
		{title:"적재중량",halign:"center",align:"center",dataType:"string",width:'100',dataIndx:"carLodWgt"},
		{title:"적재너비",halign:"center",align:"center",dataType:"string",width:'100',dataIndx:"carLodWdt"},
		{title:"적재길이",halign:"center",align:"center",dataType:"string",width:'100',dataIndx:"carLodLen"},
		{title:"적재높이",halign:"center",align:"center",dataType:"string",width:'100',dataIndx:"carLodHgt"},
		{title:"적재물배상책임보험여부",halign:"center",align:"center",dataType:"string",width:'180',dataIndx:"carLodInsrYn"}
	];
	var options = {
		width: '100%',
		height: 'flex',
		showTop: false,
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		selectionModel: {type: 'row', mode: 'single'} ,
		//dataModel: {data: dataList},
	};
	//this.gridSub = pq.grid($("#pqgrid_sub"),options);
	var gridId = "sh_car_reg_detail_grid";//그리드 ID
	var progNm = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	var gridCmmn = new GridUtil(columns, progNm, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	gridCmmn.open();//그리드 생성
	this.gridSub = gridCmmn.getGrid();//그리드
}

/*
 * 차량 기본정보 목록 조회
 */
function searchCarBasicInfoList(){
	//조회조건 파라미터
	var param = {
	};
	//호출
	return $.ajax({
		type:"POST",
		dataType:"json",
		url:"/rs/car/getCarBasicInfoList",
		data:param,
		success:function(data, status, res){
			//오류확인
			if(data.error){
				alert(data.error);
				return;
			}
		},
		error:function(e){
			alert(e);
		},
	});
}


function fnSetDataForGrid(selectRow){
	var rowIndx = selectRow.rowIndx;
	var rowData = selectRow.rowData;
	var newData = {};
	if(rowData.shUseYn === "A" || rowData.shUseYn === "S"){
		return;
	}

	grid.options.editable = true;//수정모드
	$(".info-edit").find("select,input,radio,textarea").each(function() {
		var thisVal = $("#"+this.id).val().replace(/\,/g, "");
		thisVal = !thisVal?"":thisVal;
		var rowVal = rowData[this.id];

		if((!rowVal && thisVal) || (rowVal && (rowVal != thisVal))){
			newData[this.id] = thisVal;
		}
	});

	grid.updateRow({rowIndx:rowIndx,newRow:newData});
	//조회 데이터 수정
	grid.options.editable = false;//수정모드 종료
}

/*
 * 그리드 클릭 : 차량 공유정보 그리드 입력 & 차량공유 정보 조회
 */
function gridCellClick(event,ui){
	var rowData = ui.rowData;
	//EDTIS 초기화
	$(".info-edit").find("select,input,radio,textarea").val("");
	//데이터 그리드SUB 데이터 추가
		gridSub.option("editable", true);
		gridSub.deleteRow({rowList:[{rowIndx: 0 }]});
		gridSub.addRow(
			{newRow:ui.rowData}
		);
	$(".info-edit").find("select").each(function(index){
			$(this).find("option:eq(0)").prop("selected", true);
		}
	);
	gridSub.option("editable", false);
	//DATA TO 콤포넌트 맵핑
	common.setValToComp(rowData);

	if(ui.rowData["shUseYn"] === "S" || rowData["shUseYn"] === "A") {
		$(".info-edit").find("select,input,radio,textarea").prop("disabled",true);
	}else{
		$(".info-edit").find("select,input,radio,textarea").prop("disabled",false);
		$("#carId,#userNm").prop("disabled",true);
	}
	//이미지 세팅
	if(rowData["carPhot"]) {
		$("#carPhotImg").prop("style", "width:100%; height:475px;")
		$("#carPhotImg").prop("src", "data:image;base64," + rowData["carPhot"]);
	} else {
		$("#carPhotImg").prop("src", "");
		$("#carPhotImg").prop("style", "");
	}

	var shUseYn = rowData.shUseYn;
	var editShUseYn = shUseYn;

	if(shUseYn === "E" && !rowData.shUseYnNm){
		editShUseYn = 'E';
	}

	if(shUseYn === "E"){
		$("#shUseYn option").remove();
		$("#shUseYn").append($('<option/>', {value:'E', text:'종료'}));
		$("#shUseYn").append($('<option/>', {value:'R', text:'등록'}));
		$("#shUseYn").val(editShUseYn);
	}else if(!shUseYn){
		$("#shUseYn option").remove();
		$("#shUseYn").append($('<option/>', {value:'', text:'미등록'}));
		$("#shUseYn").append($('<option/>', {value:'R', text:'등록'}));
		$("#shUseYn").val(editShUseYn);
	}else{
		$("#shUseYn option").remove();
		$("#shUseYn").append($('<option/>', {value:shUseYn, text:rowData.shUseYnNm}));
		$("#shUseYn").prop("disabled", true);
	}
}

/*
 * 데이터 초기화 : 전체
 */
function clearAll(){
	//조회조건 초기화
	$(".search-conditions").find("select,input,radio,textarea").val("");
	//Grid 데이터 초기화
	var totalRows = grid.getTotalRows();
	for(var idx=0 ;  idx < totalRows ; idx++){
		grid.deleteRow({rowList:[{rowIndx: 0 }]});
	}
	//Grid 데이터 초기화
	totalRows = gridSub.getTotalRows();
	for(var idx=0 ;  idx < totalRows ; idx++){
		gridSub.deleteRow({rowList:[{rowIndx: 0 }]});
	}
	//EDTIS 초기화
	$(".info-edit").find("select,input,radio,textarea").val("");
	//사진 초기화
	$("#carPhotImg").prop("src","");
}

/*
 * 데이터 초기화
 */
function clearEdits(){
	//그리드 초기화
	gridSub.deleteRow({rowList:[{rowIndx: 0 }]});
	//EDTIS 초기화
	$(".info-edit").find("select,input,radio,textarea").val("");
	//사진 초기화
	$("#carPhotImg").prop("src","");
}

/*
 * 조회 : 차량 기본정보 조회
 */
function search(e){
	//초기화
	var totalRows = grid.getTotalRows();
	for(var idx=0 ;  idx < totalRows ; idx++){
		gridSub.deleteRow({rowList:[{rowIndx: 0 }]});
	}
	clearEdits();
	//그리드 수정가능 : 데이터 그리드 입력을 위한 기초 세팅
	//grid.option("editable", true);

	var param = common.makeConditionsParam();//조회조건 파라미터
	param["useYn"] = "Y";
	//로딩바 SHOW
	grid.showLoading();
	//호출
	$.ajax({
		type:"POST",
		dataType:"json",
		// url:"/rs/car/getCarBasicInfoList",
		url:"/rs/car/getShCarList",
		data:param,
		success:function(data, status, res){
			
			
			//오류확인
			if(data.error){
				alert(data.error);
				return;
			}
			//데이터 입력
			gridDataList = data.dataList;
			grid.option("dataModel.data", gridDataList);
			grid.refreshDataAndView();
			console.log(gridDataList);
		},
		error:function(e){
			alert(e);
		},
		complete:function(e){
			
			//로딩바 HIDE
			grid.hideLoading();
			//그리드 히스토리 초기화
			grid.History().reset();
		},
	});
}

/*
 * 저장
 */
function save(e){
	fnSetDataForGrid(grid.SelectRow().getSelection()[0]);
	//검증
	var gridChanges = grid.getChanges({ format: 'byVal' });
	var dataList = gridChanges.updateList;

	dataList = dataList.filter((data) => {
		var editShUseYn = data.edit_sh_use_yn;
		//종료상태인데 등록상태로 수정했거나 등록상태일때만.
		return ((data.sh_use_yn === "E" && editShUseYn !== "E") || editShUseYn === "R" || !editShUseYn);
	});

	if(dataList.length === 0){
		alert("수정된 내용이 없습니다.");
		return;
	}

	//필수체크
	var mustChkColList = [
		{column:"shPrdCls",title:"공유기간구분"},
		{column:"shPrd",title:"공유기본기간"},
		{column:"shLtDt",title:"공유시작일"},
		{column: "shYn", title:"공유여부"}
		
	];
	var msg = "";
	dataList.forEach(function(dataObj,index){
		var validationMsg = "";
		mustChkColList.forEach(function(chkColObj){
			var tmpCol = dataObj[chkColObj.column];
			if(!tmpCol || tmpCol.trim() == ""){
				validationMsg += "'" + chkColObj.title + "'\r\n";
			}
		});
		if(validationMsg){
			msg += "차량번호 ["+dataObj["carNo"]+"]\n"+validationMsg+"\n";
		}
	});
	if(msg){
		alert(msg + "은(는) 필수 입력값입니다.");
		return;
	}

	let chkDate = fn_dateCheck($("#shLtDt").val());
	if(chkDate) {
		alert("공유게시기한은 오늘 이후 여야 합니다.");
		$("#shLtDt").focus();
		return;
	}

	//파라미터
	var param = {
		dataList : JSON.stringify(dataList)
	}
	// return;
	//로딩바 SHOW
	grid.showLoading();
	//호출
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"/rs/car/saveCarShareInfo",
		data:param,
		success:function(data, status, res){
			//오류확인
			if(data.error){
				alert(data.error);
				return;
			}
			//조회
			search();
			//결과 알람
			alert("저장 되었습니다.");
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