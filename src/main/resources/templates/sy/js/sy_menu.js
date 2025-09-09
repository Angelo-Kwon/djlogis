console.log("스크립트 START : " + window.location.href);

var sy_menu = {

	sys_list : [],
	gGrid : {},


	getSystemList: function() {
		var rgroup_id = localStorage.getItem('rgroupId');
		
		$.ajax({
			type: "POST",
			dataType: "json",
			async: false,
			url:"/sy/menu/getSystemList",
			success: function(data, status, res) {
				var dataList = data.dataList;
				$("#systemId").append("<option value=\"\">전체</option>");
				for(var i=0;i<dataList.length;i++){
					var data = dataList[i];
					sy_menu.sys_list.push({[data.SYSTEM_ID] : data.SYSTEM_NM});
					$("#systemId").append("<option value=\""+data.SYSTEM_ID+"\">"+data.SYSTEM_NM+"</option>");
				}
				sy_menu.setGrid_menu();
			},
			error:function(e){
				console.log(e);
			}  
		});
	},
	
	setGrid_menu: function() {
		var columns = [
			{
				title: "메뉴ID",
				dataType: "string",
				dataIndx: "MENU_ID",
				hidden: true
			},
			{
				title: "메뉴PID",
				dataType: "string",
				dataIndx: "MENU_PID",
				hidden: true
			},
			{
				title: "메뉴구분",
				dataType: "string",
				dataIndx: "MENU_GBN",
				hidden: true
			},
			{
				title: "메뉴명",
				//width: "25%",
				align: "center",
				dataType: "string",
				dataIndx: "MENU_NM",
				sortable : false
			},
			{
				title: "메뉴Key",
				//width: "15%",
				align: "center",
				dataType: "string",
				dataIndx: "MENU_KEY",
			},
			{
	            title: "시스템명",
				//width: "15%",
				align: "center",
				dataType: "string",
				dataIndx: "SYSTEM_ID",
	            editor: {
	                type: 'select',
	                options: sy_menu.sys_list
	            },
	            //render required to display options text corresponding to value stored in the cell.
	            render: function (ui) {
	                var option = ui.column.editor.options.find(function (obj) {
	                    return (obj[ui.cellData] != null);
	                });
	                return option ? option[ui.cellData] : "";
	            },
	        },
	        {
				title: "서비스포트",
				halign: "center",
				align: "left",
				dataType: "string",
				dataIndx: "SVC_PORT",
			},
	        {
				title: "프로그램 URL",
				//width: "35%",
				halign: "center",
				align: "left",
				dataType: "string",
				dataIndx: "PRGM_URL",
			},
			{
				title: "순번",
				//width: "9%",
				halign: "center",
				align: "right",
				dataType: "string",
				dataIndx: "MENU_SEQ",
			},
			{
				title: "하위여부",
				dataType: "string",
				dataIndx: "CHILD_EXIST",
				hidden: true
			},
			{
				title: "권한여부",
				dataType: "string",
				dataIndx: "ROLE_EXIST",
				hidden: true
			}
		];
		var options = {
			width: '100%',
			height: '99%',
			//colModel: columns,
			editable: true,
			dataModel: { data: [], recIndx: "MENU_ID" },
			trackModel : { on: true },
			selectionModel: { type: 'row', mode: 'single'},
			showTop: false,
			//numberCell: false,
			treeModel: {
	            dataIndx: 'MENU_NM',
	            id: 'MENU_ID',
	            parentId: 'MENU_PID',
	            format: "flat"
	        }
		};
		//sy_menu.gGrid = pq.grid($("#pqgrid_div1"), options);
		
		var gridId = "sy_menu_pqgrid_div1";//그리드 ID
		gridCmmn = new GridUtil(columns, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
		gridCmmn.open();//그리드 생성
		sy_menu.gGrid = gridCmmn.getGrid();//그리드 객체
	
	},
	
	search_menu: function() {
		var param = common.makeConditionsParam();//조회조건 파라미터
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/menu/getMenuList",
			data: param,
			beforeSend: function() {
				sy_menu.gGrid.showLoading();			
			},
			success: function(data) {
				sy_menu.gGrid.option("dataModel.data", data.dataList);
				sy_menu.gGrid.refreshDataAndView();
			},
			error: function(e) {
				alert(e);
			},
			complete: function(e) {
				sy_menu.gGrid.hideLoading();
			},
		});
	},
	
	//상위행추가
	fn_addRowM: function(){
	    var ri;
	    var newRow = { MENU_ID: "tmp"+Math.random(), MENU_PID: "", MENU_GBN: "M"};
	
		sy_menu.gGrid.Tree().addNodes([newRow])
		
		//get rowIndx of newly inserted row.
		ri = sy_menu.gGrid.getRowIndx({ rowData: newRow }).rowIndx;
		
		sy_menu.gGrid.scrollRow({ rowIndx: ri }, function () {
		    sy_menu.gGrid.editFirstCellInRow({ rowIndx: ri })
		});
	},
	
	//하위행추가
	fn_addRowP: function(){
	    var sel = sy_menu.gGrid.SelectRow().getSelection();
	    if(sel.length < 1)
			return;
	    var parent = sel[0].rowData;
		if(parent.MENU_GBN == "P") {
			parent = sy_menu.gGrid.Tree().getParent( parent );
		}
		if ( sel.length && parent ) {
		    var newRow = { MENU_ID: "tmp"+Math.random(), MENU_PID: parent.MENU_ID, MENU_GBN: "P", SYSTEM_ID: parent.SYSTEM_ID};
		
		    sy_menu.gGrid.Tree().expandNodes([parent]);
		
		    //append new node to selected parent.
		    sy_menu.gGrid.Tree().addNodes([newRow], parent);
		
		    //get rowIndx of newly inserted row.
		    var ri = sy_menu.gGrid.getRowIndx({ rowData: newRow }).rowIndx;
		    sy_menu.gGrid.scrollRow({ rowIndx: ri }, function () {
		        sy_menu.gGrid.editFirstCellInRow({ rowIndx: ri })
		    });
		}
		else {
		    alert("Select parent node");
		}
	},
	
	//행삭제
	fn_delRow: function(){
		if(confirm("삭제하시겠습니까?")) {
			var selrows = sy_menu.gGrid.SelectRow().getSelection();
			selrows.forEach(function(sel) {
				if(sel.rowData.CHILD_EXIST == "Y") {
					alert("해당 메뉴에 등록된 하위메뉴가 있어 삭제할 수 없습니다.");
					return;
				}
				if(sel.rowData.ROLE_EXIST == "Y") {
					alert("해당 메뉴에 등록된 권한이 있어 삭제할 수 없습니다.");
					return;
				}
				sy_menu.gGrid.deleteRow({rowIndx: sel.rowIndx});
				
				alert("삭제 후 저장 버튼을 클릭하세요");
			});
		}
	},
	
	//저장
	fn_save: function() {
		if(sy_menu.gGrid.isDirty()) {
			var gridChanges = sy_menu.gGrid.getChanges({ format: 'byVal' });
			
			var chkVal = sy_menu.checkRequiredFields(sy_menu.gGrid, {"MENU_KEY":"메뉴Key", "SYSTEM_ID":"시스템명", "MENU_NM":"메뉴명", "MENU_SEQ":"순번"} );
			if (chkVal != "") {
				alert(chkVal + "은(는) 필수 입력값입니다.");
				return;
			}
			
			$.ajax({
	            url: "/sy/menu/saveGrid",
				data: {
	                list: JSON.stringify( gridChanges )
	            },
	            dataType: "json",
	            type: "POST",
	            async: true,
	            beforeSend: function (jqXHR, settings) {
	                sy_menu.gGrid.showLoading();
	            },
	            success: function (changes) {
					alert("저장되었습니다.");
	                sy_menu.search_menu();
	            },
	            complete: function () {
	                sy_menu.gGrid.hideLoading();
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
	
	//행삭제_s
	fn_delRow_s: function(){
		if(confirm("삭제하시겠습니까?")) {
			var selrows = grid_s.SelectRow().getSelection();
			selrows.forEach(function(sel) {
				if(sel.rowData.HASROLE == "Y") {
					alert("해당 메뉴가 사용중인 권한별 메뉴 정보가 있어 삭제할 수 없습니다.");
					return;
				}
				grid_s.deleteRow({rowIndx: sel.rowIndx});
			});
		}
	}
}

$(function() {
	
	sy_menu.getSystemList();
	
	$("#btnSearch").click(sy_menu.search_menu);//조회 버튼
	$("#btnAddRowM").click(sy_menu.fn_addRowM);//행추가 버튼
	$("#btnAddRowP").click(sy_menu.fn_addRowP);//행추가 버튼
	$("#btnDelRow").click(sy_menu.fn_delRow);//행삭제 버튼
	$("#btnSave").click(sy_menu.fn_save);//저장 버튼
	
});
