/*
 * 전역변수
 */
	var grid;
	var gRow = null;
		
    $(function () {
        
        common.setCommCode($("#schShYn"), "SH_USE_YN", null, 2);
        common.setCommCode($("#schShYn"),"SH_USE_YN",null, 2, function(dataList) {
			$(this).find("option[value=D]").remove();//'공유정보삭제' 옵션제거
		});//공통코드
        
		fnEvent();
		setGrid();

    });
    
    // grid 기본 셋팅
    function setGrid() {
		var columns = [
            { title: "", align: "center", type: 'checkBoxSelection', dataType: 'bool', dataIndx: "CHK", 
              editable: function(ui) {
				//공유여부가 '공유등록' 또는 '공유신청' 일 경우만 체킹 가능
			      if(ui.rowData) {
				      var shUseYn = ui.rowData["SH_USE_YN"];
				      if(shUseYn == "R" || shUseYn == "A") {
					      return true;
				      }	
				  }
			  },
			  cb: { all: false,  // checkbox selection in the header affect current page only.
		              header: true // show checkbox in header. 
		      }
			},
            { title: "창고ID", dataType: "string", dataIndx: "WH_ID", align: "left"},
	        { title: "창고명", dataType: "string", dataIndx: "WH_NM", align: "left" },
	        { title: "주소", dataType: "string", dataIndx: "DT_ADDR", align: "left" },
	        { title: "담당자", dataType: "string", dataIndx: "CH_NM", align: "left" },
            { title: "공유여부", dataType: "string", dataIndx: "SH_USE_YN_NM", align: "left" },
            { title: "공유범위구분", dataType: "string", dataIndx: "SH_RNG_CLS_NM", align: "left"},
            { title: "공유층수", dataType: "string", dataIndx: "SH_FLR", align: "right" },
            { title: "공유평수", dataType: "string", dataIndx: "SH_SQU", align: "right" },
            { title: "공유랙구분", dataType: "string", dataIndx: "SH_LK_CLS_NM", align: "left"},
            { title: "공유기간구분", dataType: "string", dataIndx: "SH_PRD_CLS_NM", align: "left" },
            { title: "공유기본기간", dataType: "string", dataIndx: "SH_PRD", align: "right" },
            { title: "공유시작일", dataType: "string", dataIndx: "SH_LT_DT", align: "right" }
        ];
        
		var options = {
	        width: '100%',
            height: '99%',
            //important option 
            editable: false,         
            showTop: false,
            selectionModel: { type: 'row', mod:'single' },
            dataModel: { data: [], recIndx: "WH_ID" },
            numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
            showHeader: true	                
        };
    
        var gridId = "sh_whouse_end_pqgrid_div";//그리드 ID
		this.gridCmmn = new GridUtil(columns, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
		this.gridCmmn.open();//그리드 생성
		this.grid = gridCmmn.getGrid();//그리드 객체
	}
	
	// event 영역
	function fnEvent() {
		// 조회 버튼
		$("#btnSearch").on("click", function() {
			fnSearch();
		});
		
		$(".search-conditions input").keydown(function(e) {
	if (e.keyCode == 13) {
        $("#btnSearch").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
    }
});
		
		// 검색부분 초기화 버튼
		$("#btnReset").on("click", function() {
			$("[id^='sch']").val("");
			gridInit();
		});
		
		// 공유 종료 버튼
		$("#btnShEnd").on("click", function() {
			fnSave();
		});
	}
	
	// 조회조건 기준 창고 기본 정보 조회(grid)
	function fnSearch() {
		var param = common.makeConditionsParam();//조회조건 파라미터
		$.ajax({
			type:"POST",
			dataType:"json",
			url:"/rs/whouse/selectShWhouseEndlInfo",
			data:param,
			beforeSend: function() {
				grid.option("strLoading", "Loding...")
		        grid.showLoading();
		    },
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert(data.error);
					return;
				}
				//데이터 초기화
				gridInit();
				
				//데이터 ADD
				let gridDataList = data.dataList;
				grid.option("dataModel.data", gridDataList);
				grid.refreshDataAndView();
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
	
	// 창고 공유종료 정보 저장.
	function fnSave() {
		var dataList = [];
		for(var idx=0 ; idx < grid.getTotalRows() ; idx++){
			var item = grid.getData()[idx];
			if(item["CHK"]){
				dataList.push(item);
			}
		}
		
		if(dataList.length == 0){
			alert("선택한 공유건이 없습니다.");
			return;
		}
		
		var param = {
			dataList:JSON.stringify(dataList)
		}
		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/rs/whouse/updateShEndWhouseInfo",
			data:param,
			beforeSend: function() {
				grid.option("strLoading", "Loding...")
		        grid.showLoading();
		    },
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert("저장 중 오류가 발생했습니다. \n관리자에게 문의 하여 주세요");
					return;
				}
				alert("공유종료 정보가 저장 되었습니다.");
				fnSearch();
				
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
	
	// grid 초기화
	function gridInit() {
		grid.option("dataModel.data", []);
		grid.refreshDataAndView();
	}

 