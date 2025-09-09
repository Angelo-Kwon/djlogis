var $cmCarPqgrid = $("#cmCarPqgridDiv");
var bxSlider;

$(function(){

	common.setNumOnly("cmCarCarFullNo","carNo");//숫자만
	common.setNumOnlyWithComma("cmPrice");//숫자만-콤마처리
	common.setCommCode($("#carClsCd"),"VHCOPTY");//공통코드
	common.setCommCode($("#carModCd"),"VHCTYPE");//공통코드
	common.setCommCode($("#carOprCd"),"DLVTYPE");//공통코드
	common.setCommCode($("#carTempCd"),"SKUGR01");//공통코드
	common.setNumOnlyForObj($("#brNo"));//사업자등록번호
	common.setBrnoForObj($("#brNo"));//사업자등록번호
	fnMakeCarTypeSelectBox();

	$(".bxslider-div").hide();

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

function fnMakeCarTypeSelectBox(){
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/rs/car/getMdCarList",
		success: function (result) {
			var $carType = $("#carType");

			result.dataList.forEach((obj) => {
				$carType.append($('<option/>', {value:obj.value, text:obj.text}).data("carTypeObj", obj));
			});
			$carType.change(function(){
				var obj = $(this).find("option:selected").data("carTypeObj");
				if($(this).val()){
					$("#carLodCbm").val(obj.CAR_LOD_CBM);
					$("#carLodWgt").val(obj.CAR_LOD_WGT);
					$("#carLodWdt").val(obj.CAR_LOD_WDT);
					$("#carLodLen").val(obj.CAR_LOD_LEN);
					$("#carLodHgt").val(obj.CAR_LOD_HGT);
				}else{
					$("#carLodCbm").val('');
					$("#carLodWgt").val('');
					$("#carLodWdt").val('');
					$("#carLodLen").val('');
					$("#carLodHgt").val('');
				}
			});
		}
	});
}

function fnEvent(){

	//검색조건 초기화버튼
	$("#cmCarClearAllBtn").click(() => {
		$(".search-conditions").find("select").find('option:first').prop("selected", true);
		$(".search-conditions").find("input").val("");
		fnDetailViewClear();
		fnResetGrid();
	});
	$(".search-conditions input").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#cmCarSearchBtn").click(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
		}
	});
	$("#cmCarAddRowBtn").click(() => fnAddRow()); // 추가버튼
	$("#cmCarDelRowBtn").click(() => fnDelRow()); // 삭제버튼
	$("#cmCarSearchBtn").click(() => fnSearch()); // 조회버튼
	$("#cmCarSaveBtn").click(() => fnSaveCar()); //저장버튼

	$("#adCarAddCarPhot").click(() => fnAddCarPhot("photo")); // 차량사진등록버튼
	$("#adCarAddCarCard").click(() => fnAddCarPhot("card")); // 차량사진등록버튼
	$("#adCarPhotFile").change(() => fnSetImage("photo")); //차량사진 체인지이벤트
	$("#adCarCardFile").change(() => fnSetImage("card")); //차량사진 체인지이벤트

	//자동차등록증 삭제.
	$("#adCarCardDelBtn").click(() => {
		var selectRow = $cmCarPqgrid.SelectRow().getSelection()[0];

		if(confirm("삭제하시겠습니까?")){
			fnSetImageForGrid(selectRow, null, 'carCard');
			$(".pic-car-card").hide();
			alert("저장버튼을 눌러야 삭제됩니다.");
		}
	});

	$("#cmCarResetBtn").click(() => {
		var selectRow = $cmCarPqgrid.SelectRow().getSelection()[0];
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
	});

	$(".nav-link").click(function(){
		var navId = this.id;
		if(navId === "cmCarNav"){
			$("#adCarNav").removeClass("active");
			$("#cmCarNav").addClass("active");
			$("#adCarTabDiv").removeClass("show active").hide();
			$("#cmCarTabDiv").addClass("show active").show();
		}else{
			$("#cmCarNav").removeClass("active");
			$("#adCarNav").addClass("active");
			$("#cmCarTabDiv").removeClass("show active").hide();
			$("#adCarTabDiv").addClass("show active").show();
		}
	});
}

