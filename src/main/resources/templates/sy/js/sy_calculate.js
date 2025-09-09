var sy_calculate = {
	gMsg: { // [r, c, u, d][c, s, f]||[cm]_[99] // [read, create, update, delete][confirm, success, fail] or [common]
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
	},
	gGrid: null,
	gGridDtl: null,
	gColumn1: null,
	gColumn2: null,
	gOptions1: null, 
	gOptions2: null,
	ready: function(){
		$("#condMonth").val(common.getToday(7));
		common.setCommCode($("#condContractYn"), "CONTRACTYN", null, 2, function(){
			$(this).find("option[value=N]").remove();
			$(this).find("option[value=D]").remove();
		});
		
		$("#search").click(sy_calculate.search);
		$("#init").click(sy_calculate.init);
		$("#save").click(sy_calculate.save);
		$("#searchDtl").click(sy_calculate.searchDtl);
		$("#viewMaster").click(sy_calculate.showMst);
		
		$("#test").on("click", function(){
			sy_calculate.showDtl()
		});
		
		sy_calculate.set();
	},
	set: function(){ // rendering
		sy_calculate.gColumn1 = [
			{title: "업체명", 	dataType: "string", dataIndx: "CP_NM", 			halign: "center", align: "left"},
			{title: "사업자등록번호", 	dataType: "string", dataIndx: "BIZ_NO",			halign: "center", align: "center",
		    	render: function(ui) {
					return ui.rowData?.BIZ_NO?.replace(/[^0-9]/g, "").replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3').replace("--", "-");
				}},
		    {title: "대표자명", 	dataType: "string", dataIndx: "RPNM", 			halign: "center", align: "left"},
		    {title: "총사용료", 	dataType: "string", dataIndx: "MON_TOT_FEE",	halign: "center", align: "right"},
		    {title: "정산여부", 	dataType: "string", dataIndx: "CONTRACT_YN", 	halign: "center", align: "center", 
				editor: {
					type: "select", options: common.getCommCodeList("CONTRACTYN")
				},
	            render: function (ui) {
	                var option = ui.column.editor.options.find(function (obj) {
	                    return (obj[ui.cellData] != null);
	                });
	                return option ? option[ui.cellData] : "";
	            }
			}
		];
		
		sy_calculate.gOptions1 = {
	        width: '100%',
	        height: '99%',
	        showTop: false,
	        editable: false,
	        selectionModel: {type: 'row', mode: 'single'}
	    };
	    
	    var gridCmmn1 = new GridUtil(sy_calculate.gColumn1, location.pathname, "sy_calculate_pqgrid_div1", sy_calculate.gOptions1);
		gridCmmn1.open();
		sy_calculate.gGrid = gridCmmn1.getGrid();
	    sy_calculate.gGrid.on("cellDblClick", sy_calculate.cellDblClick);
	    
	    sy_calculate.gColumn2 = [
			{title: "사용월", 		dataType: "string", dataIndx: "MONTH", 		halign: "center", align: "center"},
		    {title: "시스템 사용료", 	dataType: "string", dataIndx: "SYSTEM_FEE",	halign: "center", align: "right"},
		    {title: "클라우드 사용료", 	dataType: "string", dataIndx: "CLOUD_FEE", 	halign: "center", align: "right"},
		    {title: "총사용료", 		dataType: "string", dataIndx: "TOT_FEE",	halign: "center", align: "right"},
		    {title: "VAT", 			dataType: "string", dataIndx: "VAT",		halign: "center", align: "right"}
		];
		
		sy_calculate.gOptions2 = {
	        width: '100%',
	        height: '99%',
	        showTop: false,
	        editable: false,
	        selectionModel: {type: 'row', mode: 'single'}
	    };
	    
	    var gridCmmn2 = new GridUtil(sy_calculate.gColumn2, location.pathname, "sy_calculate_pqgrid_div2", sy_calculate.gOptions2);
		gridCmmn2.open();
		sy_calculate.gGridDtl = gridCmmn2.getGrid();
		sy_calculate.gGridDtl.on("cellClick", sy_calculate.cellClick);
	},
	cellDblClick: function(event, ui){ // 행 선택
		sy_calculate.showDtl();
		
		$("#condYear").val(ui.rowData.condMonth.split("-")[0]);
		$("#dtlCondCpNm").val(ui.rowData.CP_NM);
		$("#dtlCondCpCd").val(ui.rowData.CP_CD);
		$("#dtlCondBizNo").val(ui.rowData.BIZ_NO);
		
		sy_calculate.searchDtl();
	},
	cellClick: function(event, ui){ // 행 선택
		for (var data in ui.rowData) {
			var text = (ui.rowData[data]) ? ui.rowData[data] : ""; 
			$("#" + common.sToC(data)).text(text);
		}
	},
	init: function(){ // 초기화
		sy_calculate.searchInit();
		sy_calculate.gridInit();
	},
	searchInit: function(){ // 검색영역 초기화
		$(".setting-grid").find("select, input, radio, textarea").val("");
		$("#condMonth").val(common.getToday(7));
	},
	searchInitDtl: function(){ // 검색영역 초기화
		$(".setting-grid").find("select, input, radio, textarea").val("");
		$("#condMonth").val(common.getToday(7));
	},
	gridInit: function(){ // 그리드 초기화
		sy_calculate.gGrid.option("dataModel.data", []);
		sy_calculate.gGrid.refreshDataAndView();
	},
	gridInitDtl: function(){ // 그리드 초기화
		sy_calculate.gGridDtl.option("dataModel.data", []);
		sy_calculate.gGridDtl.refreshDataAndView();
	},
	search: function(){ // 조회
		if($("#condMonth").val() == ""){
			alert("년월을 선택해주세요");
			return;
		}
		
		sy_calculate.gridInit();
		var param = common.makeConditionsParam();
		$.ajax({ 
			type: "POST",
			dataType: "json",
			url: "/sy/calculate/getCalTarget",
			data: param,
			beforeSend: function () {
				sy_calculate.gGrid.option("strLoading", "Searching...");
				sy_calculate.gGrid.showLoading();
			},
			success:function(data){
				if(!data.error){
					sy_calculate.gGrid.option("dataModel.data", data.data);
					sy_calculate.gGrid.refreshDataAndView();	
				}else{
					alert(data.error);
				}
			},
			complete: function () {
				sy_calculate.gGrid.hideLoading();
				sy_calculate.gGrid.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
			},
			error:function(e){
				alert("error: " + sy_calculate.gMsg.kr.rf_01);
			}
		});
	},
	searchDtl: function(){ // 상세조회
		sy_calculate.gridInitDtl();
		var param = common.makeConditionsParam();
		$.ajax({ 
			type: "POST",
			dataType: "json",
			url: "/sy/calculate/getCalculate",
			data: param,
			beforeSend: function () {
				sy_calculate.gGridDtl.option("strLoading", "Searching...");
				sy_calculate.gGridDtl.showLoading();
			},
			success:function(data){
				if(!data.error){	
					sy_calculate.setDataDtl(data.data);
				}else{
					alert(data.error);
				}
			},
			complete: function () {
				sy_calculate.gGridDtl.hideLoading();
				sy_calculate.gGridDtl.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
			},
			error:function(e){
				alert("error: " + sy_calculate.gMsg.kr.rf_01);
			}
		});
	},
	save: function(){ // 사용료 정산
		var selectRow = sy_calculate.gGrid.SelectRow().getSelection()[0];
		if(!selectRow){
			alert(sy_calculate.gMsg.kr.cm_02);
			return;
		}
		
		var row = selectRow.rowData;
		var month = Number(row.condMonth.split("-")[1]);
		var year = Number(row.condMonth.split("-")[0]);
		
		if(row.CONTRACT_YN == "C"){
			alert("이미 정산 처리되었습니다.");
			return;
		}
		
		row.condYear = year;
		if(confirm(row.CP_NM + "의 " + month + "월 사용료를 정산 처리하시겠습니까?")){
			$.ajax({ 
				type: "POST",
				dataType: "json",
				url: "/sy/calculate/saveCalculate",
				data: row,
				beforeSend: function () {
					sy_calculate.gGrid.option("strLoading", "Saving...");
					sy_calculate.gGrid.showLoading();
				},
				success: function(data){
					if(!data.error){
						sy_calculate.showDtl();
						sy_calculate.setDataDtl(data.data);
					}else{
						alert(data.error);
					}
				},
				complete: function () {
					sy_calculate.gGrid.hideLoading();
					sy_calculate.gGrid.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
				},
				error:function(e){
					alert("error: " + sy_calculate.gMsg.kr.rf_01);
				}
			});
		}
	},
	showMst: function(){
		$(".master").show();
		$(".detail").hide();
	
		$(".tab-contents").removeClass("Ptype11");
		$(".tab-contents").addClass("Ptype04");
	
		//sy_calculate.gGrid = pq.grid($("#sy_calculate_pqgrid_div1"), sy_calculate.gOptions1);
		sy_calculate.gridInit();
		sy_calculate.search();
	},
	showDtl: function(){
		$(".master").hide();
		$(".detail").show();
	
		$(".tab-contents").removeClass("Ptype04");
		$(".tab-contents").addClass("Ptype11");
	
		sy_calculate.setDateSelectBox();
	},
	setDataDtl: function(datas){
		if(datas && datas.length > 0){
			sy_calculate.gGridDtl.option("dataModel.data", datas);
			sy_calculate.gGridDtl.refreshDataAndView();
			
			var datas = datas[0];
			$("#condYear").val(datas.YEAR);
			$("#dtlCondCpNm").val(datas.CP_NM);
			$("#dtlCondCpCd").val(datas.CP_CD);
			$("#dtlCondBizNo").val(datas.BIZ_NO?.replace(/[^0-9]/g, "").replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'));
			
			for (var data in datas){
				var text = (datas[data]) ? datas[data] : "";
				$("#" + common.sToC(data)).text(text);
			}		
		}
	},
	setDateSelectBox: function(){
		var now = new Date();
		var now_year = now.getFullYear();
		
		for(var i = now_year; i >= now_year-10; i--){
			$("#condYear").append("<option value='"+ i +"'>"+ i + " 년" +"</option>");
		}
	}
}
$(document).ready(sy_calculate.ready);