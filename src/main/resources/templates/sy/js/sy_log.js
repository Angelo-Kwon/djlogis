let sy_log = {

	grid: null,
	gridDataList: null,
	totalPage: 0,
	page: 0,

	/*
	 * 콤포넌트 이벤트 처리
	 */
	fnEvent: function() {
		// 조회 버튼
		$("#btnSearch").on("click", function() {
			sy_log.fnSearch();
		});

		// 이전 버튼
		$("#btnPrev").on("click", function() {
			if (sy_log.page != 0) {
				sy_log.page--;
				sy_log.fnSearch();
				
				if(sy_log.page == 0){
					$('#btnPrev').attr('class', 'btn-white');
					$('#btnNext').attr('class', 'btn-navy');
				} else {
					$('#btnNext').attr('class', 'btn-navy');
				}
			}
		});

		// 다음 버튼
		$("#btnNext").on("click", function() {
			if (sy_log.totalPage > sy_log.page) {
				sy_log.page++;
				sy_log.fnSearch();
				
				if(sy_log.page == sy_log.totalPage){
					$('#btnPrev').attr('class', 'btn-navy');
					$('#btnNext').attr('class', 'btn-white');
				} else {
					$('#btnPrev').attr('class', 'btn-navy');
				}
			} 
		});
	},

	/*
	 * 그리드
	 */
	setGrid: function() {
		//Grid
		let columns = [
			{
				title: "로그구분",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "LOG_DIV"
			},
			{
				title: "IP",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "LOG_IP"
			},
			{
				title: "로그내용",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "LOG_INFO"
			},
			{
				title: "로그아웃시간",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "LOG_OUT_TIME"
			},
			{
				title: "생성일시",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "CRE_DT"
			},
			{
				title: "로그인ID",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "CRE_USER_ID"
			}
		];

		let options = {
			width: '100%',
			height: '99%',
			showTop: false,
			editable: false,
			trackModel: { on: true },
			dataModel: { data: [], recIndx: "LOG_SEQ" }
		};

		let gridCmmn = new GridUtil(columns, location.pathname, "pqgrid_div", options);
		gridCmmn.open();
		sy_log.grid = gridCmmn.getGrid();
	},

	/*
	 * 조회 : 로그 기본정보 조회
	 */
	fnSearch: function() {
		let param = common.makeConditionsParam();

		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/log/selectLogList",
			data: Object.assign(param, { limit: sy_log.page * 200 }),
			//data: param.toString(),
			success: function(data, status, res) {
				//오류확인
				if (data.error) {
					alert(data.error);
					return;
				}

				//데이터 초기화
				sy_log.fnGridInit();

				//데이터 ADD
				sy_log.gridDataList = data.dataList;
				sy_log.grid.option("dataModel.data", sy_log.gridDataList);
				sy_log.grid.refreshDataAndView();

				// 총 데이터 건 수 저장
				sy_log.totalPage = Math.ceil(data.totalCnt / 200) - 1;

				// 페이지, 이전, 다음 버튼 활성화
				$("#paging").css("display", "");				
				$("#page").val(sy_log.page + 1);
			},
			error: function(e) {
				alert(e);
			}
		});
	},

	// grid 초기화
	fnGridInit: function() {
		sy_log.gridDataList = null;
		sy_log.grid.option("dataModel.data", []);
		sy_log.grid.refreshDataAndView();
	}
}

$(function() {
	sy_log.fnEvent(); // 콤포넌트 이벤트 처리 
	sy_log.setGrid(); // 그리드 세팅

});
