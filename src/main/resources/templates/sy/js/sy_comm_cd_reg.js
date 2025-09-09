   /* 
	 ------------------------------------------
	  - js Name   : mdmc07.js
	  - Description    : 공통코드 등록
	  ------------------------------------------
	*/ 
var sy_comm_cd_reg = {
	grid_m : {}, 
	grid : {},
	
	setGrid_cmmgrp : function() {
		//Grid
		var columns = [
			{ title: "공통그룹코드", dataType: "string", align: "center", width: "30%", dataIndx: "CMGRPCD"},
			{ title: "공통그룹코드명", dataType: "string", align: "left", halign: "center", width: "50%", dataIndx: "CMGRPNM"},
			{ title: "사용여부", type: "checkBoxSelection", align: "center", width: "20%", dataIndx: "ACTYN", cb: {all: false, header: false, check:"Y", uncheck:"N"}},
		];
	
		var options = {
			width: '100%',
			height: '99%',
			colModel: columns,
			editable: false,
			dataModel: { data: [], recIndx: "ROWKEY" },
			trackModel : { on: true },
			selectionModel: { type: 'row', mode: 'single'},
			showTop: false,
		};
		sy_comm_cd_reg.grid_m = pq.grid($("#pqgrid_div1"), options);
		
		//그리드 이벤트처리
		sy_comm_cd_reg.grid_m.on("cellClick", sy_comm_cd_reg.grid_cell_click_m);
	
	},
	
	setGrid_cmmcd : function() {
		//Grid
		var columns = [
			{ title: "공통그룹코드", dataType: "string", align: "center", width: 0, hidden: true, dataIndx: "CMGRPCD", validations: [{ type: 'maxLen', value: 10, msg: "최대 10자리입니다" }]},
			{ title: "공통코드", dataType: "string", align: "center", width: "15%", dataIndx: "CMCD", validations: [{ type: 'maxLen', value: 10, msg: "최대 10자리입니다" }]},
			{ title: "공통코드명", dataType: "string", align: "left", halign: "center", width: "25%", dataIndx: "CMNM", validations: [{ type: 'maxLen', value: 50, msg: "최대 50자리입니다" }]},
			{ title: "조회순서", dataType: "string", align: "right", halign: "center", width: "15%", dataIndx: "DPORD", validations: [{ type: 'maxLen', value: 5, msg: "최대 5자리입니다" }]},
			{ title: "참조1", dataType: "string", align: "center", width: "10%", dataIndx: "FLD1", validations: [{ type: 'maxLen', value: 10, msg: "최대 10자리입니다" }]},
			{ title: "참조2", dataType: "string", align: "center", width: "10%", dataIndx: "FLD2", validations: [{ type: 'maxLen', value: 10, msg: "최대 10자리입니다" }]},
			{ title: "참조3", dataType: "string", align: "center", width: "10%", dataIndx: "FLD3", validations: [{ type: 'maxLen', value: 10, msg: "최대 10자리입니다" }]},
			{
				title: "사용여부",
				width: "15%",
				align: "center",
				type: "checkBoxSelection",
				dataIndx: "ACTYN",
				cb: {all: false, header: false, check:"Y", uncheck:"N"}
			}
		];
		var options = {
			width: '100%',
			height: '99%',
			colModel: columns,
			editable: true,
			dataModel: { data: [], recIndx: "CMCD" },
			trackModel : { on: true },
			selectionModel: { type: 'row', mode: 'single'},
			showTop: false,
		};
		sy_comm_cd_reg.grid = pq.grid($("#pqgrid_div2"), options);
	
	},
	
	grid_cell_click_m : function(event, ui) {
		
		sy_comm_cd_reg.fn_search_cmmcd();
	},
	
	fn_search_cmmgrp : function() {
		var param = common.makeConditionsParam();//조회조건 파라미터
		param.pid = "0";
		param.ACTYN = "Y";
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/commgrp/getMdmc06List",
			data: param,
			success: function(data) {
				sy_comm_cd_reg.grid_m.option("dataModel.data", data);
				sy_comm_cd_reg.grid_m.refreshDataAndView();
				
			},		
			complete: function(e) {
				//grid_cell_click_m(e, ui);
			},
		});	
	},
	
	
	fn_search_cmmcd : function() {
		var param = common.makeConditionsParam();//조회조건 파라미터
		var pid;
		var pids = sy_comm_cd_reg.grid_m.SelectRow().getSelection();
		
		if(pids.length > 0) {
			pid = pids[0].rowData.CMGRPCD;
		} else {
			return;
		}	
		
		param.CMGRPCD = pid;	
	
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/commcd/getMdmc07List",
			data: param,
			success: function(data) {
				sy_comm_cd_reg.grid.option("dataModel.data", data);
				sy_comm_cd_reg.grid.refreshDataAndView();
			},
			error: function(e) {
				alert("조회 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요");
			},
			complete: function(e) {
			},
		});
	},
	
	fn_ClearAll : function()
	{
		$(".search-conditions").find("select,input,radio,textarea").val("");
		sy_comm_cd_reg.grid.option("dataModel.data", []);
		sy_comm_cd_reg.grid.refreshDataAndView();
		sy_comm_cd_reg.grid_m.option("dataModel.data", []);
		sy_comm_cd_reg.grid_m.refreshDataAndView()
		// sy_comm_cd_reg.fn_search_cmmgrp();
	},
	
	fn_AddRow : function()
	{
		var pid;
		var pids = sy_comm_cd_reg.grid_m.SelectRow().getSelection();
		
		if(pids.length > 0) {
			pid = pids[0].rowData.CMGRPCD;
		} else {
			return;
		}	
			
		let rowData = {
	        CMGRPCD: pid,
			state : "Y"
		}
		let rowIndx = sy_comm_cd_reg.grid.addRow({
			rowData: rowData
		});
		sy_comm_cd_reg.grid.selection.clear();
	    //alert(" fn_AddRow pid:" + pid + ":: " + rowIndx);	
		sy_comm_cd_reg.grid.goToPage({ rowIndx: rowIndx });
		sy_comm_cd_reg.grid.editFirstCellInRow({ rowIndx: rowIndx });
	},
	
	fn_DelRow : function()
	{
		if(confirm("삭제 하시겠습니까?")) {
			var selrows = sy_comm_cd_reg.grid.SelectRow().getSelection();
				selrows.forEach(function(sel) {
				sy_comm_cd_reg.grid.deleteRow({rowIndx: sel.rowIndx});
			});
			alert("삭제 후 저장 버튼을 클릭하세요");
		}
		
	},
	
	fn_Save : function()
	{
		if(sy_comm_cd_reg.grid.isDirty()) {
			var gridChanges = sy_comm_cd_reg.grid.getChanges({ format: 'byVal' });
			var chkVal = checkRequiredFields(
				   sy_comm_cd_reg.grid,
				   {    "CMGRPCD":"공통그룹코드",
						"CMCD":"공통코드",
						"CMNM": "공통코드명",
						"DPORD":"조회 순서"
				   }
			 );
			if (chkVal != "") {
				alert(chkVal + "은(는) 필수 입력값입니다.");
				return;
			}		
				
			$.ajax({
	            url: "/sy/commcd/saveGrid",
				data: {
	                list: JSON.stringify( gridChanges )
	            },
	            dataType: "json",
	            type: "POST",
	            async: true,
	            beforeSend: function (jqXHR, settings) {
	                sy_comm_cd_reg.grid.option("strLoading", "Saving..");
	                sy_comm_cd_reg.grid.showLoading();
	            },           
	            success:function(data, status, res){
					//오류확인
					if(data.error){
						alert(data.error);
						return;
					}	
					alert("저장 되었습니다.");
					//data 조회            
	                sy_comm_cd_reg.fn_search_cmmcd();
	            }, 
	             error: function(e) {
					alert("저장 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요"); //ms.mdu1.savingError=저장 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요.
				},          
	            complete: function () {
	                sy_comm_cd_reg.grid.hideLoading();
	                sy_comm_cd_reg.grid.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
	            }
	        });
		}
		
	}

}


$(function() {
		
	sy_comm_cd_reg.setGrid_cmmgrp();
	sy_comm_cd_reg.setGrid_cmmcd();
	
	common.setCommCode($("#ACTYN"), 	"USEYN", null, 2, function(){ // 사용여부
		$(this).find("option[value=S]").remove();
	});
	
	$("#btnSearch").click(sy_comm_cd_reg.fn_search_cmmgrp);//조회 버튼
	$("#btnClearAll").click(sy_comm_cd_reg.fn_ClearAll);//상단 초기화 버튼
	$("#btnAddRow").click(sy_comm_cd_reg.fn_AddRow);//행추가 버튼
	$("#btnDelRow").click(sy_comm_cd_reg.fn_DelRow);//행삭제 버튼
	$("#btnSave").click(sy_comm_cd_reg.fn_Save);//저장 버튼
	$(".search-edit").find("select,input,radio,textarea").change(function(){isEdit=true;});//EDITS 수정여부
	$(".search-conditions").keydown(function(e){if(e.keyCode==13){fn_search_cmmgrp();}});//조회 조건 엔터키 입력 이벤트
	
	sy_comm_cd_reg.fn_search_cmmgrp();
});