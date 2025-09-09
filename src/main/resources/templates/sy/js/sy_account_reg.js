   /* 
	 ------------------------------------------
	  - js Name   : mdmc09.js
	  - Description    : 어카운트업체 등록
	  ------------------------------------------
	*/ 
var sy_account_reg = {
	grid : {},
	grid_prt : {},
	
	colIndex : null,
	rowIndex : null,
	
	//어카운트 목록
	getActList : function() {
		$.ajax({
			type: "POST",
			dataType: "json",
			url:"/sy/atct/getMdmc09ActList",
			success: function(data, status, res) {
			//var	test = JSON.stringify(data)
				var dataList = data.dataList;				
				var userActid = data.userActid;
				$("#ACTCD").append("<option value=\"\">전체</option>");
				for(var i=0;i<dataList.length;i++){
					var data = dataList[i];
					$("#ACTCD").append("<option value=\""+data.ACTCD+"\">"+data.ACTCD + " : " + data.ACTNM+"</option>");				
				}
				var selectAct = document.getElementById('ACTCD');
				selectAct.value = userActid;	
				
				// 어카운트코드 첫번째 항목 선택
				$("#ACTCD option:eq(0)").prop("selected", true);		
			},
			error:function(e){
				console.log(e);
			}  
		});
	},
	
	setGrid_Column : function() {
		//Grid
		var columns = [
			/*{ title: "*어카운트코드", dataType: "string", align: "center", width:"8%",dataIndx: "ACTCD"},
			{ title: "어카운트명", dataType: "string", align: "left", halign: "center", editable:false, width: "8%", dataIndx: "ACTNM",
				render: function(ui){
					let actnm = '';
					if(ui.rowData.ACTNM == undefined){
						actnm = '';
					}else{
						actnm = ui.rowData.ACTNM;
					}
					return actnm + "  <img src='../assets/ic_bt_search.png'/>";
				}
			},		*/
	       /* { title: "*업체코드", dataType: "string", align: "center", width: "8%", dataIndx: "CUSTCD"},*/

			{ title: "업체명", dataType: "string", align: "left", halign: "center", editable:true, width: "8%", dataIndx: "CUSTNM", styleHead: {'background-color': '#FAF4C0'}
			/*	render: function(ui){
					let custnm = '';
					if(ui.rowData.CUSTNM == undefined){
						custnm = '';
					}else{
						custnm = ui.rowData.CUSTNM;
					}
					return custnm + "  <img src='../assets/ic_bt_search.png'/>";
				}*/
			},
			{ title: "사업자등록번호", dataType: "string", align: "center", editable:true, width: "8%", dataIndx: "REGNO", styleHead: {'background-color': '#FAF4C0'},
				render: function(ui) {
					return ui.rowData?.REGNO?.replace(/[^0-9]/g, "").replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3').replace("--", "-");
				}
			},
			{ title: "법인등록번호", dataType: "string", align: "center", editable:true, width: "8%", dataIndx: "CPNO",
				render: function(ui){
					return ui.rowData?.CPNO?.replace(/[^0-9]/g, "").replace(/(\d{6})(\d{7})/, '$1-$2').replace("--", "-");
				}
			},
			{ title: "국가코드", dataType: "string", align: "center", editable:true, width: "8%", dataIndx: "NATCD"},
			{ title: "사업장소재지", dataType: "string", align: "left", halign: "center", editable:true, width: "8%", dataIndx: "ADR", styleHead: {'background-color': '#FAF4C0'}},
			{ title: "우편번호", dataType: "string", align: "center", editable:true, width: "8%", dataIndx: "ZIPCD", styleHead: {'background-color': '#FAF4C0'}},
			{ title: "업태", dataType: "string", align: "left", halign: "center", editable:true, width: "8%", dataIndx: "BUTY"},
			{ title: "종목", dataType: "string", align: "left", halign: "center", editable:true, width: "8%", dataIndx: "BUITM"},
			{ title: "대표자명", dataType: "string", align: "left", halign: "center", editable:true, width: "8%", dataIndx: "RPNM", styleHead: {'background-color': '#FAF4C0'}},
			{ title: "개업일자", dataType: "string", align: "center", editable:true, width: "8%", dataIndx: "BOD",
				render: function(ui){
					return ui.rowData?.BOD?.replace(/[^0-9]/g, "").replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3').replace("--", "-");
				}
			},
			{ title: "폐업일자", dataType: "string", align: "center", editable:true, width: "8%", dataIndx: "BCD",
				render: function(ui){
					return ui.rowData?.BCD?.replace(/[^0-9]/g, "").replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3').replace("--", "-");
				}},
			{ title: "담당자", dataType: "string", align: "left", halign: "center", editable:true, width: "8%", dataIndx: "PCHG"},
			{ title: "연락처", dataType: "string", align: "center", editable:true, width: "8%", dataIndx: "PHNM",
				render: function(ui){
					return ui.rowData?.PHNM?.replace(/[^0-9]/g, "").replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, `$1-$2-$3`).replace("--", "-");
				}
			},
			{ title: "이메일", dataType: "string", align: "left", halign: "center", editable:true, width: "8%", dataIndx: "PREML"},
			{
				title: "사용여부",
				width: "10%",
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
			dataModel: { data: [], recIndx: "CUSTCD" },
			trackModel : { on: true },
			selectionModel: { type: 'row', mode: 'single'},
			showTop: false,
			//cellDblClick: sy_account_reg.fn_dbClickEvt
		};
		sy_account_reg.grid = pq.grid($("#sy_account_reg_pqgrid_div"), options);
	},
	
	fn_dbClickEvt: function(event, ui) {
			sy_account_reg.colIndex = ui.colIndx;
			sy_account_reg.rowIndex = ui.rowIndx;
			if(sy_account_reg.colIndex == 1 || sy_account_reg.colIndex == 3)
			{
				sy_account_reg.fn_OpenCustPopup();
			}
	},
	
	setGrid_Prt_Column : function() {
		//Grid
		var columns = [
			{ title: "업체코드", dataType: "string", align: "center",editable: false, width: "20%", dataIndx: "CUSTCD"},
			{ title: "업체명", dataType: "string", align: "center",editable: false, width: "20%", dataIndx: "CUSTNM"}, 
			{ title: "사업자등록번호", dataType: "string", align: "center", editable:false, width: "20%", dataIndx: "REGNO"},
			{ title: "법인등록번호", dataType: "string", align: "center", editable:false, width: "0%", hidden:true, dataIndx: "CPNO"},
			{ title: "국가코드", dataType: "string", align: "center", editable:false, width: "0%", hidden:true, dataIndx: "NATCD"},
			{ title: "사업장소재지", dataType: "string", align: "center", editable:false, width: "0%", hidden:true, dataIndx: "ADR"},
			{ title: "우편번호", dataType: "string", align: "center", editable:false, width: "0%", hidden:true, dataIndx: "ZIPCD"},
			{ title: "업태", dataType: "string", align: "center", editable:false, width: "20%", dataIndx: "BUTY"},
			{ title: "종목", dataType: "string", align: "center", editable:false, width: "20%", hidden:true, dataIndx: "RPNM"},
			{ title: "대표자명", dataType: "string", align: "center", editable:false, width: "20%", dataIndx: "RPNM"},
			{ title: "개업일자", dataType: "date", align: "center", editable:false, width: "0%", hidden:true, dataIndx: "BOD"},
			{ title: "폐업일자", dataType: "string", align: "center", editable:false, width: "0%", hidden:true, dataIndx: "BCD"},
			{ title: "담당자", dataType: "string", align: "center", editable:false, width: "0%", hidden:true, dataIndx: "PCHG"},
			{ title: "연락처", dataType: "string", align: "center", editable:false, width: "0%", hidden:true, dataIndx: "PHNM"},
			{ title: "이메일", dataType: "string", align: "center", editable:false, width: "0%", hidden:true, dataIndx: "PREML"}
		];
		var options = {
			width: '100%',
			height: '99%',
			colModel: columns,
			editable : true,
			dataModel: { data: [], recIndx: "ROWKEY" },
			trackModel : { on: true },
			selectionModel: { type: 'row', mode: 'single'},
			showTop: false,
		};
		sy_account_reg.grid_prt = pq.grid($("#pqgrid_div_pqgrid_popup_div"), options);
		sy_account_reg.grid_prt.on("cellDblClick", function(evt, ui){
			var vRowData = ui.rowData;
			var newRowVal;
			
			if(sy_account_reg.colIndex == 1 ){
				newRowVal ={
	                ACTCD: vRowData.CUSTCD,
	                ACTNM: vRowData.CUSTNM                            
	            }
			}else{
				newRowVal = {               
	                CUSTCD: vRowData.CUSTCD,
	                CUSTNM: vRowData.CUSTNM,
	                REGNO: vRowData.REGNO,
	                CPNO: vRowData.CPNO,
	                NATCD: vRowData.NATCD,
	                ADR: vRowData.ADR,
	                ZIPCD : vRowData.ZIPCD,
	                BUTY: vRowData.BUTY,
	                BUITM: vRowData.BUITM,
	                RPNM: vRowData.RPNM,
	                BOD: vRowData.BOD,
	                BCD: vRowData.BCD,
	                PCHG: vRowData.PCHG,
	                PHNM: vRowData.PHNM,
	                PREML: vRowData.PREML                                
	            }
			}
			sy_account_reg.grid.updateRow({
				rowIndx: sy_account_reg.rowIndex,
				newRow: newRowVal,
	            checkEditable:true
			});
			sy_account_reg.grid.refreshRow({rowIndx: sy_account_reg.rowIndex});
			sy_account_reg.fn_CloseCustPopup();
		});
	},
	
	fn_OpenCustPopup : function()
	{
	  $("#modal-background").fadeIn(300);
	  $(".modal-con").css("display", "flex").hide().fadeIn();
	  $("#modal-background, .close").on('click',function(){      
	    if ($(this).hasClass("close")){
	      sy_account_reg.fn_CloseCustPopup();
	    }
	  });
	  
	  sy_account_reg.setGrid_Prt_Column();
	  sy_account_reg.fn_SearchCustPopup();
	
	},
	
	fn_SearchCustPopup : function()
	{
		var param = {
			"srchCUSTNM": $("#srchCUSTNM").val(),
			"srchCUSTCD": $("#srchCUSTCD").val()
		};
		
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/atct/getCustList",
			data: param,
			success: function(data) {
				sy_account_reg.grid_prt.option("dataModel.data", data);
				sy_account_reg.grid_prt.refreshDataAndView();
			},
			error: function(e) {
				alert(e);
			},
			complete: function(e) {
			},
		});
	},
	
	fn_CloseCustPopup : function()
	{
		$("#modal-background").fadeOut(300);
	    $(".modal-con").fadeOut(300);
	},
	
	
	fn_Search : function()
	{	
		var param = common.makeConditionsParam();//조회조건 파라미터
		param.pid = "0";
		sy_account_reg.grid.showLoading();
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/atct/getMdmc09List",
			data: param,
			success: function(data) {
				sy_account_reg.grid.option("dataModel.data", data);
				sy_account_reg.grid.refreshDataAndView();
			},	
			error: function(e) {
				alert("조회 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요");
			},	
			complete: function(e) {
				sy_account_reg.grid.hideLoading();
			},
		});
	},
	
	fn_ClearAll : function()
	{
		$(".search-conditions").find("input,radio,textarea").val("");
		$(".search-conditions").find("select").val("Y");
		sy_account_reg.grid.option("dataModel.data", []);
		sy_account_reg.grid.refreshDataAndView();
		//fn_Search();
	},
	
	fn_AddRow : function()
	{
		let rowData = {
		   			state : "Y",
		   			ACTYN : "Y",
		   			NATCD : "KR"
	   		}
	
	    	let rowIndx = sy_account_reg.grid.addRow({
	    		rowData: rowData
	    	});
			sy_account_reg.grid.goToPage({ rowIndx: rowIndx });
			sy_account_reg.grid.editFirstCellInRow({ rowIndx: rowIndx });
		
	},
	
	fn_DelRow : function ()
	{
		if(confirm("삭제 하시겠습니까?")) {
			var selrows = sy_account_reg.grid.SelectRow().getSelection();
			selrows.forEach(function(sel) {
				sy_account_reg.grid.deleteRow({rowIndx: sel.rowIndx});
			});	
			alert("삭제 후 저장 버튼을 클릭하세요");
		}
		
	},
	
	fn_Save : function ()
	{
		if(sy_account_reg.grid.isDirty()) {
			var gridChanges = sy_account_reg.grid.getChanges({ format: 'byVal' });
			
			var chkVal = checkRequiredFields(
				   sy_account_reg.grid,
				   {    
					   "CUSTNM":"업체명",
	                   "REGNO": "사업자등록번호",
	                   "NATCD": "국가코드",
	                   "ADR": "사업장소재지",
	                   "ZIPCD": "우편번호",
	                   "RPNM": "대표자명",
	                   
				   }
			 );
			if (chkVal != "") {
				alert(chkVal + "은(는) 필수 입력값입니다.");
				return;
			}
			
			var chkFlag = true;
			var updateList = gridChanges.updateList.concat(gridChanges.addList);
			updateList.forEach((x,i) => {
				var chkVal = [
					{
						chkCol: "br_no"
						, chkTitle: "사업자등록번호가"
						, chkVal: x.REGNO
					},
					{
						chkCol: "phone"
						, chkTitle: "연락처가"
						, chkVal: x.PHNM
					},
					{
						chkCol: "email"
						, chkTitle: "이메일이"
						, chkVal: x.PREML
					}
				]
				
				chkVal.forEach(j => {
					if(chkFlag && j.chkVal){
						if(!sy_account_reg.fnValueChk(j.chkCol, j.chkVal)) {
							chkFlag = false;
							alert(j.chkTitle+" 잘못 입력 되었습니다.");
							return;
						}
					}
				});
			});
			
			if(chkFlag){
				gridChanges.list = updateList;
				
				$.ajax({
		            url: "/sy/atct/saveGrid",
					data: {
		                list: JSON.stringify( gridChanges )
		            },
		            dataType: "json",
		            type: "POST",
		            async: true,
		            beforeSend: function (jqXHR, settings) {
		                sy_account_reg.grid.option("strLoading", "Saving..");
		                sy_account_reg.grid.showLoading();
		            },
		            success:function(data, status, res){
						//오류확인
						if(data.error){
							alert(data.error);
							return;
						}	
						//data 조회
		                sy_account_reg.fn_Search();
						alert('저장되었습니다.');
		            },
		            error: function(e) {
						alert("저장 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요" ); //ms.mdu1.savingError=저장 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요.
					},
		            complete: function () {
		               sy_account_reg.grid.hideLoading();
		                gsy_account_reg.rid.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
		            }
		        });
	        }
		}	
	},
	
	// 전화번호 / 이메일 / 사업자등록번호 유효성 체크
	fnValueChk : function(val_type, value) 
	{
		var chk_result = true;
		if(val_type == "phone") {
			let regExp = /^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/     //   /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
		    chk_result = regExp.test(value);
		    
		    if(value.length != 10 && value.length != 11){
				chk_result = false;
			}
		} else if(val_type == "email") {
			let regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
		    chk_result = regExp.test(value);
		} else if(val_type == "br_no") {
			let regExp = /^[0-9]{3}[0-9]{2}[0-9]{5}/  
		    chk_result = regExp.test(value);
		    
		    if(value.length != 10){
				chk_result = false;
			}
		}
		
		return chk_result;
	}
}

$(function() {
	//sy_account_reg.getActList(); // 어카운트 목록 조회
	sy_account_reg.setGrid_Column();
	
	$("#btnSearch").click(sy_account_reg.fn_Search);//조회 버튼
	$("#btnReset").click(sy_account_reg.fn_ClearAll);//상단 초기화 버튼
	$("#btnAddRow").click(sy_account_reg.fn_AddRow);//행추가 버튼
	$("#btnDelRow").click(sy_account_reg.fn_DelRow);//행삭제 버튼
	$("#btnSave").click(sy_account_reg.fn_Save);//저장 버튼
	$(".search-edit").find("select,input,radio,textarea").change(function(){isEdit=true;});//EDITS 수정여부
	
	common.setCommCode($("#ACTYN"), 	"USEYN", null, 3, function(){ // 사용여부
		$(this).find("option[value=S]").remove();
	});
});