// init 그리드
function fnInitGrid(){
	//Grid
	var colModel = [
		{ title: "적재중량(kg)", dataType: "string", dataIndx: "carLodWgt", align: "center", width:110},
		{ title: "차량번호(FULL)", dataType: "string", dataIndx: "carFullNo", align: "center", width:140 },
		{ title: "사용여부", dataType: "string", dataIndx: "useYn", align: "center", width:80,
			render: function (ui){
				return ui.rowData.useYn === 'Y' ? '사용' : '미사용';
			}
		},
		{ title: "공유여부", dataType: "string", dataIndx: "SH_USE_YN_NM", align: "center", width:80 },
		{ title: '공급자명', dataIndx: "userNm", hidden: true },
		{ title: '차량ID', dataIndx: "carId", hidden: true },
		{ title: '차량번호', dataIndx: "carNo", hidden: true },
		{ title: '사업자등록번호', dataIndx: "brNo", hidden: true },
		{ title: '운송사', dataIndx: "carCpCd", hidden: true },
		{ title: '차량구분', dataIndx: "carClsCd", hidden: true },
		{ title: '운송구분', dataIndx: "carOprCd", hidden: true },
		{ title: '온도구분', dataIndx: "carTempCd", hidden: true },
		{ title: '차종구분', dataIndx: "carModCd", hidden: true },
		{ title: '차량규격', dataIndx: "carType", hidden: true },
		{ title: '적재CBM', dataIndx: "carLodCbm", hidden: true },
		{ title: '적재너비(mm)', dataIndx: "carLodWdt", hidden: true },
		{ title: '적재길이(mm)', dataIndx: "carLodLen", hidden: true },
		{ title: '적재높이(mm)', dataIndx: "carLodHgt", hidden: true },
		{ title: '지역(시도)', dataIndx: "areaNm1", hidden: true },
		{ title: '지역(시군구)', dataIndx: "areaNm2", hidden: true },
		{ title: '주소', dataIndx: "dtAddr", hidden: true },
		{ title: '상세주소', dataIndx: "dtAddr2", hidden: true },
		{ title: '위도', dataIndx: "longiNo", hidden: true },
		{ title: '경도', dataIndx: "latiNo", hidden: true },
		{ title: '차량규격', dataIndx: "carType", hidden: true },
		{ title: '적재물배상책임보험여부', dataIndx: "carLodInsrYn", hidden: true },
		{ title: '일사용금액', dataIndx: "cmPrice", hidden: true },
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
			fnDetailViewClear();

			var rowData = ui.rowData;
			var shUseYn = rowData.SH_USE_YN;
			common.setValToComp(rowData);

			var delBtnFlag = false;
			var $searchEdit = $(".search-edit");
			if (shUseYn === "S" || shUseYn === "A" || shUseYn === "R") {
				$searchEdit.find("select,input").prop("disabled", true);
				$("#cmCarResetBtn").hide();
				$("#adCarCardDelBtn").hide();
			} else {
				$searchEdit.find("select,input").prop("disabled", false);
				$("#carId,#userNm").prop("disabled",true);
				$("#cmCarResetBtn").show();
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

	var gridId = "cmCarPqgridDiv";//그리드 ID
	this.gridCmmn = new GridUtil(colModel, location.pathname, gridId, options);//그리드 초기화 - 파라미터 : Column정보, 프로그램명, 그리드ID, 그리드옵션
	this.gridCmmn.open();//그리드 생성
	$cmCarPqgrid = gridCmmn.getGrid();//그리드 객체
}

//입력된 값을 grid rowData에 저장
function fnSetDataForGrid() {
	var selectRow = $cmCarPqgrid.SelectRow().getSelection()[0];
	if (!selectRow) {
		return;
	}

	var rowData = selectRow.rowData;
	var shUseYn = rowData.shUseYn;
	if (shUseYn === "Y" || shUseYn === "S" || shUseYn === "R") {
		return;
	}

	//이미지와 input,select 값에 없는 항목 제외
	var removeDataIndxArr = ['SH_USE_YN_NM','SH_USE_YN','carId','carPhot','carPhot2','carPhot3','carCard'];
	var colModel = $cmCarPqgrid.getColModel();
	var setDataArr = colModel.filter((item) => {
		return removeDataIndxArr.includes(item.dataIndx) === false;
	});

	var newData = {};
	setDataArr.forEach((item) => {
		var dataIndx = item.dataIndx;
		newData[dataIndx] = $("#"+dataIndx).val();
	});
	$cmCarPqgrid.options.editable = true;//수정모드
	$cmCarPqgrid.updateRow({rowIndx: selectRow.rowIndx, newRow: newData});
	//조회 데이터 수정
	$cmCarPqgrid.options.editable = false;//수정모드 종료
}

// 그리드 행추가
function fnAddRow(){
	var addRowIdx = $cmCarPqgrid.pageData().length;

	$cmCarPqgrid.addRow(
		{ newRow: {'addRowIdx':addRowIdx}, rowIndx: addRowIdx}
	);

	if($cmCarPqgrid.SelectRow().getSelection()[0]){
		$cmCarPqgrid.setSelection( null );
	}
	$cmCarPqgrid.setSelection({rowIndx: addRowIdx});
	fnDetailViewClear();
}

// 그리드 행삭제
function fnDelRow(){
	var selectRow = $cmCarPqgrid.SelectRow().getSelection()[0];
	var rowData = selectRow.rowData;
	var shUseYn = rowData.SH_USE_YN;

	if (!selectRow) {
		alert("선택한 차량이 없습니다.");
		return;
	}else if(shUseYn === "S" || shUseYn === "A" || shUseYn === "R") {
		alert("해당 차량은 공유"+rowData.SH_USE_YN_NM+"으로 수정 및 삭제 할 수 없습니다.");
		return;
	}else if(!rowData["carId"]){
		if(confirm("작성한 내용이 삭제됩니다.\n삭제하시겠습니까?")){
			$cmCarPqgrid.deleteRow({rowIndx: selectRow.rowIndx});
			fnDetailViewClear();
		}
	}else{
		if(confirm("삭제하시겠습니까?")) {
			$cmCarPqgrid.deleteRow({rowIndx: selectRow.rowIndx});
			fnDetailViewClear();
			alert("행 삭제 후 저장 버튼을 클릭하세요");
		}
	}
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
	var selectRow = $cmCarPqgrid.SelectRow().getSelection()[0];
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
	var selectRow = $cmCarPqgrid.SelectRow().getSelection()[0];
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
			$carPhotLi.append($('<button/>', {id:carPhotArr[0], class:'btn-pic-delete'}).click((e) => fnRemoveImage(e)));
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
			$(".pic-car-card").show();
			$("#adCarCardFile").val("");
		}
	}
}

