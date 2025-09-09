console.log("스크립트 START : " + window.location.href);

var sy_contract_reg = {
	/*
	 * 전역변수
	 */
	grid:{},
	gridSub:{},
	checkedId:"",//중복체크 통과 ID 
	isEdit:false,
	CUSTCD: '',
	/*
	 * 그리드
	 */
	setGrid:function(){
		//Grid
		var columns = [
			{
				title: "업체코드",
				align: "center",
				dataType: "string",
				dataIndx: "CUSTCD",
				editable: false
			},
			{
				title: "업체명",
				halign: "center",//헤더ALIGN
				align: "left",
				dataType: "string",
				dataIndx: "CUSTNM",
				editable:true,
				styleHead: {'background-color': '#FAF4C0'}
			},
			{
				title: "사업자등록번호",
				align: "center",
				dataType: "string",
				dataIndx: "REGNO",
				editable:true,
				render: function(ui) {
					return ui.rowData?.REGNO?.replace(/[^0-9]/g, "").replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3').replace("--", "-");
				},
				styleHead: {'background-color': '#FAF4C0'}
			},
			{ 
				title: "사업장소재지", 
				dataType: "string", 
				align: "left", 
				halign: "center", 
				dataIndx: "ADR",
				editable:true,
				styleHead: {'background-color': '#FAF4C0'}
			},
			{ 
				title: "우편번호", 
				dataType: "string", 
				align: "center", 
				dataIndx: "ZIPCD",
				editable:true,
				styleHead: {'background-color': '#FAF4C0'}
			},
			{
				title: "대표자명",
				halign: "center",
				align: "left",
				dataType: "string",
				dataIndx: "RPNM",
				editable:true,
				styleHead: {'background-color': '#FAF4C0'}
			}
		];
		var options = {
			width: '100%',
			height: '99%',
			showTop: false,
			editable: true,
			//numberCell: false,
	    	//colModel: columns,
			selectionModel: {type: "row", mode: "single"},
	    	dataModel: { data: [], recIndx: "CUSTCD" },
	  };
		//this.grid = pq.grid($("#pqgrid_div"),options);
		var gridId = "sy_contract_reg_pqgrid_div";//그리드 ID
		var progNm = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
		var gridCmmn = new GridUtil(columns, progNm, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
		gridCmmn.open();//그리드 생성
		sy_contract_reg.grid = gridCmmn.getGrid();//그리드  
		
		//그리드 이벤트처리
		sy_contract_reg.grid.on("cellClick", sy_contract_reg.gridCellClick);
		sy_contract_reg.grid.on("cellDblClick", (e, ui) => console.log(e));
	}
	,
	/*
	 * 그리드
	 */
	setSubGrid:function(){
		//초기화
		//$( "#pqgrid_div" ).pqGrid( "deleteRow", { rowIndx: 1 } );
		
		//Grid
		var columns = [
			{
				title: "시스템",
				halign: "center",
				align: "left",
				dataType: "string",
				dataIndx: "SYSTEM_NM",
			},
			{
				title: "계약금액",
				halign: "center",
				align: "right",
				dataType: "string",
				dataIndx: "CONTRACT_FEE",
			},
			{
				title: "계약기간",
				align: "center",
				dataType: "string",
				dataIndx: "CONTRACT_TERM",
			},
			{
				title: "계약여부",
				align: "center",
				dataType: "string",
				dataIndx: "CONTRACT_YN_NM",
			},
			{
				title: "업체관리자 ID",
				align: "center",
				dataType: "string",
				dataIndx: "LOGIN_ID",
			},
		];
	    var options = {
			width: '100%',
			height: '150',
			showTop: false,
			editable: false,
			//numberCell: false,
			selectionModel: {type: 'row', mode: 'single'} ,
	    //colModel: columns,
	    //dataModel: {data: dataList},
	    };
	    //this.gridSub = pq.grid($("#pqgrid_sub"),options);
			var gridId = "sy_contract_reg_pqgrid_sub";//그리드 ID
			var progNm = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
			var gridCmmn = new GridUtil(columns, progNm, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
			gridCmmn.open();//그리드 생성
			sy_contract_reg.gridSub = gridCmmn.getGrid();//그리드 
	    
	    //그리드 이벤트처리
		sy_contract_reg.gridSub.on("cellClick", sy_contract_reg.gridSubCellClick);
	}
	,
	/*
	 * 그리드 클릭 : 계약 목록 조회
	 */
	gridCellClick:function(event,ui){
		//EDTIS 초기화
		sy_contract_reg.clearEdits();
		//조회조건 파라미터
		var param = {
			 custCd:ui.rowData["CUSTCD"]
		};
		//로딩바 SHOW
		//sy_contract_reg.grid.showLoading();
		//호출
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/sy/contract/getContractList",
			data:param,
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert(data.error);
					return;
				}
				//데이터
				/*if(!data.dataList || data.dataList.length==0){
					alert("계약정보가 없습니다.");
					return;
				}*/
				//데이터 ADD
				sy_contract_reg.gridSub.option("dataModel.data", data.dataList);
				sy_contract_reg.gridSub.refreshDataAndView();
			},
			error:function(e){
				alert(e);
			},
			complete:function(e){
				//로딩바 HIDE
				//sy_contract_reg.grid.hideLoading();
			},
	
		});		
	}
	,
	/*
	 * 그리드 클릭 : 계약 목록 조회
	 */
	gridSubCellClick:function(event,ui){
		//EDTIS 초기화
		sy_contract_reg.clearEdits('subGrid');
		//조회조건 파라미터
		var param = {
			 custCd:ui.rowData["CP_CD"]
			,contractId:ui.rowData["CONTRACT_ID"]
		};
		//로딩바 SHOW
		sy_contract_reg.grid.showLoading();
		//호출
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/sy/contract/getContractList",
			data:param,
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert(data.error);
					return;
				}
				//데이터
				var resultData = data.dataList[0];
				common.setValToComp(resultData);//결과 TO 콤포넌트 맵핑
				//시스템 사용료
				const searchInterval = setInterval(function() {
					if($('#systemList').length > 0){
						clearInterval(searchInterval);
						var systemKeys = resultData["SYSTEM_KEY"]?.split(",");
						systemKeys.forEach(function(item,index){
							$("#is" + item).prop("checked",true);
						});

						$(".check-box input").prop("disabled",true);
					}
				}, 100);
				//클라우드 사용로
				$(":radio[name='cloudFee'][value='" + resultData["CLOUD_FEE"] + "']").prop({disabled: false, checked: true});
			},
			error:function(e){
				alert(e);
			},
			complete:function(e){
				//로딩바 HIDE
				sy_contract_reg.grid.hideLoading();
			},
		});		
	}
	,
	
	/*
	 * 계약기간 시스템 중복 조회
	 */
	getContractTerm(type){
		const promise = new Promise(function(resolve, reject){
			var selectRow = sy_contract_reg.grid?.SelectRow().getSelection()[0];

			var param = {
				cpcd: selectRow?.rowData?.CUSTCD,
				contractStartTerm: $('#contractStartTerm').val(),
				contractEndTerm: $('#contractEndTerm').val(),
			}
			
			if(type == 'subGrid' || !param.cpcd){
				resolve('');
			} else {
				// 호출
				$.ajax({ 
					type:"POST",
					dataType:"json",
					url:"/sy/contract/getContractTerm",
					data: param,
					success:function(data, status, res){
						//오류확인
						if(data.error){
							alert(data.error);
							return;
						}
						resolve(data.data);
					},
					error:function(e){
						alert(e);
					},
					complete:function(e){
					},
				});
			}
		});
		return promise;
	}
	,
	
	/*
	 * 조회 : 시스템 목록
	 */
	getSystemList:function(type){
		const promise = sy_contract_reg.getContractTerm(type);
		promise.then(function(data){
			var contractSystemList = data?.systemKey ? data.systemKey.split(',') : [];
			//호출
			$.ajax({ 
				type:"POST",
				dataType:"json",
				url:"/sy/contract/getSystemList",
				data:{},
				success:function(data, status, res){
					//오류확인
					if(data.error){
						alert(data.error);
						return;
					}
					//데이터 ADD
					var gridDataList = data.dataList;
					var html = "";
					gridDataList.forEach(function(item,index){
						if(!contractSystemList.includes(item.SYSTEM_KEY)){
							html += "<div class='check-box'>";
							html += "	<input type='checkbox' name='systemChk' id='is" + item["SYSTEM_KEY"] + "' systemId='" + item["SYSTEM_ID"] + "' systemNm='" + item["SYSTEM_NM"] + "' fee='" + item["SYSTEM_FEE"] + "' onchange='sy_contract_reg.calcTotalSystemFee()' disabled>" + item["SYSTEM_NM"];
							html += "</div>";
						}
					});
					$("#systemList").html(html);
				},
				error:function(e){
					alert(e);
				},
				complete:function(e){
					$("[id^='is']").prop('disabled', false);
				},
		
			});
		});
	}
	,
	/*
	 * 시스템 총 사용료 계산
	 */
	calcTotalSystemFee:function(){
		var totalSystemFee = 0;
		$("[name=systemChk]:checked").each(function(index,item){
			totalSystemFee += parseInt($(item).attr("fee"));;
		});
		totalSystemFee = String(totalSystemFee).replace(/\B(?=(\d{3})+(?!\d))/g, ",");//3자리 콤마
		$("#totalSystemFee").val(totalSystemFee);
	}
	,
	/*
	 * 조회 : 업체정보 목록
	 */
	search:function(e){
		//초기화
		sy_contract_reg.clearEdits();
		//조회조건 파라미터
		var param = common.makeConditionsParam();
		//로딩바 SHOW
		sy_contract_reg.grid.showLoading();
		//호출
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/sy/contract/getCustInfoList",
			data:param,
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert(data.error);
					return;
				}
				//데이터 ADD
				var gridDataList = data.dataList;
				sy_contract_reg.grid.option("dataModel.data", gridDataList);
				sy_contract_reg.grid.refreshDataAndView();
			},
			error:function(e){
				alert(e);
			},
			complete:function(e){
				//로딩바 HIDE
				sy_contract_reg.grid.hideLoading();
			},
	
		});
	}
	,
	/*
	 * 행추가
	 */
	fn_AddRow : function(){
		let param = common.makeConditionsParam();//조회조건 파라미터	
		let rowData = {
		   			state : "Y",
		   			NATCD : "KR",
		   			ACTYN : "Y"
	   		}
	   		
	    	let rowIndx = sy_contract_reg.grid.addRow({
	    		rowData: rowData
	    	});
			sy_contract_reg.grid.goToPage({ rowIndx: rowIndx });
			sy_contract_reg.grid.editFirstCellInRow({ rowIndx: rowIndx });
		
	},
	/*
	 * 행삭제
	 */
	fn_DelRow : function (){
		if(confirm("삭제 하시겠습니까?")) {
			var selrows = sy_contract_reg.grid.SelectRow().getSelection();
			selrows.forEach(function(sel) {
				sy_contract_reg.grid.deleteRow({rowIndx: sel.rowIndx});
			});	
			alert("삭제 후 저장 버튼을 클릭하세요");
		}
		
	},
	/*
	 * 업체정보 저장
	 */
	fn_Save : function (){
		if(sy_contract_reg.grid.isDirty()) {
			var gridChanges = sy_contract_reg.grid.getChanges({ format: 'byVal' });
			var chkVal = sy_contract_reg.checkRequiredFields(
				   sy_contract_reg.grid,
				   {  
	                    "CUSTNM":"업체명",
	                    "NATCD":"국가코드",
	                    "REGNO":"사업자등록번호",
	                    "ADR":"사업장소재지",
	                    "ZIPCD":"우편번호",
	                    "RPNM":"대표자명"
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
						if(!sy_contract_reg.fnValueChk(j.chkCol, j.chkVal)) {
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
		                sy_contract_reg.grid.option("strLoading", "Saving..");
		                sy_contract_reg.grid.showLoading();
		            },
		            success:function(data, status, res){
						//오류확인
						if(data.error){
							alert(data.error);
							return;
						}	
						
						//data 조회
		                sy_contract_reg.search();
						alert('저장되었습니다.');
		            },
		            error: function(e) {
						alert("저장 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요" ); //ms.mdu1.savingError=저장 중 에러가 발생 하였습니다. 관리자에게 문의해 주세요.
					},
		            complete: function () {
		               sy_contract_reg.grid.hideLoading();
		               sy_contract_reg.grid.option("strLoading", $.paramquery.pqGrid.defaults.strLoading);
		            }
		        });
			}	
		} else {
			alert('수정된 내용이 없습니다.');
		}
	},

	/*
	 * 신규계약등록
	 */
	addContract:function(e){
		//검증
		var selectRow = sy_contract_reg.grid.SelectRow().getSelection()[0];
		if(!selectRow){
			alert("선택한 업체가 없습니다.");
			return;
		}

		//초기화
		sy_contract_reg.clearEdits();
		sy_contract_reg.gridSub.setSelection(null); // 계약정보 그리드 선택 비활성화
		//콤포넌트 활성화
		$(".search-edit").find("select,input,radio,textarea").prop("disabled",false);
		$("#btnCheckIdDup").prop("disabled",false);//중복확인 버튼
		//수정모드
		sy_contract_reg.isEdit = true;
		//초기값
		setTimeout(function() {
			$("#cloudFee1").prop("checked",true);
			$("#isRS").prop("checked",true);
			$("#isRS").prop("disabled",true);//물류공유는 항상 체크상태 유지
			//시스템 총 사용료 계산
			sy_contract_reg.calcTotalSystemFee();
			$("[id^='is']").prop('disabled', false);
		}, 1500);
	}
	,
	/*
	 * ID 중복확인
	 */
	checkIdDup:function(e){
		//ID 중복체크 통과 여부 초기화
		sy_contract_reg.checkedId = "";
		//필수값 체크
		var loginId = $("#loginId").val();
		if(!loginId){
			alert("아이디를 입력해 주세요.");
			return;
		}
		var param = {
			loginId:loginId
		}
		//로딩바 SHOW
		sy_contract_reg.grid.showLoading();
		//호출
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/sy/contract/checkIdDup",
			data:param,
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert(data.error);
					return;
				}
				if(data.dupYn=="N"){
					alert("이용 가능한 ID 입니다.");
					sy_contract_reg.checkedId = loginId;
				}else{
					alert("중복 ID 입니다. 다른 ID를 입력해 주세요.");
				}
			},
			error:function(e){
				alert(e);
			},
			complete:function(e){
				//로딩바 HIDE
				sy_contract_reg.grid.hideLoading();
			},
	
		});
	}
	,
	/*
	 * 저장
	 */
	save:function(e){
		//수정항목 파라미터
		var param = {};
		var selectRow = sy_contract_reg.grid.SelectRow().getSelection()[0];
		var gridDataCnt = sy_contract_reg.gridSub.pdata.length;
		var addTmp = {
			 "custCd":selectRow.rowData.CUSTCD
			,"custNm":selectRow.rowData.CUSTNM
			,"userType":"3PL"
			,"rgroupId":"RG00000001"
			,"subGridCnt": gridDataCnt
		}
		param = Object.assign(common.makeEditsParam(), addTmp);
		var dataList = [];
		var totalSystemFee = param.totalSystemFee.replaceAll(',', '');
		$("[name=systemChk]:checked").each(function(index,item){
			var dataItem = common.makeEditsParam();
			dataItem["systemId"] = $(item).attr("systemId");
			dataItem["systemNm"] = $(item).attr("systemNm");
			dataItem["systemFee"] = $(item).attr("fee");
			if(dataItem["systemFee"] != 0){
				totalSystemFee = totalSystemFee - $(item).attr("fee");
			} else if($("[name=systemChk]:checked").length == (index + 1)){
				dataItem["systemFee"] = totalSystemFee;
			}
			dataList.push(dataItem);
		});
		param["dataList"] = JSON.stringify(dataList);
		//검증
		if(!selectRow){
			alert("선택한 업체가 없습니다.");
			return;
		}
		if(!sy_contract_reg.isEdit){
			alert("신규계약 정보를 입력해주세요.");
			return;
		}
		if(!sy_contract_reg.checkedId){
			alert("ID 중복확인을 해주세요.");
			return;
		}
		//필수체크
		if($("[name=systemChk]:checked").length == 0){
			var title = $("[name=systemChk]").closest(".setting-grid-content").prev().text();
			alert(title + "은(는) 필수 입력값입니다.");
			return false;
		}
		if(!$("#totalSystemFee").val()){
			alert("시스템 사용료은(는) 필수 입력값입니다.");
			return false;
		}
		if(!common.mustCheck("loginId","contractStartTerm","contractEndTerm")){
			return false;
		}
		//일자 검증
		if($("#contractStartTerm").val() > $("#contractEndTerm").val()){
			alert("계약기간이 올바르지 않습니다.");
			return;
		}
		//로딩바 SHOW
		sy_contract_reg.grid.showLoading();
		//호출
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/sy/contract/saveContractList",
			data:param,
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert(data.error);
					return;
				}
				//수정모드
				sy_contract_reg.isEdit = false;
				//조회
				sy_contract_reg.gridCellClick(null,sy_contract_reg.grid.SelectRow().getSelection()[0]);
				//결과 알람
				alert("저장 되었습니다.");
			},
			error:function(e){
				alert(e);
			},
			complete:function(e){
				//로딩바 HIDE
				sy_contract_reg.grid.hideLoading();
			},
		});
	}
	,
	/*
	 * 데이터 초기화 : 전체
	 */
	clearAll:function(){
		//조회조건 초기화
		$(".search-conditions").find("select,input,radio,textarea").val("");
		//Grid 데이터 초기화
		sy_contract_reg.grid.option("dataModel.data", []);
		sy_contract_reg.grid.refreshDataAndView();
		//Grid 데이터 초기화
		sy_contract_reg.gridSub.option("dataModel.data", []);
		sy_contract_reg.gridSub.refreshDataAndView();
		//EDTIS 초기화
		sy_contract_reg.clearEdits();
	}
	,
	/*
	 * 데이터 초기화
	 */
	clearEdits:function(type){
		//EDTIS 초기화
		$(".search-edit").find("select,input,textarea").not("[type=radio],[type=checkbox]").val("");
		$(".search-edit").find("input[type=checkbox]").prop("checked",false);
		//EDITS 비활성화
		$(".search-edit").find("select,input,textarea").prop("disabled",true);
		$(":radio[name='cloudFee']").attr('checked', false);
		$("#btnCheckIdDup").prop("disabled",true);//중복확인 버튼
		// 계약기간 초기화
		$('#contractStartTerm').val(common.getToday(7));
		$('#contractEndTerm').val(common.getToday(7));
		//시스템목록 조회
		sy_contract_reg.getSystemList(type);
		//수정모드 여부
		sy_contract_reg.isEdit = false;
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

$(function(){
	/*
	 * 콤포넌트 세팅
	 */
	common.setBrnoForObj($("#condRegNo"));//사업자등록번호
	common.setEngNumOnlyForObj($("#condCustCd"));//숫자&영문만:업체코드
	common.setNumOnlyForObj($("#condPhNm"));//숫자만:업체연락처
	common.setCommCode($("#condContractYn"),"CONTRACTYN", "Y", 2);//계약여부
	common.setEngNumOnlyForObj($("#loginId"));//영어&숫자만:ID
	common.setNumOnlyWithCommaForObj($("#totalSystemFee"));//숫자만3자리콤마:시스템사용료

	/*
	 * 콤포넌트 이벤트 처리
	 */
	$("#btnSearch").click(sy_contract_reg.search);//조회 버튼
	$("#btnClearAll").click(sy_contract_reg.clearAll);//상단 초기화 버튼
	$("#btnAddRow").click(sy_contract_reg.fn_AddRow);//행추가 버튼
	$("#btnCustSave").click(sy_contract_reg.fn_Save);//저장 버튼
	$("#btnAdd").click(sy_contract_reg.addContract);//신규계약등록 버튼
	$("#btnSave").click(sy_contract_reg.save);//저장 버튼
	$("#btnCheckIdDup").click(sy_contract_reg.checkIdDup);//중복확인 버튼
	$("#loginId").keydown(function(e){//ID 키 입력 이벤트
		sy_contract_reg.checkedId = "";//중복체크 통과 ID 초기화
		if(e.keyCode==13){
			sy_contract_reg.checkIdDup();//중복확인
		}
	});
	$(".search-conditions").keydown(function(e){if(e.keyCode==13){sy_contract_reg.search();}});//조회 조건 엔터키 입력 이벤트
	$('#contractStartTerm, #contractEndTerm').on('change', function(e){
		var startDt = $('#contractStartTerm').val();
		var endDt = $('#contractEndTerm').val();
		if(startDt > endDt){
			alert('계약기간을 올바르게 선택해주세요.');
			e.target.value = '';
			return;
		}
		
		if(startDt && endDt){
			sy_contract_reg.getSystemList();//시스템목록 조회
		}
	});
	/*
	 * 그리드
	 */
	sy_contract_reg.setGrid();
	sy_contract_reg.setSubGrid();

	/*
	 * 콤포넌트 초기화
	 */
	sy_contract_reg.clearEdits();//비활성화 처리
	sy_contract_reg.getSystemList();//시스템목록 조회
	
});