console.log("스크립트 START : " + window.location.href);

var sy_role = {
	
	grid_role: {},
	grid_menu: {},
	grid_whouse: {},
	
	getSystemList: function() {
		$.ajax({
			type: "POST",
			dataType: "json",
			async: false,
			url:"/sy/menu/getSystemList",
			success: function(data, status, res) {
				var dataList = data.dataList;
				//$("#systemId").append("<option value=\"\">전체</option>");
				for(var i=0;i<dataList.length;i++){
					var data = dataList[i];
					$("#systemId").append("<option value=\""+data.SYSTEM_ID+"\">"+data.SYSTEM_NM+"</option>");
				}
			},
			error:function(e){
				console.log(e);
			}  
		});
	},
	
	setGrid_role: function() {
		//Grid
		var columns = [
			{
				title: "권한ID",
				dataType: "string",
				dataIndx: "RGROUP_ID",
				hidden: true
			},
			{
				title: "권한 Code",
				//width: "40%",
				align: "center",
				dataType: "string",
				dataIndx: "RGROUP_KEY",
				editable: true,
			},
			{
				title: "권한명",
				//width: "60%",
				halign: "center",
				align: "left",
				dataType: "string",
				dataIndx: "RGROUP_NM",
				editable: true,
			}
		];
		var options = {
			width: '100%',
			height: '99%',
			editable: false,
			//colModel: columns,
			dataModel: { data: [], recIndx: "RGROUP_ID" },
			trackModel : { on: true },
			selectionModel: { type: 'row', mode: 'single'},
			showTop: false,
			//numberCell: false,
		};
		//grid_role = pq.grid($("#pqgrid_div1"), options);
		
		var gridId = "sy_role_pqgrid_div1";//그리드 ID
		gridCmmn = new GridUtil(columns, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
		gridCmmn.open();//그리드 생성
		sy_role.grid_role = gridCmmn.getGrid();//그리드 객체
		//그리드 이벤트처리
		sy_role.grid_role.on("cellClick", sy_role.grid_cell_click_role);
	
	},
	
	setGrid_menu: function() {
		//Grid
		var columns = [
			{
				title: "메뉴ID",
				dataType: "string",
				dataIndx: "MENU_ID",
				hidden: true
			},
			{
				title: "권한ID",
				dataType: "string",
				dataIndx: "RGROUP_ID",
				hidden: true
			},
			{
				title: "권한별메뉴ID",
				dataType: "string",
				dataIndx: "RMENU_ID",
				hidden: true
			},
			{
				title: "메뉴명",
				//width: "30%",
				align: "center",
				dataType: "string",
				dataIndx: "MENU_NM"
			},
			{
				title: "메뉴Code",
				//width: "20%",
				align: "center",
				dataType: "string",
				dataIndx: "MENU_KEY",
			},
			{
				title: "프로그램 URL",
				//width: "30%",
				halign: "center",
				align: "left",
				dataType: "string",
				dataIndx: "PRGM_URL",
			},
			{
				title: "순번",
				//width: "15%",
				halign: "center",
				align: "right",
				dataType: "string",
				dataIndx: "MENU_SEQ",
			}
		];
		var options = {
			width: '100%',
			height: '99%',
			//colModel: columns,
			editable: false,
			dataModel: { data: [], recIndx: "MENU_ID" },
			trackModel : { on: true },
			selectionModel: { type: 'row', mode: 'single'},
			showTop: false,
			//numberCell: false,
			treeModel: {
	            dataIndx: 'MENU_NM',
	            id: 'MENU_ID',
	            parentId: 'MENU_PID',
	            cbId: 'STATE',
	            format: "flat",
	            checkbox: true,
	            checkboxHead: false,
	            cascade: true
	        },
	        check: function(event, ui) {
				console.log(ui);
			}
		};
		//grid_menu = pq.grid($("#pqgrid_div2"), options);
		
		var gridId = "sy_role_pqgrid_div2";//그리드 ID
		gridCmmn = new GridUtil(columns, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
		gridCmmn.open();//그리드 생성
		sy_role.grid_menu = gridCmmn.getGrid();//그리드 객체
		
	},
	
	setGrid_whouse: function() {
	
		//Grid
		var columns = [
			{
		 		title: "",	align: "center", dataType: 'bool', dataIndx: "STATE", type: 'checkBoxSelection', 
			 	cb: {all: true, 
			 		 header: true, 
			 		 check: 1,
	                 uncheck: 0
	                },
	            render: function (ui) {                            
					ui.rowData.STATE == true || ui.rowData.STATE == 1  ? ui.rowData.STATE = 1 : ui.rowData.STATE = 0;
	                return {}
	            },
		        editable: true
			},
			{
				title: "창고 Code",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "WAREKEY"
			},
			{
				title: "창고명",
				halign: "center",
				align: "left",
				dataType: "string",
				dataIndx: "WHNAMLC"
			}
		];
		var options = {
			width: '100%',
			height: '99%',
			editable: false,
			dataModel: { data: [], recIndx: "WAREKEY" },
			selectionModel: { type: 'row', mode: 'single'},
			showTop: false,
		};
		
		var gridId = "sy_role_pqgrid_div3";//그리드 ID
		gridCmmn = new GridUtil(columns, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
		gridCmmn.open();//그리드 생성
		sy_role.grid_whouse = gridCmmn.getGrid();//그리드 객체
		
	},
	
	grid_cell_click_role: function(event, ui) {
		sy_role.search_grid_menu();
		sy_role.search_grid_whouse();
	},
	
	//상단 조회
	search_grid_role: function() {
		var param = common.makeConditionsParam();//조회조건 파라미터
		param.pid = "0";
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/role/getRoleList",
			data: param,
			beforeSend: function() {
				sy_role.grid_role.showLoading();
			},
			success: function(data) {
				sy_role.grid_role.option("dataModel.data", data.dataList);
				sy_role.grid_role.refreshDataAndView();
				
				sy_role.grid_menu.option("dataModel.data", []);
				sy_role.grid_menu.refreshDataAndView();
				sy_role.grid_whouse.option("dataModel.data", []);
				sy_role.grid_whouse.refreshDataAndView();
			},
			error: function(e) {
				alert(e);
			},
			complete: function(e) {
				sy_role.grid_role.hideLoading();
			},
		});
	},
	
	//상단 초기화
	search_reset: function() {
		$("#rgroupNm").val("");
		$("#systemId option:eq(0)").prop("selected", true);
		
		for(var i=1; i<4; i++){
			$("#sy_role_pqgrid_div"+ i).pqGrid("option", "dataModel.data", []);
			$("#sy_role_pqgrid_div"+ i).pqGrid("refreshDataAndView");
		}
	
	},
	
	//권한 행추가
	fn_addRow: function(){
		rowIdx = sy_role.grid_role.addRow({newRow:{RGROUP_KEY: "", RGROUP_NM: "" }});
		
		sy_role.grid_role.scrollRow({ rowIndx: rowIdx }, function () {
		    sy_role.grid_role.editFirstCellInRow({ rowIndx: rowIdx })
		});
	},
	
	//권한 행삭제
	fn_delRow: function(){
		if(confirm("삭제하시겠습니까?")) {
			var selrows = sy_role.grid_role.SelectRow().getSelection();
			selrows.forEach(function(sel) {
				sy_role.grid_role.deleteRow({rowIndx: sel.rowIndx});
			});
			alert("삭제 후 저장 버튼을 클릭하세요");
		}
	},
	
	//권한 저장
	fn_save_role: function() {
		if(sy_role.grid_role.isDirty()) {
			var gridChanges = sy_role.grid_role.getChanges({ format: 'byVal' });
			
			var chkVal = sy_role.checkRequiredFields(sy_role.grid_role, {"RGROUP_KEY":"권한 Code", "RGROUP_NM":"권한명"} );
			if (chkVal != "") {
				alert(chkVal + "은(는) 필수 입력값입니다.");
				return;
			}
				
			$.ajax({
	            url: "/sy/role/saveRole",
				data: {
	                list: JSON.stringify( gridChanges )
	            },
	            dataType: "json",
	            type: "POST",
	            async: true,
	            beforeSend: function (jqXHR, settings) {
	//                sy_role.grid_role.option("strLoading", "Saving..");
	                sy_role.grid_role.showLoading();
	            },
	            success: function (changes) {
					alert("저장되었습니다.");
	                sy_role.search_grid_role();
	            },
	            complete: function () {
	                sy_role.grid_role.hideLoading();
	//                sy_role.grid_role.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
	            }
	        });
		}
	},
	
	checkRequiredFields: function(_g, _fields) {
		var gridChanges = _g.getChanges({ format: 'byVal' });
		const allLists = [...gridChanges.addList, ...gridChanges.updateList];
		for (const item of allLists) {
			for (const field in _fields) {
				if (item[field] == undefined || item[field] == null || item[field] == "") {
					return _fields[field];
				}
			}
		}
		return "";
	},
		
	//메뉴 조회
	search_grid_menu: function() {
		var rid;
		var pids = sy_role.grid_role.SelectRow().getSelection();
		if(pids.length > 0) {
			rid = pids[0].rowData.RGROUP_ID;
		} else {
			return;
		}
		var param = common.makeConditionsParam();//조회조건 파라미터
		param.rid = rid;
		param.sid = $("#systemId").val();
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/role/getRoleMenuList",
			data: param,
			beforeSend: function() {
				sy_role.grid_menu.showLoading();
			},
			success: function(data) {
				sy_role.grid_menu.option("dataModel.data", data.dataList);
				sy_role.grid_menu.refreshDataAndView();
			},
			error: function(e) {
				alert(e);
			},
			complete: function(e) {
				sy_role.grid_menu.hideLoading();
				//그리드 수정가능 : 데이터 그리드 입력을 위한 기초 세팅
				//grid_menu.option("editable", false);
				//그리드 히스토리 초기화 : grid.History().undo() 처리용.
				sy_role.grid_menu.History().reset();
			},
		});
	},
	
	// 권한 그룹별 창고 목록 조회
	search_grid_whouse: function() {
		var rid;
		var pids = sy_role.grid_role.SelectRow().getSelection();
		if(pids.length > 0) {
			rid = pids[0].rowData.RGROUP_ID;
		} else {
			return;
		}
		var param = common.makeConditionsParam();//조회조건 파라미터
		param.rid = rid;
		param.sid = $(".sy_role #systemId").val();
		
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/role/getRoleWhouseList",
			data: param,
			beforeSend: function() {
				sy_role.grid_whouse.showLoading();
			},
			success: function(data) {
				sy_role.grid_whouse.option("dataModel.data", data.dataList);
				sy_role.grid_whouse.refreshDataAndView();
			},
			error: function(e) {
				alert(e);
			},
			complete: function(e) {
				sy_role.grid_whouse.hideLoading();
				//그리드 수정가능 : 데이터 그리드 입력을 위한 기초 세팅
				//grid_menu.option("editable", false);
				//그리드 히스토리 초기화 : grid.History().undo() 처리용.
				sy_role.grid_whouse.History().reset();
			},
		});
	},
	
	// 권한 그룹별 창고 저장
	fn_save_whouse: function() {
	
		var rid = sy_role.grid_role.SelectRow().getSelection()[0].rowData.RGROUP_ID;
		var gridChanges = sy_role.grid_whouse.getChanges({ format: 'byVal' });
		
		if(gridChanges.updateList){		
		   $.ajax({
		        url: "/sy/role/saveRoleWhouse",
				data: {
					rid: rid,
		        	list: JSON.stringify(gridChanges)
		        },
		        dataType: "json",
		        type: "POST",
		        async: true,
		        beforeSend: function (jqXHR, settings) {
		            sy_role.grid_whouse.showLoading();
		        },
		        success: function (changes) {
					alert("저장되었습니다.");
		            sy_role.search_grid_whouse();
		        },
		        complete: function () {
		            sy_role.grid_whouse.hideLoading();
		        }
		    });
		}
	    
	},
	
	//메뉴 저장
	fn_save_menu: function() {
		var rid = sy_role.grid_role.SelectRow().getSelection()[0].rowData.RGROUP_ID;
		var gridData = sy_role.grid_menu.option("dataModel.data");
		
		sy_role.grid_menu.showLoading();
		
		for(var i=0; i<gridData.length; i++){
			$.ajax({
		        url: "/sy/role/saveRoleMenu",
				data: {
		            rid: rid,
		            list: JSON.stringify( [ gridData[i] ] )
		        },
		        dataType: "json",
		        type: "POST",
		        async: true,
		    });	
		} 
		
	    alert("저장되었습니다.");
	    sy_role.search_grid_menu();
	    sy_role.grid_menu.hideLoading();
	}
}

$(function() {
		
	sy_role.getSystemList();
	
	sy_role.setGrid_role();	//권한 그리드
	sy_role.setGrid_menu();	//메뉴 그리드
	sy_role.setGrid_whouse(); //창고 그리드
	
	$("#btnSearch").click(sy_role.search_grid_role);//상단 조회 버튼
	$("#btnClearAll").click(sy_role.search_reset);//상단 초기화 버튼
	$("#btnAddRow").click(sy_role.fn_addRow);//권한 행추가 버튼
	$("#btnDelRow").click(sy_role.fn_delRow);//권한 행삭제 버튼
	$("#btnSave_role").click(sy_role.fn_save_role);//권한 저장 버튼
	
	$("#systemId").change(sy_role.search_grid_menu);//시스템 선택 시 조회
	$("#btnSave_menu").click(sy_role.fn_save_menu);//메뉴 저장 버튼
	$("#btnSave_whouse").click(sy_role.fn_save_whouse);//창고 권한 저장 버튼
	
	/*
	$("#systemId").on("change", function(){
		search_grid_menu();
	});
	*/
	//search_grid_role();


});