function fnRemoveImage(e){
	if(confirm("삭제하시겠습니까?")){
		var selectRow = $cmCarPqgrid.SelectRow().getSelection()[0];
		var targetEl = $("#"+e.target.id);
		if(selectRow.rowData.carId){
			alert("저장버튼을 눌러야 삭제됩니다.");
		}
		targetEl.parent().remove();
		if($(".bxslider > li").length === 0){
			$(".bxslider-div").hide();
		}
		fnSetImageForGrid(selectRow, null, e.target.id);
		bxSlider.reloadSlider();
	}
}

function fnSetImageForGrid(selectRow, imageURI, dataIndx){
	$cmCarPqgrid.options.editable = true;//수정모드
	var newRow = {};
	newRow[dataIndx] = imageURI;
	$cmCarPqgrid.updateRow({rowIndx: selectRow.rowIndx, newRow: newRow});
	//조회 데이터 수정
	$cmCarPqgrid.options.editable = false;//수정모드 종료
}

/*
 * 조회 : 차량 부가정보 조회
 */
function fnSearch(){
	var param = {
		'carFullNo' : $('#cmCarCarFullNo').val(),
		'cpCd' : $('#cmCarCarCpCd').val(),
		'useYn' : $('#cmCarUseYn').val(),
		'shUseYn' : $('#cmCarShUseYn').val()
	}

	//로딩바 SHOW
	$cmCarPqgrid.showLoading();
	//호출
	$.ajax({
		url: "/rs/car/getCarBasicInfoList",
		data:param,
		type:"POST",
		dataType:"json",
		success:function(data){
			fnDetailViewClear();
			$("#cmCarNav").click();
			// 변경된 부분: 그리드에 데이터 할당
			$cmCarPqgrid.option("dataModel.data", data.dataList);
			$cmCarPqgrid.refreshDataAndView();
		},
		error:function(e){
			$cmCarPqgrid.hideLoading();
		},
		complete:function(e){
			//로딩바 HIDE
			$cmCarPqgrid.hideLoading();
			//그리드 히스토리 초기화
			$cmCarPqgrid.History().reset();
		},
	});
}

