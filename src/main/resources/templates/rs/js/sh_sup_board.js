/*
 * 전역변수
 */
	let grid;
	let gRow = null;
	
    $(function () {
		fnEvent();
		setGrid();
		setDate();
    });
    
    // grid 기본 셋팅
    function setGrid() {
		let columns = [
			{ title: "수요자ID", width: '33%', dataType: "string", dataIndx: "CON_ID", align: "center" },
            { title: "수요자명", width: '33%', dataType: "string", dataIndx: "CON_NM", align: "center" },
            { title: "공유구분", width: '34%', dataType: "string", dataIndx: "MAT_CD_NM", align: "center" }
		];
		let options = {
            width: '100%',
            height: '99%',
            colModel: columns,
            //important option
            editable: false,          
            showTop: false,
            numberCell: false,
            selectionModel: { type: 'row', mod:'single' },
            stripeRows: true,           
            columnBorders: true,
            rowBorders: true,
            reactive: true,
            roundCorners: false,
//            scrollModel: {autoFit: true},            
            showHeader: true,	            
            cellClick: fnSearchDetail
        };

        grid = pq.grid("#pqgrid_div", options);
	}
	
	// 조회기간 기본 셋팅
    function setDate() {
    	let today = new Date();
		let year = today.getFullYear();
		let month = ('0' + (today.getMonth() + 1)).slice(-2);
		let day = ('0' + today.getDate()).slice(-2);
		
		let prevDate =  new Date(new Date().setDate(day - 7));
		let prevYear = prevDate.getFullYear();
		let prevMonth = ('0' + (prevDate.getMonth() + 1)).slice(-2);
		let prevDay = ('0' + prevDate.getDate()).slice(-2);
		
		let fromDate = prevYear + '-' + prevMonth  + '-' + prevDay;
		let toDate = year + '-' + month  + '-' + day;
		$("[id='schFromDate']").val(fromDate);
		$("[id='schToDate']").val(toDate);
	}
	
	// event 영역
	function fnEvent() {
		// 조회 버튼
		$("#btnSearch").on("click", function() {
			$("[id='com_no']").val("");
			$("[id^='edit']").val("");
			fnSearch();
		});
		
		// 검색부분 초기화 버튼
		$("#btnReset").on("click", function() {
			$("[id^='sch']").val("");
			$("[id='com_no']").val("");
			$("[id^='edit']").val("");
			grid.option("dataModel.data", []);
			grid.refreshDataAndView();
			setDate();
		});

		// 저장 버튼
		$("#btnSave").on("click", function() {
			let param = common.makeEditsParam();//수정항목 파라미터
			if(!param.hasOwnProperty('com_no')){
				alert("소통 내역을 선택해주세요");
				return;
			}
			if(fnValCheck()) {
				fnModify(); // 기존건 수정
			}			
		});
	}
	
	// 조회조건 기준 소통응답 기본 정보 조회(grid)
	function fnSearch() {
		let param = common.makeConditionsParam();//조회조건 파라미터
		$.ajax({
			type:"GET",
			dataType:"json",
			url:"/rs/board/selectShBoardList",
			data: Object.assign(param, {type: 'sup'}),
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert(data.error);
					return;
				}
				//데이터 초기화
				fnGridInit();
				
				//데이터 ADD
				grid.option("dataModel.data", data.dataList);
				grid.refreshDataAndView();
			},
			error:function(e){
				alert(e);
			}   
		});
	}
	
	// grid 에서 선택한 row의 상세 소통응답 정보 조회
	function fnSearchDetail(event, ui) {
		let com_no = ui.rowData["COM_NO"];
		$.ajax({ 
			type:"GET",
			dataType:"json",
			url:"/rs/board/selectShBoardDetailInfo/"+com_no,
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert(data.error);
					return;
				}
				//데이터
				$("[id='com_no']").val("");
				$("[id^='edit']").val("");
				let resultData = data.dataList;
				let mappingResult = common.setValToComp(resultData);//결과 TO 콤포넌트 맵핑
			},
			error:function(e){
				alert(e);
			}   
		});
	}
	
	// 선택한 소통응답 정보 수정.
	function fnModify() {
		let param = common.makeEditsParam();//수정항목 파라미터
		var selectRow = grid.SelectRow().getSelection()[0];
		param.type = 'sup';
		param.matCd = selectRow.rowData.MAT_CD;
		param.comConId = selectRow.rowData.CRE_USER_ID;
		param.shNo = selectRow.rowData.SH_NO;

		// return;
		$.ajax({ 
			type:"PUT",
			dataType:"json",
			url:"/rs/board/updateShBoardInfo",
			data: param,
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert("저장 중 오류가 발생했습니다. \n관리자에게 문의해 주세요");
					return;
				}
				alert("저장되었습니다.");
				$("[id='com_no']").val("");
				$("[id^='edit']").val("");
				fnSearch();
				
			},
			error:function(e){
				alert("저장 중 오류가 발생했습니다. \n관리자에게 문의해 주세요");
			}   
		});
	}
	
	// grid 초기화
	function fnGridInit() {
		gRow = null;
		grid.option("dataModel.data", []);
		grid.refreshDataAndView();
	}
	
	// 필수 값 항목 체크
	function fnValCheck() {
		let result = true;
		$("[id^='edit']").each(function(idx, item) {
			let id = "#"+ item.id;
			let name = $(id).attr("alt");
			
			if(!$(id).is(":disabled")) {
				let length = $(id).val().length;
				if(length == 0){
					alert("필수 입력값인 "+name+" 항목이 입력되지 않았습니다.");
					item.focus();
					result = false;
				} else if(length > 500) {
					alert(name+" 항목을 500자 이내로 입력해주세요");
					item.focus();
					result = false
				}
			}
		});
		return result;
	}