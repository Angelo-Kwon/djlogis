var $adCarPggrid = $("#adCarPggridDiv");
var bxSlider;

$(function(){
	$(".bxslider-div").hide();

	common.setCommCode($("#adCarShUseYn"), "SH_USE_YN", null, 2, function(dataList) {
		$(this).find("option[value=D]").remove();//'삭제' 옵션제거
	});

	//차량년식 OPTION : 최근30년
	var loopYear = parseInt(common.getToday().substring(0,4));
	for(var year=loopYear ; year > loopYear-30 ; year--){
		$("#carYear").append($('<option/>', {value:year,text:year}));
	}

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
	$("#adCarSeacrhClearBtn").click(() => {
		$(".search-conditions").find("select").find('option:first').prop("selected", true);
		$(".search-conditions").find("input").val("");
	});

	$("#adCarSearchBtn").click(() => fnSearch()); // 조회버튼
	$("#adCarAddCarPhot").click(() => fnAddCarPhot("photo")); // 차량사진등록버튼
	$("#adCarAddCarCard").click(() => fnAddCarPhot("card")); // 차량사진등록버튼
	$("#adCarPhotFile").change(() => fnSetImage("photo")); //차량사진 체인지이벤트
	$("#adCarCardFile").change(() => fnSetImage("card")); //차량사진 체인지이벤트
	$("#adCarSaveBtn").click(() => fnSaveAdCar()); //저장버튼

	//자동차등록증 삭제.
	$("#adCarCardDelBtn").click(() => {
		var selectRow = $adCarPggrid.SelectRow().getSelection()[0];

		if(confirm("삭제하시겠습니까?")){
			fnSetImageForGrid(selectRow, null, 'carCard');
			$(".pic-car-card").hide();
			alert("저장버튼을 눌러야 삭제됩니다.");
		}
	});

	$("#adCarResetBtn").click(() => {
		var selectRow = $adCarPggrid.SelectRow().getSelection()[0];
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
    	{title: "차량번호(FULL)", dataType: "string", dataIndx: "CAR_FULL_NO", align: "center", width:140},
        {title: "적재중량(kg)", dataType: "string", dataIndx: "CAR_LOD_WGT", align: "center", width:110},
        {title: "사용여부", dataType: "string", dataIndx: "USE_YN_NM", align: "center", width:80},
        {title: "공유여부", dataType: "string", dataIndx: "SH_USE_YN_NM", align: "center", width:80},
		{dataIndx:"SH_USE_YN", hidden:true},
		{dataIndx:"carId", hidden:true},
		{dataIndx:"passYn", hidden:true},
		{dataIndx:"diviYn", hidden:true},
		{dataIndx:"geraYn", hidden:true},
		{dataIndx:"airYn", hidden:true},
		{dataIndx:"carReleDt", hidden:true},
		{dataIndx:"carYear", hidden:true},
		{dataIndx:"carTempYn", hidden:true},
		{dataIndx:"carGpsYn", hidden:true},
		{dataIndx:"carPhot", hidden:true},
		{dataIndx:"carPhot2", hidden:true},
		{dataIndx:"carPhot3", hidden:true},
		{dataIndx:"carCard", hidden:true},
    ];

	var options = {
		width: '100%',
		height: '99%',
		showTop: false,
		editable: false,
		numberCell: {show:true, resizable: false, title: "순번", minWidth:45},
		selectionModel: {type: "row", mode: "single"},
		trackModel: {on:true}, //GRID 추가,수정,삭제 처리된 상태 확인용 옵션
		dataModel: { data: [], recIndx: "carId" },
		autoColumnWidth:false,
		beforeRowSelect:function(event, ui){
			fnSetDataForGrid();
		},
		rowClick: function(e, ui) {
			var rowData = ui.rowData;
			var shUseYn = rowData.SH_USE_YN;

			fnDetailViewClear();

			common.setValToComp(rowData);

			var delBtnFlag = false;
			var $searchEdit = $(".search-edit");
			if (shUseYn === "S" || shUseYn === "A" || shUseYn === "R") {
				$searchEdit.find("select,input").prop("disabled", true);
				$("#adCarCardDelBtn").hide();
			} else {
				$searchEdit.find("select,input").prop("disabled", false);
				$("#adCarCardDelBtn").show();
				delBtnFlag = true;
			}

			fnInitCarPhot(rowData, delBtnFlag);
			if(rowData.carCard){
				$("#adCarCardImage").attr("src", "data:image;base64,"+rowData.carCard);
				$(".pic-car-card").show();
			}
		}
	};

	var gridId = "adCarPggridDiv";//그리드 ID
	this.gridCmmn = new GridUtil(colModel, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridCmmn.open();//그리드 생성
	$adCarPggrid = gridCmmn.getGrid();//그리드 객체
}

//입력된 값을 grid rowData에 저장
function fnSetDataForGrid() {
	var selectRow = $adCarPggrid.SelectRow().getSelection()[0];
	if (!selectRow) {
		return;
	}

	var rowData = selectRow.rowData;
	var shUseYn = rowData.shUseYn;
	if (shUseYn === "Y" || shUseYn === "S" || shUseYn === "R") {
		return;
	}

	var removeDataIndxArr = ['CAR_FULL_NO', 'CAR_LOD_WGT', 'USE_YN_NM', 'SH_USE_YN_NM',
		'SH_USE_YN','carId','carPhot','carPhot2','carPhot3','carCard'];
	var colModel = $adCarPggrid.getColModel();
	var setDataArr = colModel.filter((item) => {
		return removeDataIndxArr.includes(item.dataIndx) === false;
	});

	var newData = {};
	setDataArr.forEach((item) => {
		var dataIndx = item.dataIndx;
		newData[dataIndx] = $("#"+dataIndx).val();
	});
	$adCarPggrid.options.editable = true;//수정모드
	$adCarPggrid.updateRow({rowIndx: selectRow.rowIndx, newRow: newData});
	//조회 데이터 수정
	$adCarPggrid.options.editable = false;//수정모드 종료
}

function fnInitCarPhot(rowData, delBtnFlag){
	var $bxslider = $(".bxslider");
	var $bxsliderDiv = $(".bxslider-div");

	$bxsliderDiv.hide();
	$bxslider.empty();

	var carPhotLength = 0;
	["carPhot","carPhot2","carPhot3"].forEach((item) => {
		if(rowData[item]){
			var $carPhotLi = $('<li/>');
			if(delBtnFlag){
				$carPhotLi.append($('<button/>', {id:item,class:'btn-pic-delete'}).click((e) => fnRemoveImage(e)));
			}
			$carPhotLi.append($('<img/>', {src:"data:image;base64,"+rowData[item], style:'height:300px'}));
			$bxslider.append($carPhotLi);
			carPhotLength++;
		}
	});

	if(carPhotLength < 1){
		return;
	}

	bxSlider.reloadSlider();
	$bxsliderDiv.show();
}

function fnAddCarPhot(type){
	var selectRow = $adCarPggrid.SelectRow().getSelection()[0];
	if(!selectRow){
		alert("선택된 차량이 없습니다.");
		return;
	}

	var rowData = selectRow.rowData;
	var shUseYn = rowData.SH_USE_YN;

	if(shUseYn === "A" || shUseYn === "S" || shUseYn === "R"){
		alert("해당 차량은 공유"+rowData.SH_USE_YN_NM+"으로 이미지 등록이 불가능합니다.");
		return false;
	}

	if(type === "photo"){
		$("#adCarPhotFile").click();
	}else{
		$("#adCarCardFile").click();
	}
}

function fnSetImage(type){
	var selectRow = $adCarPggrid.SelectRow().getSelection()[0];
	if(!selectRow){
		alert("선택된 차량이 없습니다.");
		return;
	}

	var rowData = selectRow.rowData;
	var reader = new FileReader();

	if(type === "photo"){
		var carPhotArr = ['carPhot','carPhot2','carPhot3'];
		carPhotArr = carPhotArr.filter((item) => {
			return !rowData[item];
		});

		if(carPhotArr.length === 0){
			alert("사진은 3개까지 등록 가능합니다.");
			return;
		}
		var thisFile = $("#adCarPhotFile")[0].files[0];

		reader.readAsDataURL(thisFile);
		reader.onload = function() {
			var imageURI = reader.result;
			var $carPhotLi = $('<li/>');
			$carPhotLi.append($('<button/>', {id:carPhotArr[0], class:'btn-pic-delete new-car-phot'}).click((e) => fnRemoveImage(e)));
			$carPhotLi.append($('<img/>', {src:imageURI, style:'height:300px'}));
			$(".bxslider").append($carPhotLi);
			bxSlider.reloadSlider();
			bxSlider.goToPrevSlide();

			var startIdx = imageURI.indexOf(',');
			imageURI = imageURI.substring(startIdx+1, imageURI.length);
			fnSetImageForGrid(selectRow, imageURI, carPhotArr[0]);

			$(".bxslider-div").show();
			$("#adCarPhotFile").val("");
		};
	}else{
		var thisFile = $("#adCarCardFile")[0].files[0];
		reader.readAsDataURL(thisFile);
		reader.onload = function() {
			var imageURI = reader.result;
			$("#adCarCardImage").attr("src", reader.result);

			var startIdx = imageURI.indexOf(',');
			imageURI = imageURI.substring(startIdx+1, imageURI.length);
			fnSetImageForGrid(selectRow, imageURI, "carCard");
			$("#adCarCardFile").val("");
		}
	}
}

function fnRemoveImage(e){
	if(confirm("삭제하시겠습니까?")){
		var selectRow = $adCarPggrid.SelectRow().getSelection()[0];
		var targetEl = $("#"+e.target.id);
		if(!targetEl.hasClass('new-car-phot')){
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
	console.log("imageURI : " + imageURI);
	$adCarPggrid.options.editable = true;//수정모드
	var newRow = {};
	newRow[dataIndx] = imageURI;
	$adCarPggrid.updateRow({rowIndx: selectRow.rowIndx, newRow: newRow});
	//조회 데이터 수정
	$adCarPggrid.options.editable = false;//수정모드 종료
}

/*
 * 조회 : 차량 부가정보 조회
 */
function fnSearch(){
	var param = {
		'carFullNo' : $('#adCarFullNo').val(),
		'carCpCd' : $('#adCarCpCd').val(),
		'useYn' : $('#adCarUseYn').val(),
		'shUseYn' : $('#adCarShUseYn').val()
	}

	//로딩바 SHOW
	$adCarPggrid.showLoading();
	//호출
	$.ajax({ 
		url:"/rs/car/getAdCarList",
		data:param,
		type:"POST",
		dataType:"json",
		success:function(data){
			fnDetailViewClear();
            // 변경된 부분: 그리드에 데이터 할당
			$adCarPggrid.option("dataModel.data", data.dataList);
			$adCarPggrid.refreshDataAndView();
        },
		error:function(e){
			$adCarPggrid.hideLoading();
		},
		complete:function(e){
			//로딩바 HIDE
			$adCarPggrid.hideLoading();
			//그리드 히스토리 초기화
			$adCarPggrid.History().reset();
		},
	});
}

/*
 * 저장
 */
function fnSaveAdCar() {
	fnSetDataForGrid();

	if (!$adCarPggrid.isDirty()) {
		alert("수정된 내용이 없습니다.");
		return;
	}

	if(confirm("저장하시겠습니까?")){
		var param = $adCarPggrid.getChanges({format: 'byVal'});

		$adCarPggrid.showLoading();
		$.ajax({
			// url:"/rs/car/saveCarAddInfo",
			url: "/rs/car/saveAdCar",
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
				$adCarPggrid.hideLoading();
			}
		});
	}
}

function fnDetailViewClear(){
	$(".pic-detail").hide();
	$(".bxslider-div").hide();
	var $searchEdit = $(".search-edit");
	$searchEdit.find("select").find('option:first').prop("selected", true);
	$searchEdit.find("input").val("");
	$searchEdit.find("select,input").prop("disabled", false);
}