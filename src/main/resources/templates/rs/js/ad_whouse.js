var $adWhousePqgrid = $("#adWhousePqgridDiv");
var bxSlider;

$(function(){
	$(".bxslider-div").hide();

	common.setCommCode($("#adWhouseShUseYn"), "SH_USE_YN", null, 2, function(dataList) {
		$(this).find("option[value=D]").remove();//'삭제' 옵션제거
	});

	bxSlider = $('.bxslider').bxSlider({
		speed: 500,
		pager:true,
		captions: true,
		mode:'fade',
	});

	fnEvent();
	fnInitGrid();
});

function fnEvent(){
	//검색조건 초기화버튼
	$("#adWhouseSeacrhClearBtn").click(() => {
		$(".search-conditions").find("select").find('option:first').prop("selected", true);
		$(".search-conditions").find("input").val("");
	});

	$("#adWhouseSearchBtn").click(() => fnSearch()); // 조회버튼
	$("#adWhouseAddPhoto").click(() => fnAddWhousePhoto()); // 창고사진등록버튼
	$("#adWhousePhotoFile").change(() => fnSetImage()); //창고사진 체인지이벤트
	$("#adWhouseSaveBtn").click(() => fnSaveAdWhouse()); //저장버튼

	//상세 초기화 버튼
	$("#adWhouseResetbtn").click(() => {
		var selectRow = $adWhousePqgrid.SelectRow().getSelection()[0];
		if (!selectRow) {
			alert("선택된 창고가 없습니다.");
			return;
		}

		var rowData = selectRow.rowData;
		for(var i=0; i<3; i++){
			['photo','photo2','photo3'].forEach((item) => {
				if(rowData[item]){
					fnSetImageForGrid(selectRow, null, item);
				}
			});
		}
		fnDetailViewClear();
		$(".bxslider").empty();

	}); // 상세조회 초기화 버튼
}

