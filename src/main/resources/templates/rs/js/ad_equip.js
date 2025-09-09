var $adEquipPqgrid = $("#adEquipPqgridDiv");
var bxSlider;

$(function() {
	$(".bxslider-div").hide();

	//공통코드 세팅 ***
	common.setCommCode($("#adEquipEquipCd"), "EQUIP_CD", null, 3);//공통코드 세팅
	common.setCorpCode($("#adEquipCpcd"), null, 2);//공통코드 세팅
	common.setCommCode($("#adEquipShUseYn"), "SH_USE_YN", null, 2, function(dataList) {
		$(this).find("option[value=D]").remove();//'삭제' 옵션제거
	});

	bxSlider = $('.bxslider').bxSlider({
		speed: 500,
		pager:true,
		captions: true,
		mode:'fade',
	});

	fnEvent();
	//그리드세팅
	fnInitGrid();
});


function fnEvent(){
	//   -----'조회' 버튼클릭시 이벤트-----   //
	$('#adEquipSearchBtn').click(() => fnSearch());

	$('#adEquipSearchResetBtn').click(() => {
		$(".search-conditions").find("select").find('option:first').prop("selected", true);
	});

	$('#adEquipEquipCd').change(() => {
		$adEquipPqgrid.option("dataModel.data", []);
		$adEquipPqgrid.refreshDataAndView();
	});

	$("#adEquipSaveBtn").click(() => fnSaveAdEquip());

	$('#adEquipImageSaveBtn').click(() => {
		var selectRow = $adEquipPqgrid.SelectRow().getSelection()[0];
		if(!selectRow){
			alert("선택된 기자재가 없습니다.");
			return
		}

		var rowData = selectRow.rowData;
		var shUseYn = rowData.SH_USE_YN;

		if(shUseYn === "A" || shUseYn === "S" || shUseYn === "F"){
			alert("해당 기자재는 "+rowData.SH_USE_YN_NM+"으로 삭제 및 변경할 수 없습니다.");
			return
		}
		$("#adEquipPhotoFile").click();
	});

	$("#adEquipPhotoFile").change(() => {//사진등록 : 기자재 사진
		fnSetImage();
	});
}

//그리드세팅
function fnInitGrid() {
	//array of columns.
	var colModel = [
		{title:"기자재구분",align:"center",dataType:"string",dataIndx:"EQUIP_TYPE_NM"},
		{title:"기자재 명",align:"center",dataType:"string",dataIndx:"EQUIP_NM"},
		{title:"사용여부",align:"center",dataType:"string",dataIndx:"USE_YN_NM"},
		{title:"공유여부",align:"center",dataType:"string",dataIndx:"SH_USE_YN_NM"},
		{dataIndx:"EQUIP_ID",hidden:true},
		{dataIndx:"EQUIP_CD",hidden:true},
		{dataIndx:"PHOTO_FILE",hidden:true},
		{dataIndx:"PHOTO_FILE2",hidden:true},
		{dataIndx:"PHOTO_FILE3",hidden:true},
		{dataIndx:"SH_USE_YN",hidden:true},
	];

	//main object to be passed to pqGrid constructor.
	var obj = {
		width: '100%',
		height: '99%',
		trackModel: { on: true },
		dataModel: { data: [], recIndx: "EQUIP_ID" },
		showTop: false,
		editable: false,
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		colModel: colModel,
		selectionModel: { type: "row", mode: "single" },
		rowClick: function(e, ui) {
			$(".bxslider-div").hide();

			var rowData = ui.rowData;
			var shUseYn = rowData.SH_USE_YN;

			var delBtnFlag = true;
			if (shUseYn === "S" || shUseYn === "A" || shUseYn === "R") {
				delBtnFlag = false;
			}

			fnInitEquipPhoto(rowData, delBtnFlag);
		}
	};

	var gridId = "adEquipPqgridDiv";//그리드 ID
	this.gridCmmn = new GridUtil(colModel, location.pathname, gridId, obj);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridCmmn.open();//그리드 생성
	$adEquipPqgrid = gridCmmn.getGrid();//그리드 객체
}


