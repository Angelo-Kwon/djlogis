
var sy_user_reg = {
	
	grid : {},
	gRow  : null,
	isChecked : false,
	sys_use_list : [],
	sys_role_list : [],
	sys_type_list : [],
	sys_compkey_list : [],
	sys_ownrky_list : [],
	sys_ptnrkey_list : [],
	sys_rstype_list : [],
	
    // grid 기본 셋팅
    setGrid : function() {
		var columns = [
			{ title: "", align: "center", type: 'checkBoxSelection', dataType: 'bool', dataIndx: "CHK", 
			  cb: { all: false,  // checkbox selection in the header affect current page only.
		              header: true // show checkbox in header. 
		      }
			},
             { title: "아이디", dataType: "string", dataIndx: "LOGIN_ID", halign: "center", align: "left", editable: false},
	         /*{ title: "비밀번호", dataType: "pw", dataIndx: "LOGIN_PWD", align: "center", editable: false},*/
             { title: "사용자명", dataType: "string", dataIndx: "USER_NM", halign: "center", align: "left"},
             { title: "사용자유형", dataType: "string", dataIndx: "USER_TYPE", align: "center",
              editor: {
                		type: 'select',
                		options: sy_user_reg.sys_type_list
               },
	            //render required to display options text corresponding to value stored in the cell.
	            render: function (ui) {
	                var option = ui.column.editor.options.find(function (obj) {
	                    return (obj[ui.cellData] != null);
	                });
	                return option ? option[ui.cellData] : "";
	            }
            },
            { title: "권한그룹", dataType: "string", dataIndx: "RGROUP_ID", align: "center",
              editor: {
                		type: 'select',
                		options: sy_user_reg.sys_role_list
               },
	            //render required to display options text corresponding to value stored in the cell.
	            render: function (ui) {
	                var option = ui.column.editor.options.find(function (obj) {
	                    return (obj[ui.cellData] != null);
	                });
					
	                return option ? option[ui.cellData] : "";
	            }
            },
            { title: "공유유형", dataType: "string", dataIndx: "RS_TYPE", align: "center",
                editor: {
                  		type: 'select',
                  		options: sy_user_reg.sys_rstype_list
                 },
  	            //render required to display options text corresponding to value stored in the cell.
  	            render: function (ui) {
  	                var option = ui.column.editor.options.find(function (obj) {
  	                    return (obj[ui.cellData] != null);
  	                });
  	                return option ? option[ui.cellData] : "";
  	            }
            },
            { title: "연락처", dataType: "string", dataIndx: "USER_PHONE", align: "center"},
            { title: "이메일", dataType: "string", dataIndx: "USER_EMAIL", halign: "center", align: "left"},
            { title: "회사명", dataType: "string", dataIndx: "COMPANY", halign: "center", align: "left"},
      	    { title: "회사구분", dataType: "string", dataIndx: "COMPKEY", align: "center",
      	     editor: {
                		type: 'select',
                		options: sy_user_reg.sys_compkey_list
               },
             render: function (ui) {
                var option = ui.column.editor.options.find(function (obj) {
                    return (obj[ui.cellData] != null);
                });
                return option ? option[ui.cellData] : "";
            }},
            { title: "화주", dataType: "string", dataIndx: "OWNRKY", align: "center",
             editor: {
                		type: 'select',
                		options: sy_user_reg.sys_ownrky_list
               },
             render: function (ui) {
                var option = ui.column.editor.options.find(function (obj) {
                    return (obj[ui.cellData] != null);
                });
                return option ? option[ui.cellData] : "";
            }},
            { title: "협력업체", dataType: "string", dataIndx: "PTNRKEY", align: "center",
             editor: {
                		type: 'select',
                		options: sy_user_reg.sys_ptnrkey_list
               },
	         render: function (ui) {
                var option = ui.column.editor.options.find(function (obj) {
                    return (obj[ui.cellData] != null);
                });
                return option ? option[ui.cellData] : "";
            }},          	
          	{ title: "SMS",  type: "checkbox", dataIndx: "SMS_YN", align: "center",
          	  cb: { 
                    check: "Y",
                    uncheck: "N"
                  }
            },
          	{ title: "사용여부", align: "center", dataType: "string", dataIndx: "USE_YN", 
          	  editor: {
                		type: 'select',
                		options: sy_user_reg.sys_use_list
               },
	            //render required to display options text corresponding to value stored in the cell.
	            render: function (ui) {
	                var option = ui.column.editor.options.find(function (obj) {
	                    return (obj[ui.cellData] != null);
	                });
	                return option ? option[ui.cellData] : "";
	            }
            },
            { dataIndx: "action", hidden:true},
        ] ;
        
		var options = {
	        width: '100%',
            height: '99%',
            //important option 
            editable: true,          
            showTop: false,
            selectionModel: { type: 'row', mod:'single' },
            trackModel: {on:true},
            dataModel: { data: [], recIndx: "USER_ID" },              
            showHeader: true
        }
    
        var gridId = "sy_user_reg_pqgrid_div";//그리드 ID
		gridCmmn = new GridUtil(columns, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
		gridCmmn.open();//그리드 생성
		sy_user_reg.grid = gridCmmn.getGrid();//그리드 객체
	},
	
	
	// event 영역
	fnEvent : function() {
		// 조회 버튼
		$("#btnSearch").on("click", function() {
			sy_user_reg.fnSearch();			
		});
		
		// 비밀번호 초기화
		$("#btnReset").on("click", function() {
			let user_nm = sy_user_reg.fnUpdateChk();
			if(user_nm != "") {
				if(confirm(user_nm+"의 비밀번호를 초기화 하시겠습니까?")) {
					sy_user_reg.fnPassReset();	
				}	
			}
		});
		
		// 추가 버튼
		$("#btnAdd").on("click", function() {
			sy_user_reg.fn_inputReset();
			$("#modal-background").fadeIn(300);
			$(".popup-reg-user").css("display", "flex").hide().fadeIn();
		    $("body").css("overflow", "hidden");
		    
		    // 셀렉트 박스 첫 번째 값으로 세팅
		    $("#edit_user_type option:eq(0)").prop("selected", true);
		    $("#edit_role_grp option:eq(0)").prop("selected", true);
		    $("#edit_ownrky option:eq(0)").prop("selected", true);
		    $("#edit_compkey option:eq(0)").prop("selected", true);
		    $("#edit_ptnrkey option:eq(0)").prop("selected", true);
		    $("#edit_rs_type option:eq(0)").prop("selected", true);

			var loginId = localStorage.getItem('loginId');
			var company = localStorage.getItem("company") ? localStorage.getItem("company") : '';
		    if(loginId != 'admin'){
			    $("#edit_cp_nm").val(company);
			} else {
				$("#edit_cp_nm").attr('disabled', false);
			}
		});
		
		// 저장 버튼
		$("#btnSave").on("click", function() {
			if(confirm("저장 하시겠습니까?")) {
				sy_user_reg.fnModify();	
			}
		});
		
		// 삭제 버튼
		$("#btnDel").on("click", function() {
			let user_nm = sy_user_reg.fnUpdateChk();
			if(user_nm != "") {
				if(confirm(user_nm+"의 사용자 정보를 삭제 하시겠습니까?")) {
					sy_user_reg.fnDelInfo();	
				}
			}
		});
		
		// 팝업 닫기 버튼
		$("[id^='btnPopClose']").on("click", function() {
			sy_user_reg.fn_popClose();
		});
		
		// 팝업 저장 버튼(신규 사용자 저장)
		$("#btnPopSave").on("click", function() {
			let val_check = false;
			val_check = sy_user_reg.fnNewUserValueCheck();
			if(sy_user_reg.isChecked) {
				if(val_check) {
					if(confirm("신규 사용자의 정보를 저장 하시겠습니까?")) {
						sy_user_reg.fnSave();
					}
				}	
			} else {
				alert("중복된 아이디가 있습니다.");
				return;
			}	
		});

		
		//신규추가 시 중복확인 버튼 클릭
		$("#checkId").on("click", function() {
			if($("#edit_user_id").val() == "") {
				alert("아이디는 영문자+숫자 아니면 영문자만 6~15자리 이내로 입력해주세요.");
				return false;
			} else {
				sy_user_reg.fn_duplicationIdCheck($("#edit_user_id").val());
			}
		
		});
		
	},
	
	// 조회조건 조회(grid)
	fnSearch : function() {
		var loginId = localStorage.getItem('loginId');
		var company = localStorage.getItem("company") ? localStorage.getItem("company") : "";
		var param = new URLSearchParams(common.makeConditionsParam());//조회조건 파라미터
		
		if(loginId != 'admin'){
			param.set("schCompanyNm", company);
		} 
		
		$.ajax({
			type:"POST",
			dataType:"json",
			url:"/sy/user/selectUserInfoList",
			data:param.toString(),
			//로딩바 SHOW
			beforeSend: function() {
				sy_user_reg.grid.option("strLoading", "Loding...")
		        sy_user_reg.grid.showLoading();
		    },
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert(data.error);
					return;
				}
				//데이터 초기화
				sy_user_reg.gridInit();
				
				//데이터 ADD
				let gridDataList = data.dataList;
				
				sy_user_reg.grid.option("dataModel.data", gridDataList);
				sy_user_reg.grid.refreshDataAndView();
			},
			complete:function(){
				//로딩바 HIDE
				sy_user_reg.grid.hideLoading();
			},
			error:function(e){
				alert(e);
			}   
		});
	},
	
	// 사용자 정보 신규 저장.
	fnSave : function() {
		var param = common.makeEditsParam();//수정항목 파라미터
		
		$("input[type=checkbox][id^='edit']").each(function() {
			let chk_id = $(this).attr("id");
			if($(this).is(":checked")) {
				param[chk_id] = "Y";
								
			} else {
				param[chk_id] = "N";				
			}
		});
		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/sy/user/insertUserInfo",
			data:param,
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert("저장 중 오류가 발생했습니다. \n관리자에게 문의해 주세요");
					return;
				}
				alert("신규 사용자를 등록 하였습니다.");
				sy_user_reg.fn_popClose();
				sy_user_reg.fnSearch();
				
			},
			error:function(e){
				alert("저장 중 오류가 발생했습니다. \n관리자에게 문의해 주세요");
			}   
		});
	},
	
	// 사용자 변경 정보 저장.
	fnModify : function() {
		//검증
		var gridChanges = sy_user_reg.grid.getChanges({ format: 'byVal' });
		var allList = gridChanges.addList.concat(gridChanges.updateList).concat(gridChanges.deleteList);
		if(allList.length == 0){
			alert("수정된 내용이 없습니다.");
			return;
		}
		//필수체크
		var mustChkColList = [
								 {column:"USER_NM", title:"유저명"}
								,{column:"USER_TYPE", title:"사용자유형"}
								,{column:"RGROUP_ID", title:"권한그룹"}
								,{column:"USER_PHONE",title:"연락처"}
								,{column:"USER_EMAIL",title:"이메일"}
								,{column:"COMPANY",title:"회사명"}
								,{column:"COMPKEY",title:"회사구분"}
								,{column:"USE_YN",title:"사용여부"}
								];
		var msg = "";
		var valMsg = "";
		var updateList = Object.assign(gridChanges.updateList);
		updateList.forEach(function(dataObj, index) {
			if(dataObj["CHK"] == true) {
				mustChkColList.forEach(function(chkColObj) {
					var tmpCol = dataObj[chkColObj.column];
					if(!tmpCol || tmpCol == "") {
						msg += chkColObj.title + "\r\n";
						return;
					}
					
					if(chkColObj.column == "USER_PHONE" || chkColObj.column == "USER_EMAIL") {
						let column = chkColObj.column;
						let chkCol = "";
						let chkVal = "";
						if(column == "USER_PHONE") {
							chkCol = "phone";
							chkVal = "연락처가";
							tmpCol = tmpCol.replace(/[^0-9]/g, "").replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3").replace("--", "-");
							dataObj[chkColObj.column] = tmpCol;
						} else if(column == "edit_mail_addr") {
							chkCol = "email";
							chkVal = "이메일이";
						}
						if(!sy_user_reg.fnValueChk(chkCol, tmpCol)) {
							valMsg = chkVal+" 잘못 입력 되었습니다.";
							$("#"+column).focus();
							return;
						}
					}
				});
			} else {
				valMsg = "선택된 사용자 정보가 없습니다.";
				return;
			}
			
		});
		if(msg){
			alert(msg + "은(는) 필수 입력값입니다.");
			return;
		} else if(valMsg) {
			alert(valMsg);
			return;
		}
		//파라미터
		var param = {
			dataList : JSON.stringify(allList)
		}
		//호출
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/sy/user/saveUserInfo",
			data:param,
			//로딩바 SHOW
			beforeSend: function() {
				sy_user_reg.grid.option("strLoading", "Loding...")
		        sy_user_reg.grid.showLoading();
		    },
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert("저장 중 오류가 발생했습니다. \n관리자에게 문의 하여 주세요");
					return;
				}
				alert("저장 되었습니다.");
				sy_user_reg.fnSearch();
			},
			complete:function(){
				//로딩바 HIDE
				sy_user_reg.grid.hideLoading();
			},
			error:function(e){
				alert(e);
			}
		});
	},
	
	// 사용자 비밀번호 초기화.
	fnPassReset : function() {
		var dataList = [];
		var user_nm = "";
		var cnt = 0;
		for(var idx=0 ; idx < sy_user_reg.grid.getTotalRows() ; idx++){
			var item = sy_user_reg.grid.getData()[idx];
			if(item["CHK"]){
				cnt++;
				dataList.push(item);
				user_nm = item["USER_NM"];
			}
		}
		
		if(cnt > 1) {
			user_nm = user_nm+"님 외 "+(cnt-1)+"명";
		} else {
			user_nm = user_nm+"님";
		}
		
		var param = {
			dataList:JSON.stringify(dataList)
		}
		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/sy/user/updateUserPassReset",
			data:param,
			//로딩바 SHOW
			beforeSend: function() {
				sy_user_reg.grid.option("strLoading", "Loding...")
		        sy_user_reg.grid.showLoading();
		    },
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert("저장 중 오류가 발생했습니다. \n관리자에게 문의 하여 주세요");
					return;
				}
				alert(user_nm+"의 비밀번호가 초기화 되었습니다.");
				sy_user_reg.fnSearch();
				
			},
			complete:function(){
				//로딩바 HIDE
				sy_user_reg.grid.hideLoading();
			},
			error:function(e){
				alert(e);
			}   
		});
	},
	
	// grid 초기화
	gridInit : function() {
		sy_user_reg.grid.option("dataModel.data", []);
		sy_user_reg.grid.refreshDataAndView();
	},
	
	// 조회 조건 및 grid 의 사용자 권한 list data 조회
	fnGetRoleList : function(){
		$.ajax({
			type:"POST",
			dataType:"json",
			url:"/sy/user/selectRoleList",
			data:{},
			success:function(data, status, res){
				// 초기화
				$("#schRoleGrp").html("");
				$("#schRoleGrp").html("<option value=''>전체</option>");
				
				var dataList = data.dataList;
				for(var i=0;i<dataList.length;i++){
					var data = dataList[i];
					var rgroupKey = data.RGROUP_KEY;

					if(rgroupKey != 'ADMIN' && rgroupKey != '3PL'){
						$("#schRoleGrp").append($("<option value='"+data.RGROUP_ID+"'>"+data.RGROUP_NM+"</option>"));
						$("#edit_role_grp").append($("<option value='"+data.RGROUP_ID+"'>"+data.RGROUP_NM+"</option>"));
						sy_user_reg.sys_role_list.push({[data.RGROUP_ID] : data.RGROUP_NM});
					}
				}
				
				//콤보박스 초기값
				$("#ACTCD option:eq(0)").prop("selected", true);	
			},
			error:function(e){
				alert(e);
			}   
		});		
	},
	
	// grid 의 사용자 유형 및 사용여부 list data 조회
	fnGetGridInfoList : function() {
		$.ajax({
			type:"POST",
			dataType:"json",
			url:"/sy/user/selectGridInfoList",
			data:{},
			success:function(data, status, res){
				
				var useYnList = data.useYnList;
				for(var i=0;i<useYnList.length;i++){
					let ynData = useYnList[i];
					sy_user_reg.sys_use_list.push({[ynData.CMCD] : ynData.CMNM});
				}
				
				var useTypeList = data.useTypeList;
				for(var i=0;i<useTypeList.length;i++){
					let typeData = useTypeList[i];
					sy_user_reg.sys_type_list.push({[typeData.CMCD] : typeData.CMNM});
				}
				
				var rsTypeList = data.rsTypeList;
				for(var i=0;i<rsTypeList.length;i++){
					let rsTypeData = rsTypeList[i];
					sy_user_reg.sys_rstype_list.push({[rsTypeData.CMCD] : rsTypeData.CMNM});
				}
				
				var compkeyList = data.compkeyList;
				for(var i=0;i<compkeyList.length;i++){
					let compkeyData = compkeyList[i];
					sy_user_reg.sys_compkey_list.push({[compkeyData.COMPKEY] : compkeyData.CONAMLC});
					
					$("#edit_compkey").append($("<option value='"+compkeyData.COMPKEY+"' selected>"+compkeyData.CONAMLC+"</option>"));
				}
				
				var ownerkyList = data.ownerkyList;
				for(var i=0;i<ownerkyList.length;i++){
					let ownerData = ownerkyList[i];
					sy_user_reg.sys_ownrky_list.push({[ownerData.OWNERKY] : ownerData.OWNAMLC});
				
					$("#edit_ownrky").append($("<option value='"+ownerData.OWNERKY+"'>"+ownerData.OWNAMLC+"</option>"));
				}
				
				var ptnrkeyList = data.ptnrkeyList;
				for(var i=0;i<ptnrkeyList.length;i++){
					let ptnrData = ptnrkeyList[i];
					sy_user_reg.sys_ptnrkey_list.push({[ptnrData.PTNRKEY] : ptnrData.PTNAMLC});
				
					$("#edit_ptnrkey").append($("<option value='"+ptnrData.PTNRKEY+"'>"+ptnrData.PTNAMLC+"</option>"));
				}
			},
			error:function(e){
				alert(e);
			}   
		});
	},
	
	// 수정(비밀번호 초기화 포함) 시 선택한 user 확인
	fnUpdateChk : function() {
		var user_nm = "";
			var chkCnt=  0;
			for(var idx=0 ; idx < sy_user_reg.grid.getTotalRows() ; idx++){
			let item = sy_user_reg.grid.getData()[idx];
				if(item["CHK"]){
					user_nm = item["USER_NM"];
					chkCnt++;
				}
			}
			
			if( chkCnt == 0) {
				alert("선택한 사용자 정보가 없습니다.");
				user_nm = ""
			} else if(chkCnt > 1) {
				user_nm = user_nm+"님 외 "+(cnt-1)+"명";
			} else {
				user_nm = user_nm+"님";
			}
			
			return user_nm;
	},
	
	// 사용자 정보 삭제(상태값을 update)
	fnDelInfo : function() {
		for(var idx = sy_user_reg.grid.getTotalRows()-1 ; idx > -1  ; idx--){
			var item = sy_user_reg.grid.getData()[idx];
			if(item["CHK"]){	
				if(item["POL_TERMS_YN"] == "Y" && item["POL_PSN_YN"] == "Y") {
					alert("개인정보 이용 및 이용약관 모두 동의한 사용자는 \n 삭제 대상이 아닙니다.");
					break;
				}			
				
				item["action"] = "DELETE";
				item["USE_YN"] = "S";
				sy_user_reg.grid.deleteRow({rowIndx: idx});
				
				alert("삭제 후 저장 버튼을 클릭하세요");
				//EDTIS 초기화
			}
		}
	},
	
	// 전화번호 / 이메일 / 사업자등록번호 유효성 체크
	fnValueChk : function(val_type, value) {
		var chk_result = true;
		if(val_type == "phone") {
			let regExp = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/
		    chk_result = regExp.test(value);
		} else if(val_type == "email") {
			let regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
		    chk_result = regExp.test(value);
		} else if(val_type == "br_no") {
			let regExp = /^[0-9]{3}-[0-9]{2}-[0-9]{5}/  
		    chk_result = regExp.test(value);
		}
		
		return chk_result;
	},

	// 신규 사용자 벨리데이션 체크
	fnNewUserValueCheck : function() {
		let result = true;
		
		// 필수 입력값 체크
		if($("#edit_user_id").val() == "") {
			alert("아이디은(는) 필수 입력값입니다.");
			$("#edit_user_id").focus();
			result = false;
			return false;
		} else if($("#edit_user_nm").val() == "") {
			alert("사용자명은(는) 필수 입력값입니다.");
			$("#edit_user_nm").focus();
			result = false;
			return false;
		} else if($("#edit_user_type").val() == "") {
			alert("사용자 유형은(는) 필수 입력값입니다.");
			$("#edit_user_type").focus();
			result = false;
			return false;
		} else if($("#edit_role_grp").val() == "") {
			alert("권한그룹은(는) 필수 입력값입니다.");
			$("#edit_role_grp").focus();
			result = false;
			return false;
		} else if($("#edit_user_phone").val() == "") {
			alert("연락처은(는) 필수 입력값입니다.");
			$("#edit_user_phone").focus();
			result = false;
			return false;
		} else if($("#edit_user_email").val() == "") {
			alert("이메일은(는) 필수 입력값입니다.");
			$("#edit_user_email").focus();
			result = false;
			return false;
		} else if($("#edit_user_pw").val() != $("#edit_user_pw_confirm").val()){
			alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
			$("#edit_user_pw").focus();
			return false;
		} else if($("#edit_cp_nm").val() == "") {
			alert("회사명은(는) 필수 입력값입니다.");
			$("#edit_cp_nm").focus();
			result = false;
			return false;
		} else if(!$("#edit_compkey").val()) {
			alert("회사구분은(는) 필수 입력값입니다.");
			$("#edit_compkey").focus();
			result = false;
			return false;
		} else if($("#edit_biz_no").val() == "") {
			alert("사업자등록번호은(는) 필수 입력값입니다.");
			$("#edit_biz_no").focus();
			result = false;
			return false;
		/*} else if(!$("#edit_terms_yn").is(":checked")) {
			alert("이용약관은(는) 필수 입력값입니다.");
			$("#edit_terms_yn").focus();
			result = false;
			return false;*/
		/*} else if(!$("#edit_psn_yn").is(":checked")) {
			alert("개인정보 동의은(는) 필수 입력값입니다.");
			$("#edit_psn_yn").focus();
			result = false;
			return false;*/
		} else if(!$("#edit_use_yn").is(":checked")) {
			alert("사용여부은(는) 필수 입력값입니다.");
			$("#edit_use_yn").focus();
			result = false;
			return false;
		}
		
		if(result == true) {
			// 특정값에 대한 유효성 검사
			if(!sy_user_reg.fnValueChk("phone", $("#edit_user_phone").val())) {
				alert("전화번호가 잘못 입력 되었습니다.");
				$("#edit_user_phone").focus();
				result = false;
				return false;
			} else if(!sy_user_reg.fnValueChk("email", $("#edit_user_email").val())) {
				alert("이메일이 잘못 입력 되었습니다.");
				$("#edit_user_email").focus();
				result = false;
				return false;
			} else if(!sy_user_reg.fnValueChk("br_no", $("#edit_biz_no").val())) {
				alert("사업자등록 번호가 잘못 입력 되었습니다.");
				$("#edit_biz_no").focus();
				result = false;
				return false;
			}
		}
		
		return result;
	},
	
	fn_popClose : function() {
		$("#modal-background").fadeOut();
		$(".popup-reg-user").css("display", "flex").show().fadeOut();	
	},
	
	fn_inputReset : function() {
		$("[id^='edit']").val("");
		$(":checkbox:checked").prop("checked",false);
	},
	
	fn_duplicationIdCheck : function(loginId) {
		var param = {
			"loginId" : loginId	
		}

		$.ajax({
			type:"POST",
			url:"/sy/join/checkId",
			data: JSON.stringify(param),
			contentType: "application/json",
			success: function(response) {
				if (response.code == 'S') {
					alert("사용가능한 아이디 입니다.");
					sy_user_reg.isChecked = true;
				} else {
					alert("중복된 아이디가 존재합니다.");
				}
			},
			error:function(e){
				alert(e);
			}  
		});
	}
}

$(function () {
        
    common.setCommCode($("#schUserType"), "USERTYP", null, 2);
    common.setCommCode($("#edit_user_type"), "USERTYP", null, 3);
    common.setCommCode($("#edit_rs_type"), "RSTYPE", null, 1);
    common.setCommCode($("#schRsType"), "RSTYPE", null, 2);
	
    sy_user_reg.fnGetRoleList();        
    sy_user_reg.fnGetGridInfoList();
    
    common.setBrnoForObj($("#edit_biz_no")); // 사업자등록번호
	common.setTelNoForObj($("#edit_user_phone")); // 전화번호
    
	sy_user_reg.fnEvent();
	sy_user_reg.setGrid();

});