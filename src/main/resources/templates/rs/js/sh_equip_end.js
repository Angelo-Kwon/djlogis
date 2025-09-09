console.log("스크립트 START : " + window.location.href);

/**
 *1. 기자재 공유정보 조회
  ① 최초 검색 화면에서 기자재구분, 기자재명, 공유구분 등 검색조건을 입력하고 “조회” 버튼을 클릭한다.
  ② 검색조건에 해당되는 기자재공유정보를 Display한다. 

2. 기자재 공유정보 종료
  ① 조회된 기자재를 선택한다.
  ② “종료” 버튼을 클릭하여 기자재공유정보를 종료한다. 
  ③ 종료처리시 공유여부를 미공유로 변경처리 한다.
  공유여부 N 처리
 
 */


var rowData = null; //기존값 전역변수
var isRowAdded = false;//행추가 추적플래그
var isEdit;//EDITS 수정여부
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
	//   -----기자재 삭제라인-----   //
	$("#btnShareEnd").click(deleteSh);

	//공통코드세팅*****
	common.setCommCode($("#equipCdS"), "EQUIP_CD", null, 3);//공통코드 세팅
	common.setCommCode($("#shareUseYnS"), "SH_USE_YN", null, 2, function(dataList) {
		$(this).find("option[value=D]").remove();//'삭제' 옵션제거
	});

	//공통코드세팅*****

	//초기화(조회)
	$('#clearButton').click(clearButton);

	/**
	 * 그리드
	 */
	setGrid();


});


function search() {
	var param = common.makeConditionsParam();//조회조건 파라미터
	$.ajax({
		url: '/rs/equip/selectShEndEquipInfo',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(param),
		beforeSend: function(jqXHR, settings) {
			showLoad();
		},
		success: function(result) {
			$("#pqgrid_div").pqGrid("option", "dataModel.data", result);
			$("#pqgrid_div").pqGrid("refreshDataAndView");
			console.log(result);
		},
		error: function(error) {
			console.log('error::::' + error);
			hideLoad();
		},
		complete: function() {
			hideLoad();
		}
	});
}
function showLoad() {
	$("#pqgrid_div").pqGrid("option", "strLoading", "Loading..");
	$("#pqgrid_div").pqGrid("showLoading");

}
function hideLoad() {
	$("#pqgrid_div").pqGrid("hideLoading");
	$("#pqgrid_div").pqGrid("option", "strLoading", $.paramquery.pqGrid.defaults.strLoading);
}


function selectBoxSet() {
	$("#pqgrid_div").pqGrid("option", "dataModel.data", []);
	$("#pqgrid_div").pqGrid("refreshDataAndView");
}
function deleteSh() {
	var allData = $("#pqgrid_div").pqGrid("option", "dataModel.data");
	var equipCd = $('#equipCdS').val();
	var checkedRows = allData.filter(function(rowData) { return rowData.isSelected; });
	var selectedEquipNo = checkedRows.map(function(rowData) {
		return {
			"equipNo": rowData.EQUIP_ID,
			"equipCd": equipCd
		};
	});
	if (selectedEquipNo.length == 0) {
		alert("선택된 내용이 없습니다.");
		return;
	}
	var isConfirmed;
	isConfirmed = confirm("공유를 종료하시겠습니까?");
	if (isConfirmed) {

		$.ajax({
			type: 'POST',
			url: '/rs/equip/deleteShEndEquip',  // 실제로 데이터를 처리할 서버 URL
			data: JSON.stringify(selectedEquipNo),
			contentType: 'application/json',
			dataType: 'json',
			beforeSend: function(jqXHR, settings) {
				showLoad();
			},
			success: function(response) {
                
				alert('종료되었습니다.'); // 사용자에게 알림을 표시합니다.
				search();
			},
			error: function(error) {
				// 서버로부터 응답이 실패로 돌아왔을 때 실행할 코드
				console.log('Error occurred:', error);
			},
			complete: function() {
				hideLoad();
			}
		});
	}
}

function clearButton() {
	gridInit();
	searchInit();
}

function searchInit() {
	$(".setting-grid").find("select:not(#equipCdS), input, radio, textarea").val("");
}

function gridInit() {
	rowData = null;
	$("#pqgrid_div").pqGrid("option", "dataModel.data", []);
	$("#pqgrid_div").pqGrid("refreshDataAndView");
}


function setGrid() {
	var colModel = [
		{
			title: "기자재ID",
			align: "center",
			dataType: "string",
			dataIndx: "EQUIP_ID"
		},
		{
			title: "기자재구분",
			align: "center",
			dataType: "string",
			dataIndx: "EQUIP_CD"
		},
		{
			title: "기자재명",
			align: "center",
			dataType: "string",
			dataIndx: "EQUIP_NM"
		},
		{
			title: "기자재업체",
			align: "center",
			dataType: "string",
			dataIndx: "CP_CD"
		},
		{
			title: "공유기간구분",
			align: "center",
			dataType: "string",
			dataIndx: "SH_PRD_CLS"
		},
		{
			title: "공유기본기간",
			align: "center",
			dataType: "string",
			dataIndx: "SH_PRD"
		},
		{
			title: "공유기본수량",
			align: "center",
			dataType: "string",
			dataIndx: "SH_QTY"
		},
		{
			title: "야간사용여부",
			align: "center",
			dataType: "string",
			dataIndx: "SH_SQU"
		},
		{
			title: "휴일사용여부",
			align: "center",
			dataType: "string",
			dataIndx: "SH_LK_CLS"
		},

		{
			title: "공유금액",
			align: "center",
			dataType: "string",
			dataIndx: "SH_PRC"
		},
		{
			title: "공유게시기한",
			align: "center",
			dataType: "string",
			dataIndx: "SH_LT_DT"
		},
		{
			title: "공유여부",
			align: "center",
			dataType: "string",
			dataIndx: "SH_USE_YN"
		}
	];

	var obj = {
		width: '100%',
		height: '99%',
		colModel: colModel,
		showTop: false,
		colModel: [{
			title: "", width: 30, type: "checkbox", dataType: "bool", align: "center", dataIndx: "isSelected", editable: function(ui) {
				//공유여부가 '공유등록' 또는 '공유신청' 일 경우만 체킹 가능
				if (ui.rowData) {
					var shUseYn = ui.rowData["SH_USE_YN"];
					if (shUseYn == "등록" || shUseYn == "신청") {
						return true;
					}
				}
			}, editModel: { keyUpDown: false }, cb: { all: false, header: true }
		}].concat(colModel),
		scrollModal: "auto",
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		editable: false,
		selectionModel: {
			type: "row",
			mode: "single"
		}
	};
	//var grid = $("#pqgrid_div").pqGrid(obj);
	var gridId = "pqgrid_div";//그리드 ID
	this.gridCmmn = new GridUtil(colModel, location.pathname, gridId, obj);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridCmmn.open();//그리드 생성
	this.grid = gridCmmn.getGrid();//그리드 객체
}

