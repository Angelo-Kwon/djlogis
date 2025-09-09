let sy_noticeBoard = {

	grid: null,
	gridDataList: null,
	changes: null,
	useYnList: [{'Y': '사용'}, {'N': '미사용'}],
	info: [],
	editor : null,
	viewer : null,
	info : {},
	boardSeq : '',
	
	/*
	 * 콤포넌트 이벤트 처리
	 */
	fnEvent: function() {
		
		// 조회 버튼
		$("#btnSearch").on("click", function() {
			sy_noticeBoard.fnSearch();
		});
		
		// 초기화 버튼
		$("#btnReset").on("click", function() {
			$("#schTitle").val("");
			$('select').find('option:first').prop('selected', true);
		});
		
		// 추가 버튼
		$("#btnAdd").on("click", function() {
			sy_noticeBoard.boardSeq = '';
			
			$('.notice-list').hide();
			$('.notice-edit').show();
			
			sy_noticeBoard.fnEditInit();
			common.setCommCode($("#schNoticsYn_e"),"NOTICS_YN", "Y", 3); // 공지여부

			$('#schUserNm_e').val(localStorage.getItem('userNm'));
			$('#schCreDt_e').val(common.getToday(5));
		});
		
		// 삭제 버튼
		$("#btnDel").on("click", function() {
			const checkList = sy_noticeBoard.grid.Checkbox('CHK').getCheckedNodes();
	       	if(!checkList.length) {
	       		alert('선택된 ROW가 없습니다.');
	       		return;
	       	}
	       	
	   		if(confirm(checkList.length + '행을 삭제하시겠습니까?')) {
	  			for(const checkData of checkList) {
	  				sy_noticeBoard.grid.deleteRow({ rowIndx: checkData.pq_ri });
	  	   		}
	  	   		alert("삭제 후 저장 버튼을 클릭하세요.");
	   		}
		});
	
		// 저장 버튼
		$("#btnSave").on("click", function() {
			sy_noticeBoard.fnSave();
		});
		
		//  작성 버튼
		$("#btnSave_e").on("click", function() {
			let val_check = false;
			val_check = sy_noticeBoard.fnNewNoticeValueCheck();
			if(val_check) {
				sy_noticeBoard.fnSaveBoard();
			}
		});
		
		//  첨부파일 추가 버튼
		$(".add-file").on("click", function() {
			sy_noticeBoard.addFile();
		});
		
		//  첨부파일 파일 열기 버튼
		$(document).on('change', '.open-file', function(event) {
		    sy_noticeBoard.selectFile(event.currentTarget);
		});
		
		//  첨부파일 삭제 버튼
		$(document).on('click', '[id^=removeBtn]', function(event) {
		    sy_noticeBoard.removeFile(event.currentTarget);
		});
		
		// TOAST UI EDITOR 세팅
	    sy_noticeBoard.editor = new toastui.Editor({
	        el: document.querySelector('#editor'), // 에디터를 적용할 요소 (컨테이너)
	        height: '533px',                       // 에디터 영역의 높이 값 (OOOpx || auto)
	        initialEditType: 'wysiwyg',            // 최초로 보여줄 에디터 타입 (markdown || wysiwyg)
	    });
	    
	    sy_noticeBoard.setLabelCss();
	    
	    // 수정 버튼
		$("#btnEdit").on("click", function() {
			$('.notice-list').hide();
			$('.notice-detail').hide();
			$('.notice-edit').show();
			
			$('#file1_input').val('');
			sy_noticeBoard.fnDetail(sy_noticeBoard.boardSeq);
		});
		
		// 취소 버튼
		$("[id^='btnGoToList']").on("click", function() {
			sy_noticeBoard.fnEditInit();
			
			$('.notice-edit').hide();
			$('.notice-detail').hide();
			$('.notice-list').show();
			
			sy_noticeBoard.fnSearch();
		});
	},
	
	/*
	 * 그리드
	 */
	setGrid: function() {
		//Grid
		let columns = [
			{ 
				title: "",
				halign: "center",//헤더ALIGN
				align: "center",
				type: 'checkbox',
				dataType: 'bool',
				dataIndx: "CHK",
				editable: true,
				cb: {
					all: false,  // checkbox selection in the header affect current page only.
					header: true // show checkbox in header. 
					, check: true, uncheck: false
				},
			},
			{
				title: "번호",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "BOARD_ID",
				hidden: true
			},
			{
				title: "공지여부",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "NOTICS_YN"
			},
			{
				title: "제목",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "TITLE",
			    render: function (ui) {
					let title = ui.cellData;
				
					if(title.length > 15){
						title = title.substr(0, 15) + "..."	
					}
					
					if(ui.rowData.PAR_BOARD_ID != '0'){
						title = 'ㄴ' + title;
					}
					
	                return title;
	            }
			},
			{
				title: "작성자",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "USER_NM"
			},
			{
				title: "작성일시",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "CRE_DT"
			},
			{
				title: "수정일시",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "MOD_DT"
			},
			{ 
				title: "사용여부",  
				align: "center", 
				dataType: "string", 
				dataIndx: "USE_YN", 
				editable: true,
	      	    editor: {
	            		type: 'select',
	            		options: sy_noticeBoard.useYnList
	             },
	            render: function (ui) {
	                let option = ui.column.editor.options.find(function (obj) {
	                    return (obj[ui.cellData] != null);
	                });
	                return option ? option[ui.cellData] : "";
	            }, styleHead: {'background-color': '#FAF4C0'},
	        },
			{
				title: "조회수",
				halign: "center",
				align: "center",
				dataType: "string",
				dataIndx: "HIT_CNT",
			}
		];
	
		let options = { 
			width: '100%',
			height: '99%',
			showTop: false,
			editable: false,
			selectionModel: { type: 'row', mode: 'single' },
			trackModel: { on: true },
			dataModel: { data: [], recIndx: "BOARD_SEQ" },
			cellClick: function(e, ui) {
				if(ui.dataIndx != 'USE_YN' && ui.dataIndx != 'CHK'){
					sy_noticeBoard.fnMoveNoticeReg(ui.rowData.BOARD_SEQ);						
				} 
			}
		};
	
		let gridCmmn = new GridUtil(columns, location.pathname, "sy_notice_pqgrid_div", options);
		
		gridCmmn.setBeforeValidate(function(event, ui) {
			if(ui.source !== 'undo' && (ui.source === 'edit' || ui.source === 'paste' || ui.source === 'checkbox')){
				for(const updateData of ui.updateList){
					if(JSON.stringify(updateData.newRow) !== JSON.stringify(updateData.oldRow)){
						this.updateRow( {rowIndx : updateData.rowIndx, newRow : {'CHK':true}, checkEditable: false});
		       		}
				}
			}
		});
		
		gridCmmn.open();
		sy_noticeBoard.grid = gridCmmn.getGrid();
	},
	
	/*
	 * 상세 화면
	 */
	 fnMoveNoticeReg: function(boardSeq) {
		$('.notice-edit').hide();
		$('.notice-list').hide();
		$('.notice-detail').show();
		 
		$.ajax({
			type: "PUT",
			dataType: "json",
			url: "/sy/board/updateNoticeHitCnt",
			data: { BOARD_SEQ: boardSeq},
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert("저장 중 오류가 발생했습니다. \n관리자에게 문의 하여 주세요");
					return;
				}
				
				$("#fileInfo").empty();
				$("#viewer").html("");
				
				sy_noticeBoard.fnDetail(boardSeq);
			},
			error:function(e){
				alert(e);
			}
		});
	},
	
	/*
	 * 조회 : 공지사항 기본정보 조회
	 */
	fnSearch: function() {
		let param = new URLSearchParams(common.makeConditionsParam()); // 파라미터 
		param.set("boardId", 1);
		
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "/sy/board/selectNoticeList",
			data: param.toString(),
			beforeSend: function() {
				sy_noticeBoard.grid.showLoading();			
			},
			success: function(data, status, res) {
				//오류확인
				if (data.error) {
					alert(data.error);
					return;
				}
				
				//데이터 초기화
				sy_noticeBoard.fnGridInit();
				
				//데이터 ADD
				sy_noticeBoard.gridDataList = data.dataList;
				sy_noticeBoard.grid.option("dataModel.data", data.dataList);
				sy_noticeBoard.grid.refreshDataAndView();
				
				// 사용여부 수정 가능
				sy_noticeBoard.grid.colModel[4].editable = true;
	
				sy_noticeBoard.changes = sy_noticeBoard.grid.getChanges();
			},
			complete: function(e) {
				sy_noticeBoard.grid.hideLoading();
			},
			error: function(e) {
				alert(e);
			}
		});
	},
	
	/*
	 * 저장
	 */
	 fnSave: function() {
		//검증
		const grid = sy_noticeBoard.grid;
		const gridDataList = grid.getData(); 
		const gridChange = grid.getChanges({ all : true }); 
		const checkList = gridDataList.filter(function(e) {		 
			return e.CHK === true;
		});
		
		if(!checkList.length && !gridChange.deleteList.length) {
			alert('수정된 내용이 없습니다.');
			return false;
		}
		
		var deleteNoList = gridChange.deleteList.map(x => {return x.BOARD_SEQ});
		
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/board/updateNoticeUseYn",
			data: { 
					updateList: JSON.stringify(gridChange.updateList),
					deleteNoList: JSON.stringify(deleteNoList)
				  },
			//로딩바 SHOW
			beforeSend: function() {
				sy_noticeBoard.grid.option("strLoading", "Loding...")
		        sy_noticeBoard.grid.showLoading();
		    },
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert("저장 중 오류가 발생했습니다. \n관리자에게 문의 하여 주세요");
					return;
				}
				alert("저장 되었습니다.");
				sy_noticeBoard.fnSearch();
			},
			complete:function(){
				//로딩바 HIDE
				sy_noticeBoard.grid.hideLoading();
			},
			error:function(e){
				alert(e);
			}
		});
	},
	
	/*
	 * 상세 조회
	 */
	fnDetail: function(seq) {
		sy_noticeBoard.boardSeq = seq;
		
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/board/selectNoticeDetailInfo",
			data: { BOARD_SEQ: seq },
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert(data.error);
					return;
				}
				
				sy_noticeBoard.info = data.dataInfo;
				
				// TOAST UI EDITOR에 세팅
				sy_noticeBoard.editor.setHTML(data.dataInfo?.CONTENTS);
				$("#viewer").html(data.dataInfo?.CONTENTS);

				if($('.notice-edit').is(':visible')){

					// 제목, 작성자명, 작성일시, 공지여부, 사용여부 세팅
					$("#schUserNm_e").val(data.dataInfo?.USER_NM);
					$("#schTitle_e").val(data.dataInfo?.TITLE);
					$("#schUseYn_e").val(data.dataInfo?.USE_YN);
					$("#schHitCnt_e").val(data.dataInfo?.HIT_CNT);
					$("#schCreDt_e").val(common.getToday(5));

					common.setCommCode($("#schNoticsYn_e"),"NOTICS_YN", data.dataInfo?.NOTICS_YN, 3); // 공지여부
					$('.notice-edit').find('input, select').css({'font-size': '12px', 'font-weight': 'bold'});					
					$('#schUserNm_e', '#schCreDt_e').css('border', 'none');					
				
					let idx = 0;
					
					//파일 세팅
					for(let i=0; i<3; i++){
					    let fileKey = 'ATTACH_FILE' + (idx + 1);
					    let fileNmKey = 'ATTACH_FILE' + (idx + 1) + '_NM';
					    let fileNm = data.dataInfo[fileNmKey];

					    if(fileNm){
						    if(idx == 0){
								let fileNmInput = document.getElementById("file"+ (idx + 1) +"_input");
								fileNmInput.value = fileNm;
							} else {
							    const fileDiv = document.createElement('div');
							    fileDiv.id = "file_upload"+ (idx + 1);
							    fileDiv.innerHTML =`
							    	<div style="display:block;" hidden>
										<a href="" id="file_url`+ (idx + 1) +`" class="file-info"></a>
					                </div>
							    	<div style="display:flex; margin-top: 10px;">
								        <div class="file_input">
								            <input type="text" id="file`+ (idx + 1) +`_input" style="border: solid 1px #c2c5c8; width: 180px; font-weight:bold;" value="`+ fileNm +`" readonly />
								            <input id="file`+ (idx + 1) +`"type="file"  name="files" data-idx=`+ (idx + 1) +` class="open-file" style="display: none;"/>
								            <label for="file`+ (idx + 1) +`">찾아보기</label>
								        </div>
								        <button type="button" data-idx="`+ (idx + 1) +`" class="btn-white delete-file" style="padding: 5px;"><img class="ic-line-minus"></button>
							    	</div>   
							    `;
							    document.querySelector('.file_list').appendChild(fileDiv);		
							    sy_noticeBoard.setLabelCss();
							}
							
							$('#file_url' + (idx + 1)).attr('href', data.dataInfo[fileKey]);
							$('#file_url' + (idx + 1)).attr('download', fileNm);
							
							idx++;
						} 
					}
				} else {
					$("#schUserNm_d").text(data.dataInfo?.USER_NM);
					$("#schTitle_d").text(data.dataInfo?.TITLE);
					$("#schNoticsYn_d").text(data.dataInfo?.NOTICS_YN == 'Y'? '공지' : '미공지');
					$("#schUseYn_d").text(data.dataInfo?.USE_YN == 'Y'? '사용' : '미사용');
					$("#schHitCnt_d").text(data.dataInfo?.HIT_CNT);
					$("#schCreDt_d").text(data.dataInfo?.CRE_DT);

					//파일 세팅
					for(let i=0; i<3; i++){
					    const fileDiv = document.createElement('div');
					    let fileKey = 'ATTACH_FILE' + (i+1);
					    let file = data.dataInfo[fileKey];
		
					    let fileNmKey = fileKey + '_NM';
					    let fileNm = data.dataInfo[fileNmKey];
	
						if(data.dataInfo.hasOwnProperty(fileNmKey)){
					    	fileDiv.innerHTML =`<a href="`+ "data:image;base64," + file +`" download="`+ fileNm +`">`+ fileNm+`</a>`;
						}				
						document.querySelector('#fileInfo').appendChild(fileDiv);	
					}
				}
			},
			error:function(e){
				alert(e);
			}
		});
	},
	
	/*
	 * 작성
	 */
	fnSaveBoard() {
		let param = new URLSearchParams($(".notice-edit").serialize()); // 파라미터
		param.set("boardId", 1);
		param.set("schContent", sy_noticeBoard.editor.getHTML());
		param.set("schUseYn", sy_noticeBoard.info.USE_YN ? sy_noticeBoard.info.USE_YN : 'Y');
		
		if(sy_noticeBoard.boardSeq != ''){
			param.set("schBoardSeq", sy_noticeBoard.info.BOARD_SEQ);
			param.set("schBoardId", sy_noticeBoard.boardSeq);		
		}
		$(".file-info").each(function(index,item){
			param.set("schAttachFile" + (index + 1) + "Nm", $(item).attr('download'));
			param.set("schAttachFile" + (index + 1), $(item).attr('href'));
	    });

		param = param.toString().replaceAll('_e=', '=');
		
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/sy/board/insertNoticeInfo",
			data: param,
			success:function(data, status, res){
				//오류확인
				if(data.error){
					alert("저장 중 오류가 발생했습니다. \n관리자에게 문의 하여 주세요");
					return;
				}
				alert("해당 게시물이 저장되었습니다");
				
				sy_noticeBoard.fnEditInit();
				$('.notice-edit').hide();				
				$('.notice-list').show();				
				sy_noticeBoard.fnSearch();				
			},
			error:function(e){
				alert(e);
			}
		});
	},
	
	// 파일 선택
	selectFile: function(element) {
	    file = element.files[0];
	    const filename = element.closest('.file_input').firstElementChild;
	
	    // 파일 선택 창에서 취소 버튼이 클릭된 경우
	    if ( !file ) {
	        filename.value = '';
	        return false;
	    }
	
	    // 파일 크기가 10MB를 초과하는 경우
	    const fileSize = Math.floor(file.size / 1024 / 1024);
	    if (fileSize > 10) {
	        alert('10MB 이하의 파일로 업로드해 주세요.');
	        filename.value = '';
	        element.value = '';
	        return false;
	    }
	
	    // 파일명 지정
	    filename.value = file.name;
	    
	    // 파일을 base64로 변환하여 배열에 저장 
	    const reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = function(e){
			let src = e.target.result;
			let base64 = src.substring(src.indexOf(',') + 1, src.length);
			
			let idx = Number(element.dataset['idx']);
			$('#file_url' + idx).attr('download', file.name);
			$('#file_url' + idx).attr('href', base64);
	    };
	    
	},
	
	// 파일 추가
	addFile: function() {
		let fileCnt = document.getElementsByName('files').length;
		let fileIdx = Number(document.getElementsByName('files')[fileCnt-1].dataset['idx']) + 1;
		
		if(fileCnt < 3){
		    const fileDiv = document.createElement('div');
		    fileDiv.id = "file_upload"+ fileIdx;
		    fileDiv.innerHTML =`
		    	<div style="display:block;" hidden>
					<a href="" id="file_url`+ fileIdx +`" class="file-info"></a>
                </div>
		    	<div style="display:flex; margin-top: 10px;">
			        <div class="file_input">
			            <input type="text" id="file`+ fileIdx +`_input" style="border: solid 1px #c2c5c8; width: 180px; font-weight: bold;" readonly />
			            <input id="file`+ fileIdx +`"type="file"  name="files" data-idx=`+ fileIdx +` class="open-file" style="display: none;"/>
			            <label for="file`+ fileIdx +`">찾아보기</label>
			        </div>
			        <button type="button" data-idx="`+ fileIdx +`" id="removeBtn`+ fileIdx +`" class="btn-white delete-file" style="padding: 5px;"><img class="ic-line-minus"></button>
		    	</div>
		    `;
		    document.querySelector('#fileList').appendChild(fileDiv);		
		    sy_noticeBoard.setLabelCss();
		} else {
			alert("첨부파일은 최대 3개까지 등록할 수 있습니다.");
		}
	},
	
	// 파일 삭제
	removeFile: function(element) {
	    let idx = Number(element.dataset['idx']);
	    $('#file_upload' + idx).remove();
	},
	
	// 공지사항 필수값 체크
	fnNewNoticeValueCheck: function() {
		let result = true;
		// 필수 입력값 체크
		if($("#schNoticsYn_e").val() == "") {
			alert("공지여부가 입력되지 않았습니다.");
			$("#schNoticsYn").focus();
			result = false;
			return false;
		} else if($("#schUseYn_e").val() == "") {
			alert("사용여부가 입력되지 않았습니다.");
			$("#schUseYn").focus();
			result = false;
			return false;
		} else if($("#schTitle_e").val() == "") {
			alert("제목이 입력되지 않았습니다.");
			$("#schTitle").focus();
			result = false;
			return false;
		} else if(sy_noticeBoard.editor.getHTML() == "<p><br></p>") {
			alert("내용이 입력되지 않았습니다.");
			$("#editor").focus();
			result = false;
			return false;
		}
		
		return result;
	},
	
	setLabelCss: function() {
		$("label").css({
			'background-color': '#326ca8',
		    'color': '#fff',
		    'font-weight': '400',
		    'font-size': '13px',
		    'padding-left': '10px',
		    'padding-right': '10px',
		    'margin-left': '1px',
		    'margin-right': '10px'
		});
	},
	
	// notice-detail, notice-edit 초기화
	fnEditInit: function(){
		$('.notice-edit').find('select, input').val('');
		sy_noticeBoard.editor.setHTML("");
		$("#detailNotice").find("span").val("");
		$('#file_detail2, #file_detail3').remove();
		$("[id^='file_upload']").not("#file_upload").remove();
	},
	
	// grid 초기화
	fnGridInit: function() {
		sy_noticeBoard.gridDataList = null;
		sy_noticeBoard.grid.option("dataModel.data", []);
		sy_noticeBoard.grid.refreshDataAndView();
	}
}

$(function() {
	$('.notice-detail').hide();
	$('.notice-edit').hide();
		
	common.setCommCode($("#schNoticsYn"),"NOTICS_YN", "", 2); // 공지여부
	$('.notice-edit').find('input, select').css({'font-size': '12px', 'font-weight': 'bold'});					
	$("#schUserNm_e").css("border", "none");					
	$("#schCreDt_e").css("border", "none");	
		
	history.replaceState({}, null, location.pathname);
	sy_noticeBoard.fnEvent();
	sy_noticeBoard.setGrid();
	
});
