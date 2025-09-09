   /* 
	 ------------------------------------------
	  - js Name   : mdmc06.js
	  - Description    : 공통그룹코드 등록
	  ------------------------------------------
	*/ 
	
var sy_comm_grp_cd_reg = {	
	
	grid : {},
	
	setGrid_Column : function () {
		//Grid
		var columns = [
			{ title: "공통그룹코드",  dataType: "string", align: "center", width: "40%", dataIndx: "CMGRPCD", validations: [{ type: 'maxLen', value: 10, msg: "최대 10자리입니다" }]},
			{ title: "공통그룹코드명", dataType: "string", align: "left", halign: "center", width: "40%", dataIndx: "CMGRPNM", validations: [{ type: 'maxLen', value: 50, msg: "최대 50자리입니다" }]},
			{
				title: "사용여부",
				width: "20%",
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
			dataModel: { data: [], recIndx: "ROWKEY" },
			trackModel : { on: true },
			selectionModel: { type: 'row', mode: 'single'},
			showTop: false,
		};
		sy_comm_grp_cd_reg.grid = pq.grid($("#pqgrid_div"), options);
	},
	
	fn_Search : function ()
	{
		var param = common.makeConditionsParam();//조회조건 파라미터
		param.pid = "0";
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/commgrp/getMdmc06List",
			data: param,
			success: function(data) {
				sy_comm_grp_cd_reg.grid.option("dataModel.data", data);
				sy_comm_grp_cd_reg.grid.refreshDataAndView();
			},
			error: function(e) {
				alert("조회 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요");
			},
			complete: function(e) {
			},
		});
	},
	
	fn_ClearAll : function ()
	{
		$(".search-conditions").find("select,input,radio,textarea").val("");
		sy_comm_grp_cd_reg.grid.option("dataModel.data", []);
		sy_comm_grp_cd_reg.grid.refreshDataAndView();
		// sy_comm_grp_cd_reg.fn_Search();
	},
	
	fn_AddRow : function ()
	{
		let rowData = {
		   			state : "Y"
	   		}
	
	    	let rowIndx = sy_comm_grp_cd_reg.grid.addRow({
	    		rowData: rowData
	    	});
			sy_comm_grp_cd_reg.grid.goToPage({ rowIndx: rowIndx });
			sy_comm_grp_cd_reg.grid.editFirstCellInRow({ rowIndx: rowIndx });
		
	},
	
	fn_DelRow : function ()
	{
		if(confirm("삭제하시겠습니까?")) {
			var selrows = sy_comm_grp_cd_reg.grid.SelectRow().getSelection();
			selrows.forEach(function(sel) {
				sy_comm_grp_cd_reg.grid.deleteRow({rowIndx: sel.rowIndx});
			});
			alert("삭제 후 저장 버튼을 클릭하세요");
		}
		
	},
	
	fn_Save : function ()
	{
		if(sy_comm_grp_cd_reg.grid.isDirty()) {
			var gridChanges = sy_comm_grp_cd_reg.grid.getChanges({ format: 'byVal' });
			var chkVal = checkRequiredFields(
				   sy_comm_grp_cd_reg.grid,
				   {    "CMGRPCD":"공통그룹코드",
						"CMGRPNM": "공통그룹코드명"
				   }
			 );
			if (chkVal != "") {
				alert(chkVal + "은(는) 필수 입력값입니다.");
				return;
			}
			
			$.ajax({
	            url: "/sy/commgrp/saveGrid",
				data: {
	                list: JSON.stringify( gridChanges )
	            },
	            dataType: "json",
	            type: "POST",
	            async: true,
	            beforeSend: function (jqXHR, settings) {
	                sy_comm_grp_cd_reg.grid.option("strLoading", "Saving..");
	                sy_comm_grp_cd_reg.grid.showLoading();
	            },
	            success:function(data, status, res){
					//오류확인
					if(data.error){
						alert(data.error);
						return;
					}	
					alert("저장 되었습니다.");
					//data 조회
	                sy_comm_grp_cd_reg.fn_Search();
	            },
	            error: function(e) {
					alert("저장 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요" ); //ms.mdu1.savingError=저장 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요.
				},
	            complete: function () {
	                sy_comm_grp_cd_reg.grid.hideLoading();
	                sy_comm_grp_cd_reg.grid.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
	            }
	        });
		}
		
	}
}

$(function() {
	sy_comm_grp_cd_reg.setGrid_Column();
	
	$("#btnSearch").click(sy_comm_grp_cd_reg.fn_Search);//조회 버튼
	$("#btnReset").click(sy_comm_grp_cd_reg.fn_ClearAll);//상단 초기화 버튼
	$("#btnAddRow").click(sy_comm_grp_cd_reg.fn_AddRow);//행추가 버튼
	$("#btnDelRow").click(sy_comm_grp_cd_reg.fn_DelRow);//행삭제 버튼
	$("#btnSave").click(sy_comm_grp_cd_reg.fn_Save);//저장 버튼
	$(".search-edit").find("select,input,radio,textarea").change(function(){isEdit=true;});//EDITS 수정여부
	$(".search-conditions").keydown(function(e){if(e.keyCode==13){fn_Search();}});//조회 조건 엔터키 입력 이벤트
	
	common.setCommCode($("#ACTYN"), 	"USEYN", null, 2, function(){ // 사용여부
		$(this).find("option[value=S]").remove();
	});
	
	sy_comm_grp_cd_reg.fn_Search();
});