/*
 * 저장
 */
function fnSaveCar() {
	fnSetDataForGrid();

	if (!$cmCarPqgrid.isDirty()) {
		alert("수정된 내용이 없습니다.");
		return;
	}

	var mustChkColList = [
		{column:"carNo",title:"차량번호"},
		{column:"carFullNo",title:"차량번호(FULL)"},
		{column:"brNo",title:"사업자등록번호"},
		{column:"carClsCd",title:"차량구분"},
		{column:"carTempCd",title:"온도구분"},
		{column:"carLodWgt",title:"적재중량"},
		{column:"dtAddr", title:"주소"},
		{column:"useYn",title:"사용여부"}
	];

	//검증
	var gridChanges = $cmCarPqgrid.getChanges({ format: 'byVal' });
	var addList = gridChanges.addList;
	var updateList = gridChanges.updateList;

	var msg = "";
	updateList.forEach(function (dataObj) {
		var validationMsg = "";
		mustChkColList.forEach(function (chkColObj) {
			var tmpCol = dataObj[chkColObj.column];
			if (!tmpCol && chkColObj.column) { // 수정된 부분: 상세주소는 예외로 처리
				validationMsg += "'차량 기본정보' 의 " + "'" + chkColObj.title + "'\r\n";
			}
		});
		if(validationMsg){
			msg += "["+dataObj["carFullNo"]+"]\n"+validationMsg+"\n";
		}
	});
	addList.forEach(function (dataObj) {
		var validationMsg = "";
		mustChkColList.forEach(function (chkColObj) {
			var tmpCol = dataObj[chkColObj.column];
			if (!tmpCol && chkColObj.column) { // 수정된 부분: 상세주소는 예외로 처리
				validationMsg += "'차량 기본정보' 의 " + "'" + chkColObj.title + "'\r\n";
			}
		});
		if(validationMsg){
			msg += "["+(dataObj["addRowIdx"]+1)+"] 번째 행 \n"+validationMsg+"\n";
		}
	});

	if(msg){
		alert(msg + "은(는) 필수 입력값입니다.");
		return;
	}

	if(confirm("저장하시겠습니까?")){
		var param = $cmCarPqgrid.getChanges({format: 'byVal'});

		$cmCarPqgrid.showLoading();
		$.ajax({
			url:"/rs/car/saveCarBasicInfo",
			type: "POST",
			data: JSON.stringify(param),
			contentType: 'application/json',
			dataType: 'json',
			success: function (result) {
				if(result.error){
					alert(result.error);
					return;
				}
				alert("저장 되었습니다.");
				fnSearch();
			},
			error: function (e) {
				alert(e);
			},
			complete: function (e) {
				// 로딩바 감춤
				$cmCarPqgrid.hideLoading();
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
	$(".addr").prop("disabled",true);
	$("#carId,#userNm").prop("disabled",true);
}

function fnResetGrid() {
	$cmCarPqgrid.option("dataModel.data", []);
	$cmCarPqgrid.refreshDataAndView();
}

function execPostcode() {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 각 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var addr = ''; // 주소 변수
			//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
				addr = data.roadAddress;
			} else { // 사용자가 지번 주소를 선택했을 경우(J)
				addr = data.jibunAddress;
			}

			var geocoder = new kakao.maps.services.Geocoder();

			var callback = function(result, status) {
				if (status === kakao.maps.services.Status.OK) {
					$("#longiNo").val(result[0].x);
					$("#latiNo").val(result[0].y);
				}
			};
			geocoder.addressSearch(data.roadAddress, callback);

			// 주소 정보를 해당 필드에 넣는다.
			$("#dtAddr").val(addr+'');
			$("#areaNm1").val(data.sido);
			$("#areaNm2").val(data.sigungu);
			$("#dtAddr2").focus();
		}
	}).open();
}