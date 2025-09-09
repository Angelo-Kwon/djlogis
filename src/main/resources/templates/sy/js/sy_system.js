/*
 * 전역변수
 */

var sy_system = {
	
	grid : {},
	gridDataList :[],
	changes: null,
	userList : [],
	useYnList : [{'사용': '사용'}, {'미사용': '미사용'}],
	
	/*
	 * 조회 : 담당자 목록 조회
	 */
	getUserList: function() {
		
	},
	
	/*
	 * 그리드
	 */
	setGrid: function() {
		//Grid
		let columns = [
			{
				title: "시스템코드",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "SYSTEM_ID"
			},
			{
				title: "시스템명",
				halign: "center",
				align: "left",
				dataType: "string",
				dataIndx: "SYSTEM_NM",
			},
			{
				title: "담당자",
				halign: "center",
				align: "left",
				dataType: "string",
				dataIndx: "SYSTEM_MANAGER",
				/*editor: {
	                type: 'select',
	                options: userList
	            },
	            render: function (ui) {
					ui.editable = false;
					return ui.cellData;
		            /*var option = ui.column.editor.options.find(function (obj) {
		                return (obj[ui.cellData] != null);
		            });
		            return option ? option[ui.cellData] : "";
		       }*/
			},
			{
				title: "사용료",
				halign: "center",
				align: "right",
				dataType: "integer",
				dataIndx: "SYSTEM_FEE",
				format: function(val){
					let newData;
					if(val){
						let oldData = val.toString().replace(/[^0-9]/g, ""); //숫자만
						newData = oldData.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //3자리 콤마
					}
	            	return newData;
	        	},
			},
			{
				title: "사용여부",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "USE_YN",
				editor: {
	                type: 'select',
	                options: sy_system.useYnList
	            },
	            render: function (ui) {
					ui.editable = true;
					return ui.cellData;
		       },
			}
		];
	
		let options = {
			width: '100%',
			height: '99%',
			showTop: false,
			selectionModel: { type: 'row', mode: 'single' },
			trackModel: { on: true },
			dataModel: { data: [], recIndx: "SYSTEM_ID" },
		};
	
		var gridCmmn = new GridUtil(columns, location.pathname, "pqgrid_div", options);
		gridCmmn.open();
		sy_system.grid = gridCmmn.getGrid();
	},
	
	/*
	 * 조회 : 시스템 관리 기본정보 조회
	 */
	fnSearch: function() {
		// 그리드 수정 : 시스템코드
		sy_system.grid.colModel[0].editable = true;
	
		let param = common.makeConditionsParam();//조회조건 파라미터
	
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "/sy/system/selectOpSystemList",
			data: param,
			success: function(data, status, res) {
				//오류확인
				if (data.error) {
					alert(data.error);
					return;
				}
				//데이터 초기화
				sy_system.fnGridInit();
	
				//데이터 ADD
				sy_system.gridDataList = data.dataList;
				sy_system.grid.option("dataModel.data", sy_system.gridDataList);
				sy_system.grid.refreshDataAndView();
	
				sy_system.changes = sy_system.grid.getChanges();
	
				// 그리드 수정불가 : 시스템코드
				sy_system.grid.colModel[0].editable = false;
			},
			error: function(e) {
				alert(e);
			}
		});
	},
	
	/*
	 * 행추기
	 */
	fnRowAdd: function() {
		sy_system.changes = sy_system.grid.getChanges({ format: 'byVal' });
		sy_system.grid.addRow({ newRow: { USE_YN: "사용" } });
		
		// 그리드 수정불가 : 시스템코드, 사용여부
		sy_system.grid.colModel[0].editable = false;
	},
	
	/*
	 * 행삭제
	 */
	fnRowDel: function() {
		let selrows = sy_system.grid.SelectRow().getSelection();
		sy_system.changes = sy_system.grid.getChanges({ format: 'byVal' });
	
		selrows.forEach(function(sel) {
			let data = sy_system.grid.getData()[sel.rowIndx];
			data.USE_YN = "N";
			
			if(data.SYSTEM_ID){
				data.UPDATE_YN = "Y";						
			}
		});
		
		sy_system.grid.option("dataModel.data", sy_system.gridDataList);
		sy_system.grid.refreshDataAndView();
	},
	
	/*
	 * 저장
	 */
	fnSave: function(param) {
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/system/insertOpSystemInfo",
			data: { list: JSON.stringify(param) },
			success: function(data, status, res) {
				//오류확인
				if (data.error) {
					alert(data.error);
					return;
				}
				//결과 알람
				alert("저장 되었습니다.");
			},
			error: function(e) {
				alert(e);
			},
			complete: function(e) {
				//재조회 
				sy_system.fnSearch();
			}
		});
	},
	
	
	// grid 초기화
	fnGridInit: function() {
		sy_system.gridDataList = null;
		sy_system.grid.option("dataModel.data", []);
		sy_system.grid.refreshDataAndView();
	}
}

$(function() {
	
	//담당자 목록 조회
	//getUserList();
	
	/*
	 * 그리드
	 */
	sy_system.setGrid();

	/*
	 * 콤포넌트 이벤트 처리
	 */
	// 조회 버튼
	$("#btnSearch").on("click", function() {
		sy_system.fnSearch();
	});

	// 검색부분 초기화 버튼
	$("#btnReset").on("click", function() {
		$("[id^='sch']").val("");
		sy_system.grid.option("dataModel.data", []);
		sy_system.grid.refreshDataAndView();
	});

	//  행 삭제 버튼
	$("#btnRowDel").on("click", function() {
		sy_system.fnRowDel();
	});

	//  행 추가 버튼
	$("#btnRowAdd").on("click", function() {
		sy_system.fnRowAdd();
	});

	// 저장 버튼
	$("#btnSave").on("click", function() {
		let delArr = [];

		for (let idx = 0; idx < sy_system.grid.getTotalRows(); idx++) {
			let item = sy_system.grid.getData()[idx];
			if (item["UPDATE_YN"]) {
				delArr.push(item.SYSTEM_ID);
			}
		}
		let param = sy_system.grid.getChanges({ format: 'byVal' });
		param?.updateList.push(...sy_system.changes?.updateList);
		param?.addList.push(...sy_system.changes?.addList);
		param = Object.assign(param, { systemIdList: delArr });
	
		if (param.addList.length == 0 && param.updateList.length == 0
			&& delArr.length == 0) {
			alert("수정된 시스템이 없습니다.");
			return;
		}
		
		sy_system.fnSave(param);
	});
});