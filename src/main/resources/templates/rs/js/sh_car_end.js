console.log("스크립트 START : " + window.location.href);

/*
 * 전역변수
 */
var grid;
var gridDataList;

$(function(){
	/*
	 * 콤포넌트 세팅
	 */
	common.setNumOnly("condCarNo","condBrNo");//숫자만
	common.setCommCode($("#condShUseYn"),"SH_USE_YN",null,2,function(dataList){
		$(this).find("option[value=D]").remove();//'삭제' 옵션제거
	});

	/*
	 * 콤포넌트 이벤트 처리
	 */
	$("#btnSearch").click(search);//조회 버튼
	$(".search-conditions input").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#btnSearch").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
		}
	});
	$("#btnClearAll").click(function(){location.reload();});//상단 초기화 버튼
	$("#btnShareEnd").click(save);//공유종료 버튼
	$(".search-conditions").keydown(function(e){if(e.keyCode==13){search();}});//조회 조건 엔터키 입력 이벤트
	
	/*
	 * 그리드
	 */
	setGrid();
});

/*
 * 그리드
 */
function setGrid(){
	//Grid
	var columns = [
		{
			title: "",
			align: "center",
			type: 'checkbox',
      dataType: 'bool',
      dataIndx: "CHK",
      /*render: function(ui){
				//공유여부가 '공유등록' 또는 '공유신청' 이 아닌경우 체크박스 미생성
					var shUseYn = ui.rowData["SH_USE_YN"];
				  if(!(shUseYn == "R" || shUseYn == "A")){
						return {
	            text: "",
	        	};
					}	
			},*/
      editable: function(ui){
				//공유여부가 '공유등록' 또는 '공유신청' 일 경우만 체킹 가능
				if(ui.rowData){
					var shUseYn = ui.rowData["SH_USE_YN"];
				  if(shUseYn == "R" || shUseYn == "A"){
						return true;
					}	
				}
			},
		 	cb: {
          all: false,  // checkbox selection in the header affect current page only.
          header: true // show checkbox in header. 
	        }
    },
		{
			title: "차량ID",
			align: "center",
			dataType: "string",
			dataIndx: "CAR_ID",
		},
		
		
		{
			title: "차량번호(FULL)",
			align: "center",
			dataType: "string",
			dataIndx: "CAR_FULL_NO",
		},
		{
			title: "공유여부",
			align: "center",
			dataType: "string",
			dataIndx: "SH_USE_YN",
			 render: function(ui) {
                var shareStatus = ui.cellData;
                switch (shareStatus) {
                    case 'R':
                        return '등록';
                    case 'A':
                        return '신청';
                    case 'S':
                        return '승인';
                    case 'E':
                        return '종료';
                   
                }
            }
        },
		{
			title: "차량번호",
			align: "center",
			dataType: "string",
			dataIndx: "CAR_NO",
		},
		{
			title: "운송사",
			align: "center",
			dataType: "string",
			dataIndx: "CAR_CP_NM",
		},
		{
			title: "공유기간구분",
			align: "center",
			dataType: "string",
			dataIndx: "SH_PRD_CLS",
		},
		{
			title: "공유기본기간",
			align: "center",
			dataType: "string",
			dataIndx: "SH_PRD",
		},
		{
			title: "야간사용여부",
			align: "center",
			dataType: "string",
			dataIndx: "SH_SQU",
		},
		{
			title: "휴일사용여부",
			align: "center",
			dataType: "string",
			dataIndx: "SH_LK_CLS",
		},
		{
			title: "공유금액",
			align: "center",
			dataType: "string",
			dataIndx: "SH_PRC_FMD",
		},
		{
			title: "공유게시기한",
			align: "center",
			dataType: "string",
			dataIndx: "SH_LT_DT",
		}
	];
  var options = {
		width: '100%',
		height: '99%',
		showTop: false,
		editable: false,
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		selectionModel: {type: 'row', mode: 'single'} ,
    //colModel: columns,
    //dataModel: {data: dataList},
  };
  //this.grid = pq.grid($("#pqgrid_div"),options);
  var gridId = "pqgrid_div";//그리드 ID
	var progNm = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	var gridCmmn = new GridUtil(columns, progNm, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	gridCmmn.open();//그리드 생성
	this.grid = gridCmmn.getGrid();//그리드  
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

/*
 * 조회 : 차량 기본정보 조회
 */
function search(e){
	//EDTIS 초기화
	$(".info-edit").find("select,input,radio,textarea").val("");
	//그리드 수정가능 : 데이터 그리드 입력을 위한 기초 세팅
	grid.option("editable", true);

	var param = common.makeConditionsParam();//조회조건 파라미터
	//로딩바 SHOW
	grid.showLoading();
	//호출
	$.ajax({ 
		type:"POST",
		dataType:"json",
		url:"/rs/car/getCarShareEndTrgtList",
		data:param,
		success:function(data, status, res){
			//오류확인
			if(data.error){
				alert(data.error);
				return;
			}
			//데이터 초기화
			var totalRows = grid.getTotalRows();
			for(var idx=0 ;  idx < totalRows ; idx++){
				grid.deleteRow({rowList:[{rowIndx: 0 }]});
			}
			//데이터 ADD
			gridDataList = data.dataList;
			gridDataList.forEach(function(item,index){
				grid.addRow(
				    {newRow:item}
				);
			});
		},
		error:function(e){
			alert(e);
		},
		complete:function(e){
			//로딩바 HIDE
			grid.hideLoading();
			//그리드 수정가능 : 데이터 그리드 입력을 위한 기초 세팅
			grid.option("editable", false);
			//그리드 리프레시 : 비활성화 체크박스 디자인변경 처리
			grid.refreshDataAndView();
		},
	});
}

/*
 * 저장
 */
function save(e){
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
	//로딩바 SHOW
	grid.showLoading();
	//호출
	$.ajax({ 
		type:"POST",
		dataType:"json",
		url:"/rs/car/endCarShareInfo",
		data:param,
		success:function(data, status, res){
			//오류확인
			if(data.error){
				alert(data.error);
				return;
			}
			//결과 알람
			alert("저장 되었습니다.");
		},
		error:function(e){
			alert(e);
		},
		complete:function(e){
			//로딩바 HIDE
			grid.hideLoading();
			//그리드 수정가능 : 데이터 그리드 입력을 위한 기초 세팅
			grid.option("editable", false);
			//EDITS 수정여부
			isEdit = false;
			//재조회 
			search();
		}
	});
}