function fnInitEquipPhoto(rowData, delBtnFlag){
	console.log(rowData);
	var $bxslider = $(".bxslider");
	var $bxsliderDiv = $(".bxslider-div");

	$bxsliderDiv.hide();
	$bxslider.empty();

	var equipPhotoLength = 0;
	["PHOTO_FILE","PHOTO_FILE2","PHOTO_FILE3"].forEach((item) => {
		if(rowData[item]){
			console.log(item);
			var $equipPhotoLi = $('<li/>');
			if(delBtnFlag){
				$equipPhotoLi.append($('<button/>', {id:item,class:'btn-pic-delete'}).click((e) => fnRemoveImage(e)));
			}
			$equipPhotoLi.append($('<img/>', {src:"data:image;base64,"+rowData[item], style:'height:600px'}));
			$bxslider.append($equipPhotoLi);
			equipPhotoLength++;
		}
	});

	if(equipPhotoLength < 1){
		return;
	}

	bxSlider.reloadSlider();
	$bxsliderDiv.show();
}

function fnSetImage(){
	var selectRow = $adEquipPqgrid.SelectRow().getSelection()[0];
	if(!selectRow){
		alert("선택된 기자재가 없습니다.");
		return;
	}

	var rowData = selectRow.rowData;

	var equipPhotoArr = ["PHOTO_FILE", "PHOTO_FILE2", "PHOTO_FILE3"];
	equipPhotoArr = equipPhotoArr.filter((item) => {
		return !rowData[item];
	});

	if(equipPhotoArr.length === 0){
		alert("사진은 3개까지 등록 가능합니다.");
		return;
	}

	var thisFile = $("#adEquipPhotoFile")[0].files[0];
	var reader = new FileReader();
	reader.readAsDataURL(thisFile);
	reader.onload = function() {
		var imageURI = reader.result;
		var $equipPhotoLi = $('<li/>');
		$equipPhotoLi.append($('<button/>', {id:equipPhotoArr[0], class:'btn-pic-delete new-equip-photo'}).click((e) => fnRemoveImage(e)));
		$equipPhotoLi.append($('<img/>', {src:imageURI, style:'height:600px'}));
		$(".bxslider").append($equipPhotoLi);
		bxSlider.reloadSlider();
		bxSlider.goToPrevSlide();

		var startIdx = imageURI.indexOf(',');
		imageURI = imageURI.substring(startIdx+1, imageURI.length);
		fnSetImageForGrid(selectRow, imageURI, equipPhotoArr[0]);

		$(".bxslider-div").show();
		$("#adEquipPhotoFile").val("");
	};
}

function fnRemoveImage(e){
	if(confirm("삭제하시겠습니까?")){
		var selectRow = $adEquipPqgrid.SelectRow().getSelection()[0];
		var targetEl = $("#"+e.target.id);
		if(!targetEl.hasClass('new-equip-photo')){
			alert("저장버튼을 눌러야 삭제됩니다.");
		}
		targetEl.parent().remove();
		if($(".bxslider > li").length === 0){
			$(".bxslider-div").hide();
			return;
		}
		fnSetImageForGrid(selectRow, null, e.target.id);
		bxSlider.reloadSlider();
	}
}

function fnSetImageForGrid(selectRow, imageURI, dataIndx){
	$adEquipPqgrid.options.editable = true;//수정모드
	var newRow = {};
	newRow[dataIndx] = imageURI;
	$adEquipPqgrid.updateRow({rowIndx: selectRow.rowIndx, newRow: newRow});
	//조회 데이터 수정
	$adEquipPqgrid.options.editable = false;//수정모드 종료
}

//조회
function fnSearch() {
	var param = {
		'equipCd' : $("#adEquipEquipCd").val(),
		'cpCd' : $("#adEquipCpcd").val(),
		'useYn' : $("#adEquipUseYn").val(),
		'shUseYn' : $("#adEquipShUseYn").val(),
	}

	$.ajax({
		url: '/rs/equip/getAdEquipList',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(param),
		beforeSend: function(jqXHR, settings) {
			$adEquipPqgrid.showLoading();
		},
		success: function(result) {
			$(".bxslider-div").hide();
			$adEquipPqgrid.option("dataModel.data", result);
			$adEquipPqgrid.refreshDataAndView();
		},
		complete: function() {
			$adEquipPqgrid.hideLoading();
		}
	});
}

function fnSaveAdEquip() {
	if (!$adEquipPqgrid.isDirty()) {
		alert("수정된 내용이 없습니다.");
		return;
	}
	var param = DsUtil.getGridData($adEquipPqgrid);

	if (confirm("저장하시겠습니까?")) {
		$.ajax({
			url: '/rs/equip/saveAdEquip',
			type: 'POST',
			data: JSON.stringify(param),
			contentType: 'application/json',
			dataType: 'json',
			beforeSend: function(jqXHR, settings) {
				$adEquipPqgrid.showLoading();
			},
			success: function(response) {
				alert("저장 되었습니다.");
				fnSearch();
			},
			complete: function() {
				$adEquipPqgrid.hideLoading();
			}
		});
	}
}