// init 그리드
function fnInitGrid(){
	//Grid
	var colModel = [
		{title: "창고명", dataType: "string", dataIndx: "WH_NM", align: "center", width:150},
		{title: "지역(시/군/구)", dataType: "string", dataIndx: "AREA_NM2", align: "center", width:100},
		{title: "사용여부", dataType: "string", dataIndx: "USE_YN_NM", align:"center", width:80},
		{title: "공유여부", dataType: "string", dataIndx: "SH_USE_YN_NM", align:"center", width:80},
		{dataIndx:"whId", hidden:true},
		{dataIndx:"SH_USE_YN", hidden:true},
		{dataIndx:"farmYn", hidden:true},
		{dataIndx:"fishYn", hidden:true},
		{dataIndx:"meatYn", hidden:true},
		{dataIndx:"foodYn", hidden:true},
		{dataIndx:"fashionYn", hidden:true},
		{dataIndx:"machYn", hidden:true},
		{dataIndx:"mediYn", hidden:true},
		{dataIndx:"furnYn", hidden:true},
		{dataIndx:"elecYn", hidden:true},
		{dataIndx:"metalYn", hidden:true},
		{dataIndx:"etcYn", hidden:true},
		{dataIndx:"isoYn", hidden:true},
		{dataIndx:"aeoYn", hidden:true},
		{dataIndx:"kgspYn", hidden:true},
		{dataIndx:"tapaYn", hidden:true},
		{dataIndx:"logiYn", hidden:true},
		{dataIndx:"fireInsuYn", hidden:true},
		{dataIndx:"saleInsuYn", hidden:true},
		{dataIndx:"dockYn", hidden:true},
		{dataIndx:"canopyYn", hidden:true},
		{dataIndx:"cargoYn", hidden:true},
		{dataIndx:"platYn", hidden:true},
		{dataIndx:"autoYn", hidden:true},
		{dataIndx:"rackYn", hidden:true},
		{dataIndx:"verticalYn", hidden:true},
		{dataIndx:"memo", hidden:true},
		{dataIndx:"photo", hidden:true},
		{dataIndx:"photo2", hidden:true},
		{dataIndx:"photo3", hidden:true},
	];

	var options = {
		width: '100%',
		height: '99%',
		showTop: false,
		editable: false,
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		selectionModel: {type: "row", mode: "single"},
		trackModel: {on:true}, //GRID 추가,수정,삭제 처리된 상태 확인용 옵션
		dataModel: { data: [], recIndx: "whId" },
		autoColumnWidth:false,
		beforeRowSelect:function(event, ui){
			fnSetDataForGrid();
		},
		rowClick: function(e, ui) {
			var rowData = ui.rowData;
			var shUseYn = rowData.SH_USE_YN;

			fnDetailViewClear();

			var removeDataIndxArr = ['WH_NM', 'AREA_NM2', 'USE_YN_NM', 'SH_USE_YN_NM',
				'SH_USE_YN','whId','memo','photo','photo2','photo3'];
			var setDataArr = colModel.filter((item) => {
				return removeDataIndxArr.includes(item.dataIndx) === false;
			});

			setDataArr.forEach((item) => {
				var dataIndx = item.dataIndx;
				var checked = rowData[dataIndx]==="Y"?true:false;
				$("#"+dataIndx).prop("checked", checked);
			});
			$("#memo").val(rowData.memo);

			var delBtnFlag = false;
			var $searchEdit = $(".search-edit");
			if (shUseYn === "S" || shUseYn === "A" || shUseYn === "R") {
				$searchEdit.find("input,textarea").prop("disabled", true);
			} else {
				$searchEdit.find("input,textarea").prop("disabled", false);
				delBtnFlag = true;
			}

			fnInitWhousePhoto(rowData, delBtnFlag);
		}
	};

	var gridId = "adWhousePqgridDiv";//그리드 ID
	this.gridCmmn = new GridUtil(colModel, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridCmmn.open();//그리드 생성
	$adWhousePqgrid = gridCmmn.getGrid();//그리드 객체
}

//입력된 값을 grid rowData에 저장
function fnSetDataForGrid() {
	var selectRow = $adWhousePqgrid.SelectRow().getSelection()[0];
	if (!selectRow) {
		return;
	}

	var rowData = selectRow.rowData;
	var shUseYn = rowData.shUseYn;
	if (shUseYn === "Y" || shUseYn === "S" || shUseYn === "R") {
		return;
	}

	var removeDataIndxArr = ['WH_NM', 'AREA_NM2', 'USE_YN_NM', 'SH_USE_YN_NM',
		'SH_USE_YN','whId','memo','photo','photo2','photo3'];
	var colModel = $adWhousePqgrid.getColModel();
	var setDataArr = colModel.filter((item) => {
		return removeDataIndxArr.includes(item.dataIndx) === false;
	});

	var newData = {};
	setDataArr.forEach((item) => {
		var dataIndx = item.dataIndx;
		newData[dataIndx] = $("#"+dataIndx).is(":checked")?"Y":"N";
	});
	newData["memo"] = $("#memo").val();
	$adWhousePqgrid.options.editable = true;//수정모드
	$adWhousePqgrid.updateRow({rowIndx: selectRow.rowIndx, newRow: newData});
	//조회 데이터 수정
	$adWhousePqgrid.options.editable = false;//수정모드 종료
}

function fnInitWhousePhoto(rowData, delBtnFlag){
	var $bxslider = $(".bxslider");
	var $bxsliderDiv = $(".bxslider-div");

	$bxsliderDiv.hide();
	$bxslider.empty();

	var whousePhotoLength = 0;
	["photo","photo2","photo3"].forEach((item) => {
		if(rowData[item]){
			var $whousePhotoLi = $('<li/>');
			if(delBtnFlag){
				$whousePhotoLi.append($('<button/>', {id:item,class:'btn-pic-delete'}).click((e) => fnRemoveImage(e)));
			}
			$whousePhotoLi.append($('<img/>', {src:"data:image;base64,"+rowData[item], style:'height:300px'}));
			$bxslider.append($whousePhotoLi);
			whousePhotoLength++;
		}
	});

	if(whousePhotoLength < 1){
		return;
	}

	bxSlider.reloadSlider();
	$bxsliderDiv.show();
}

function fnAddWhousePhoto(){
	var selectRow = $adWhousePqgrid.SelectRow().getSelection()[0];
	if(!selectRow){
		alert("선택된 창고가 없습니다.");
		return;
	}

	var rowData = selectRow.rowData;
	var shUseYn = rowData.SH_USE_YN;

	if(shUseYn === "A" || shUseYn === "S" || shUseYn === "R"){
		alert("해당 차량은 공유"+rowData.SH_USE_YN_NM+"으로 이미지 등록이 불가능합니다.");
		return false;
	}

	$("#adWhousePhotoFile").click();
}

function fnSetImage(){
	var selectRow = $adWhousePqgrid.SelectRow().getSelection()[0];
	var rowData = selectRow.rowData;

	var whousePhotoArr = ['photo','photo2','photo3'];
	whousePhotoArr = whousePhotoArr.filter((item) => {
		return !rowData[item];
	});

	if(whousePhotoArr.length === 0){
		alert("사진은 3개까지 등록 가능합니다.");
		return;
	}

	var thisFile = $("#adWhousePhotoFile")[0].files[0];
	var reader = new FileReader();
	reader.readAsDataURL(thisFile);
	reader.onload = function() {
		var imageURI = reader.result;
		var $whousePhotoLi = $('<li/>');
		$whousePhotoLi.append($('<button/>', {id:whousePhotoArr[0], class:'btn-pic-delete new-whouse-photo'}).click((e) => fnRemoveImage(e)));
		$whousePhotoLi.append($('<img/>', {src:imageURI, style:'height:300px'}));
		$(".bxslider").append($whousePhotoLi);
		bxSlider.reloadSlider();
		bxSlider.goToPrevSlide();

		var startIdx = imageURI.indexOf(',');
		imageURI = imageURI.substring(startIdx+1, imageURI.length);
		fnSetImageForGrid(selectRow, imageURI, whousePhotoArr[0]);

		$(".bxslider-div").show();
		$("#adWhousePhotoFile").val("");
	};
}

function fnRemoveImage(e){
	if(confirm("삭제하시겠습니까?")){
		var selectRow = $adWhousePqgrid.SelectRow().getSelection()[0];
		var targetEl = $("#"+e.target.id);
		if(!targetEl.hasClass('new-whouse-photo')){
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
	$adWhousePqgrid.options.editable = true;//수정모드
	var newRow = {};
	newRow[dataIndx] = imageURI;
	$adWhousePqgrid.updateRow({rowIndx: selectRow.rowIndx, newRow: newRow});
	//조회 데이터 수정
	$adWhousePqgrid.options.editable = false;//수정모드 종료
}

/*
 * 조회 : 차량 부가정보 조회
 */
function fnSearch(){
	var param = {
		'whNm' : $('#adWhouseWhNm').val(),
		'dtAddr' : $('#adWhouseDtAddr').val(),
		'chNm' : $('#adWhouseChNm').val(),
		'useYn' : $('#adWhouseUseYn').val(),
		'shUseYn' : $('#adWhouseShUseYn').val()
	}

	//로딩바 SHOW
	$adWhousePqgrid.showLoading();
	//호출
	$.ajax({
		url:"/rs/whouse/getAdWhouseList",
		data:param,
		type:"POST",
		dataType:"json",
		success:function(data){
			$adWhousePqgrid.option("dataModel.data", data.dataList);
			$adWhousePqgrid.refreshDataAndView();
		},
		error:function(e){
			$adWhousePqgrid.hideLoading();
		},
		complete:function(e){
			//로딩바 HIDE
			$adWhousePqgrid.hideLoading();
			//그리드 히스토리 초기화
			$adWhousePqgrid.History().reset();
		},
	});
}

/*
 * 저장
 */
function fnSaveAdWhouse() {
	fnSetDataForGrid();

	if (!$adWhousePqgrid.isDirty()) {
		alert("수정된 내용이 없습니다.");
		return;
	}

	if(confirm("저장하시겠습니까?")){
		var param = $adWhousePqgrid.getChanges({format: 'byVal'});

		$adWhousePqgrid.showLoading();
		$.ajax({
			// url:"/rs/car/saveCarAddInfo",
			url: "/rs/whouse/saveAdWhouse",
			type: "POST",
			data: JSON.stringify(param),
			contentType: 'application/json',
			dataType: 'json',
			success: function (result) {
				alert("저장 되었습니다.");
				fnSearch();
			},
			error: function (e) {
				alert(e);
			},
			complete: function (e) {
				// 로딩바 감춤
				$adWhousePqgrid.hideLoading();
			}
		});
	}
}

function fnDetailViewClear(){
	$(".bxslider-div").hide();
	var $searchEdit = $(".search-edit");
	$searchEdit.find("input").prop('checked', false);
	$searchEdit.find("input,textarea").prop("disabled", false);
	$("#memo").val("");
}