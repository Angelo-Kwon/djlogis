var shUseReqMap;
var datailViewMap;
var detailViewMarker;
var shUseReqClusterer;
var shUseReqMarkerArr = [];
var bxSlider;
$(function(){
	$(".use-req-search-form").hide();
	$(".use-req-whouse").show();


	bxSlider = $('.bxslider').bxSlider({
		speed: 500,
		pager: true,
		captions: true,
		mode: 'fade',
	});

	common.setCommCode($("#whKnCd"), "CARTEMPCD", null, 2);//공통코드 세팅

	common.setCommCode($("#carClsCd"), "VHCOPTY", null, 2);//공통코드 세팅
	common.setCommCode($("#carOprCd"), "DLVTYPE", null, 2);//공통코드 세팅
	common.setCommCode($("#carModCd"), "VHCTYPE", null, 2);//공통코드 세팅
	common.setCommCode($("#carTempCd"), "SKUGR01", null, 2);//공통코드 세팅

	// common.setCommCode($("#equipCd"), "EQUIP_CD", null, 3);//공통코드 세팅
	// -- 지게차 --//
	common.setCommCode($("#fkliftCd"), "FKLIFT_CD", null, 2);//공통코드 세팅
	common.setCommCode($("#fkliftMst"), "FKLIFT_MST", null, 2);//공통코드 세팅
	// -- 파렛트 --//
	common.setCommCode($("#pltCd"), "PLT_CD", null, 2);//공통코드 세팅
	common.setCommCode($("#pltTypCd"), "PLT_TYP_CD", null, 2);//공통코드 세팅
	// -- 대차 --//
	common.setCommCode($("#kartCd"), "KART_CD", null, 2);//공통코드 세팅
	common.setCommCode($("#kartTyp"), "KART_TYP", null, 2);//공통코드 세팅

	common.setCommCode($("#shPrdCls"), "SH_PRD_CLS", null, 2);//공통코드 세팅

	common.setNumOnly("minShSuq,maxShSuq,minFkliftWgt,maxFkliftWgt,minKartShQty," +
		"maxKartShQty,minPltShQty,maxPltShQty,minShPrd,maxShPrd,minShPrc,maxShPrc");//숫자만

	fnEvent();

	fnInitMap();
});

function fnEvent(){
	$(".use-req-search-type").click(function() {
		$(".legend_list li a").addClass("off");
		$(".use-req-search-type").removeClass("legend-type-selected");
		$(this).addClass("legend-type-selected");
		$(this).find("a").removeClass("off");

		//filter 공통검색조건 초기화
		$('.search-filter-common').find("input").val("");
		$(".search-filter-common").find("select").prop("selectedIndex",0);

		fnChangeSearchFilter($(this));
		fnSearchMap();
	});

	$(".map_filter input, #shUseReqAreaNm").keydown(function(e) {
		if (e.keyCode === 13) {
			fnSearchMap(); // 이 부분을 추가하여 Enter 키가 눌리면 조회 버튼을 클릭하도록 함
		}
	});

	$(".map-search-close").click(() => {
		$("#shUseReqMapFilterDiv").hide();
	});

	$("#shUseReqSearchFilterBtn").click(() =>{
		$("#shUseReqMapFilterDiv").show();
	});

	$("#shUseReqMapListOpenBtn").click(() =>{
		$("#shUseReqMapList").show();
	});

	$("#shUseReqMapListCloseBtn").click(() =>{
		$("#shUseReqMapList").hide();
	});

	$("#shUseReqFilterBtn, #shUseReqSearchBtn").click(function(){
		fnSearchMap();
	});

	$("#filterResetBtn").click(() =>{
		$('.area-list-div').find("input").val("");
		$(".area-list-div").find("select").prop("selectedIndex",0);
	});

	$("#deatilShBoardBtn").click(function(){
		var shUseObj = $(this).data("shUseObj");

		var param = {
			shNo: shUseObj.SH_NO,
			supId: shUseObj.SH_USER_ID,
			matCd: shUseObj.MAT_CD
		}

		var shUseReqNm = shUseObj.SH_USE_REQ_NM;
		switch (shUseObj.MAT_CD){
			case "W":
				param.whNm = shUseReqNm;
			case "C":
				param.carFullNo = shUseReqNm;
			case "E":
				param.equipNm = shUseReqNm;
		}

		window.name = JSON.stringify(param);
		document.getElementById('MN00000059').click();
	});

	$("#deatilShUseApplyBtn").click(function(){
		fnShUseReqApply($(this).data("shUseObj"));
	});
}

function fnChangeSearchFilter($this){
	$(".use-req-search-form").hide();
	if($this.hasClass("use-req-search-whouse")){
		$(".use-req-whouse").show();
	}else if($this.hasClass("use-req-search-car")){
		$(".use-req-car").show();
	}else if($this.hasClass("use-req-search-f")){
		$(".use-req-equip-k").hide();
		$(".use-req-equip-p").hide();
		$(".use-req-equip-f").show();
	}else if($this.hasClass("use-req-search-k")){
		$(".use-req-equip-f").hide();
		$(".use-req-equip-p").hide();
		$(".use-req-equip-k").show();
	}else if($this.hasClass("use-req-search-p")){
		$(".use-req-equip-f").hide();
		$(".use-req-equip-k").hide();
		$(".use-req-equip-p").show();
	}
}

function fnInitMap(){
	var mapContainer = document.getElementById('shUseReqMap'), // 지도를 표시할 div
		mapOption = {
			center: new kakao.maps.LatLng(35.1600994105234, 126.851461925213), // 지도의 중심좌표
			level: 10 // 지도의 확대 레벨
		};

	// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
	shUseReqMap = new kakao.maps.Map(mapContainer, mapOption);

	//지도 드래그 종료 이벤트
	kakao.maps.event.addListener(shUseReqMap, 'dragend', function() {
		fnResetShUseList();
	});

	//지도 확대,축소 이벤트
	kakao.maps.event.addListener(shUseReqMap, 'zoom_changed', function() {
		fnResetShUseList();
	});

	shUseReqClusterer = new kakao.maps.MarkerClusterer({
		map: shUseReqMap, // 마커들을 클러스터로 관리하고 표시할 지도 객체
		averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
		minLevel: 7 // 클러스터 할 최소 지도 레벨
	});

	fnSearchMap();
}

function fnSearchMap(){
	var legendType = $(".legend_list").find(".legend-type-selected");
	var url = '';
	var param = {
		'shPrdCls': $("#shPrdCls").val(),
		'minShPrd': $("#minShPrd").val(),
		'maxShPrd': $("#maxShPrd").val(),
		'minShPrc': $("#minShPrc").val(),
		'maxShPrc': $("#maxShPrc").val()
	};

	if(legendType.hasClass("use-req-search-whouse")){
		url = '/rs/shareUse/getWhouseList';
		var whouseParam = {
			'whNm': $("#whNm").val(),
			'whKnCd': $("#whKnCd").val(),
			'minShSqu': $("#minShSqu").val(),
			'maxShSqu': $("#maxShSqu").val()
		}
		param = Object.assign(param, whouseParam);
	}else if(legendType.hasClass("use-req-search-car")){
		url = '/rs/shareUse/getCarList';
		var carParam = {
			'carClsCd': $("#carClsCd").val(),
			'carOprCd': $("#carOprCd").val(),
			'carModCd': $("#carModCd").val(),
			'carTempCd': $("#carTempCd").val(),
			'minCarLodWgt': $("#minCarLodWgt").val(),
			'maxCarLodWgt': $("#maxCarLodWgt").val()
		}
		param = Object.assign(param, carParam);
	}else{
		var equipCd;
		if(legendType.hasClass("use-req-search-f")){
			equipCd = "F";
		}else if(legendType.hasClass("use-req-search-k")){
			equipCd = "K";
		}else if(legendType.hasClass("use-req-search-p")){
			equipCd = "P";
		}
		url = '/rs/shareUse/getEquipList';
		var equipParam = {
			'equipCd': equipCd,
			'equipNm': $("#equipNm").val(),
			'fkliftCd': $("#fkliftCd").val(),
			'fkliftMst': $("#fkliftMst").val(),
			'minFkliftWgt': $("#minFkliftWgt").val(),
			'maxFkliftWgt': $("#maxFkliftWgt").val(),
			'kartCd': $("#kartCd").val(),
			'kartTyp': $("#kartTyp").val(),
			'minKartShQty': $("#minKartShQty").val(),
			'maxKartShQty': $("#maxKartShQty").val(),
			'pltCd': $("#pltCd").val(),
			'pltTypCd': $("#pltTypCd").val(),
			'minPltShQty': $("#minPltShQty").val(),
			'maxPltShQty': $("#maxPltShQty").val(),
		}
		param = Object.assign(param, equipParam);
	}

	$.ajax({
		url:url,
		data:param,
		type: "POST",
		dataType: "json",
		success:function(result){
			fnSetMarker(result.dataList);
		}
	});
}

function fnSetMarker(data){
	if(shUseReqMarkerArr.length > 0){
		shUseReqMarkerArr.forEach((obj)=> {
			obj.marker.setMap(null);
		});
	}
	shUseReqMarkerArr = [];
	shUseReqClusterer.clear();

	var markerArr = [];

	data.forEach((obj) => {
		var imageSize = new kakao.maps.Size(38, 46);
		var imageSrc = "../../assets/ds/pin00.png";

		// 마커 이미지를 생성합니다
		var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

		// 마커를 생성합니다
		var marker = new kakao.maps.Marker({
			map: shUseReqMap, // 마커를 표시할 지도
			position: new kakao.maps.LatLng(obj.LATI_NO, obj.LONGI_NO), // 마커를 표시할 위치
			clickable: true,
			title : obj.SH_USE_REQ_NM, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
			size: imageSize
			// image : markerImage // 마커 이미지

		});
		var shUseJson = {
			shUseObj : obj,
			marker : marker
		};
		kakao.maps.event.addListener(marker, 'click', function() {
			// 마커 위에 인포윈도우를 표시합니다
			// infowindow.open(map, marker);
			// shUseJson;
			fnDetailView(shUseJson);
		});

		markerArr.push(marker);
		shUseReqMarkerArr.push(shUseJson);
	});

	fnMapList(shUseReqMarkerArr);
	shUseReqMap.setLevel(10);
	shUseReqMap.setCenter(new kakao.maps.LatLng(35.1600994105234, 126.851461925213));
	shUseReqClusterer.addMarkers(markerArr);
}

function fnResetShUseList(){
	var bounds = shUseReqMap.getBounds(); // 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
	var sw = new kakao.maps.LatLng(bounds.pa, bounds.ha);
	var ne = new kakao.maps.LatLng(bounds.qa, bounds.oa);
	var lb = new kakao.maps.LatLngBounds(sw, ne);

	var mapListArr= [];
	shUseReqMarkerArr.forEach((obj, idx) => {
		var shUseObj = obj.shUseObj;
		var marker = obj.marker
		var objLatLng = new kakao.maps.LatLng(shUseObj.LATI_NO, shUseObj.LONGI_NO);

		if(lb.contain(objLatLng)){
			if(!marker.getMap){
				marker.setMap(shUseReqMap);
			}
			mapListArr.push(obj);
		}else{
			marker.setMap(null);
		}
	});

	fnMapList(mapListArr);
}

function fnMapList(mapListArr){
	var $imgList = $(".img_list");
	$imgList.empty();

	var mapListTitleTxt;

	mapListArr.forEach((obj, idx) => {
		var shUseObj = obj.shUseObj;
		var $imgViewLink = $('<a/>', {id:shUseObj.SH_USE_REQ_ID, class:'img_view_link'}).data('obj',obj);

		var imageSrc;
		var spanTxt;

		var shUseType = shUseObj.SH_USE_TYPE;
        var equipCd = shUseObj.EQUIP_CD;
		if(shUseType === "WHOUSE"){
			mapListTitleTxt = "추천 창고 목록 ";
			imageSrc = '../../assets/ds/house.svg';
			spanTxt = shUseObj.WH_KN_CD_NM;
		}else if(shUseType === "CAR"){
			mapListTitleTxt = "추천 차량 목록 ";
			imageSrc = '../../assets/ds/car-front-fill.svg';
			spanTxt = shUseObj.CAR_CLS_CD_NM;
		}else if(shUseType === "EQUIP"){
			imageSrc = '../../assets/ds/cart.svg';
            if(equipCd === "F") {
			    mapListTitleTxt = "추천 지게차 목록 ";
			    spanTxt = shUseObj.FKLIFT_CD_NM;
            }else if(equipCd === "K") {
			    mapListTitleTxt = "추천 카트 목록 ";
			    spanTxt = shUseObj.KART_CD_NM;
            }else if(equipCd === "P") {
			    mapListTitleTxt = "추천 파렛트 목록 ";
			    spanTxt = shUseObj.CAR_CLS_CD_NM;
            }
		}

		if(shUseObj.PHOTO){
			imageSrc = "data:image;base64," + shUseObj.PHOTO;
		}else if(shUseObj.PHOTO2){
			imageSrc = "data:image;base64," + shUseObj.PHOTO2;
		}else if(shUseObj.PHOTO3){
			imageSrc = "data:image;base64," + shUseObj.PHOTO3;
		}

		var $img = $('<p/>').append($('<img/>', {src:imageSrc}));
		$imgViewLink.append($img);
		var $textContDiv = $('<div/>', {class:'text_cont'});
		$textContDiv.append($('<strong>', {text:shUseObj.DT_ADDR}));
		var $span = $('<span/>').append($('<em/>', {text:spanTxt}));
		$textContDiv.append($span);

        var $p = $('<p/>');
        if(shUseObj.SH_PRC && shUseObj.SH_PRD_CLS_NM){
            var shPrc = shUseObj.SH_PRC.comma()+"원";
            $p = $('<p/>',{text:shUseObj.SH_PRD_CLS_NM+" "+shPrc});
        }

		$textContDiv.append($p);
		$imgViewLink.append($textContDiv);


		obj.shUseObj.imageSrc = imageSrc;
		$imgViewLink.click(function(){
			fnDetailView(obj);
		})
		var $li = $('<li/>');
		$li.append($imgViewLink);
		$imgList.append($li);
	});

	$shUseReqMapTitleDiv = $("#shUseReqMapTitleDiv");
	$shUseReqMapTitleDiv.empty();
	$shUseReqMapTitleDiv.text(mapListTitleTxt);
	$shUseReqMapTitleDiv.append($('<em>', {text:mapListArr.length + "개"}));
	$(".img_list_innre").scrollTop(0);
	$('.map_list').show();
	$('.map_list02').hide();
}

function fnDetailView(obj){
	var shUseObj = obj.shUseObj;
	var shUseType = shUseObj.SH_USE_TYPE;

	$(".bxslider").empty();

	if(shUseObj.PHOTO || shUseObj.PHOTO2 || shUseObj.PHOTO3){
		["PHOTO","PHOTO2","PHOTO3"].forEach((item) => {
			if(shUseObj[item]){
				var $imgLi = $('<li/>');
				$imgLi.append($('<img/>', {src:"data:image;base64,"+shUseObj[item], style: 'height:300px'}));
				$(".bxslider").append($imgLi);
			}
		});
	}else{
		var $imgLi = $('<li/>');
		$imgLi.append($('<img/>', {src:shUseObj.imageSrc}));
		$(".bxslider").append($imgLi);
	}
	bxSlider.reloadSlider();
	$("#detailTitleTxt").empty();
	var $mapListDetailPrevBtn = $('<a/>',{id:'mapListDetailPrevBtn',class:'pre_btn02',text:'이전으로'});
	$mapListDetailPrevBtn.click(() => {
		$('.map_list').show();
		$('.map_list02').hide();
	});
	$("#detailTitleTxt").append($mapListDetailPrevBtn);
	$("#detailTitleTxt").append(shUseObj.SH_USE_REQ_NM+" ("+shUseObj.SH_USE_YN_NM+")");

	$("#deatilShBoardBtn").data("shUseObj", shUseObj);
	$("#deatilShUseApplyBtn").data("shUseObj", shUseObj);
	// var detailHtml;
	if(shUseType === "WHOUSE"){
		var facilityTxt = fnMakeWhouseFacility(shUseObj);
		$("#detailWhouseWhKnCdNm").text(shUseObj.WH_KN_CD_NM);
		$("#detailWhouseLotArea").text(shUseObj.LOT_AREA.comma());
		$("#detailWhouseTlFlNum").text(shUseObj.TL_FL_NUM.comma());
		$("#detailWhouseChNm").text(shUseObj.CH_NM);
		$("#detailWhouseTelNo").text(shUseObj.TEL_NO.phoneNum());
		$("#detailWhouseMailAddr").text(shUseObj.MAIL_ADDR);

		$("#detailWhouseShRngCls").text(shUseObj.SH_RNG_CLS_NM);
		$("#detailWhouseShSqu").text(shUseObj.SH_SQU.comma());
		$("#detailWhouseShFlr").text(shUseObj.SH_FLR.comma());
		$("#detailWhouseShLtDt").text(shUseObj.SH_LT_DT);
		$("#detailWhouseCarEntCd").text(shUseObj.CAR_ENT_CD_NM);
		$("#detailWhouseFacility").text(facilityTxt);

		$(".view-wrap-car").hide();
		$(".view-wrap-equip").hide();
		$(".view-wrap-whouse").show();
	}else if(shUseType === "CAR"){
		$("#detailCarCpNm").text(shUseObj.CAR_CP_NM);
		$("#detailCarType").text(shUseObj.CAR_TYPE);
		$("#detailCarClsCdNm").text(shUseObj.CAR_CLS_CD_NM);
		$("#detailCarTempCdNm").text(shUseObj.CAR_TEMP_CD_NM);
		$("#detailCarTelNo").text(shUseObj.TEL_NO);

		$("#detailCarShClsNm").text(shUseObj.SH_PRD_CLS_NM);
		$("#detailCarShPrd").text(shUseObj.SH_PRD);
		$("#detailCarShLtDt").text(shUseObj.SH_LT_DT);

		var geraYn = shUseObj.GERA_YN==="Y"?"있음":"없음";
		var carTempYn = shUseObj.CAR_TEMP_YN==="Y"?"있음":"없음";
		$("#detailCarGeraYn").text(geraYn);
		$("#detailCarTempYn").text(carTempYn);

		$(".view-wrap-whouse").hide();
		$(".view-wrap-equip").hide();
		$(".view-wrap-car").show();
	}else if(shUseType === "EQUIP"){
		$(".view-wrap-equip").show();
        var equipCd = shUseObj.EQUIP_CD;
        if(equipCd === "F"){
			$("#detailEquipFkliftCdNm").text(shUseObj.FKLIFT_CD_NM);
			$("#detailEquipFkliftWgt").text(shUseObj.FKLIFT_WGT);
			$("#detailEquipFkliftMstNm").text(shUseObj.FKLIFT_MST_NM);
			$("#detailEquipFkliftHgt").text(shUseObj.FKLIFT_HGT);
			$("#detailEquipFkliftMakeYear").text(shUseObj.MAKE_YEAR);
			$("#detailEquipFkliftTelNo").text(shUseObj.TEL_NO);
			$("#detailEquipChgrYnNm").text(shUseObj.CHGR_YN_NM);
			$("#detailEquipDriverYnNm").text(shUseObj.DRIVER_YN_NM);

			$(".equip-k").hide();
			$(".equip-p").hide();
        }else if(equipCd === "K"){
			$("#detailEquipKartCpNm").text(shUseObj.KART_CD_NM);
			$("#detailEquipKartTypNm").text(shUseObj.KART_TYP_NM);
			$("#detailEquipKartWgt").text(shUseObj.KART_WGT);
			$("#detailEquipKartStd").text(shUseObj.KART_STD);
			$("#detailEquipKartMakeYear").text(shUseObj.MAKE_YEAR);
			$("#detailEquipKartTelNo").text(shUseObj.TEL_NO);
			$(".equip-f").hide();
			$(".equip-p").hide();
        }else if(equipCd === "P"){
			$("#detailEquipPltCdNm").text(shUseObj.PLT_CD_NM);
			$("#detailEquipPltTypNm").text(shUseObj.PLT_TYP_CD_NM);
			$("#detailEquipPltStdNm").text(shUseObj.PLT_STD_NM);
			$("#detailEquipPltWgt").text(shUseObj.PLT_WGT);
			$("#detailEquipPltMakeYear").text(shUseObj.MAKE_YEAR);
			$("#detailEquipPltTelNo").text(shUseObj.TEL_NO);

			$(".equip-f").hide();
			$(".equip-k").hide();
		}
		$("#detailEquipShPrdClsNm").text(shUseObj.SH_PRD_CLS_NM);
		$("#detailEquipShPrd").text(shUseObj.SH_PRD);
		$("#detailEquipShLtDt").text(shUseObj.SH_LT_DT);


		$(".view-wrap-whouse").hide();
		$(".view-wrap-car").hide();
	}
	$("#detailDtAddr").text(shUseObj.DT_ADDR);
	$("#detailDtAddr2").text(shUseObj.DT_ADDR2);

	fnRecommendShUse(shUseType);
	fnDetailViewMap(obj);

	$(".img_list_innre").scrollTop(0);
	$("#mapListDetail").show();
}

function fnDetailViewMap(obj){
	var shUseObj = obj.shUseObj;

	if(!shUseObj.LATI_NO || !shUseObj.LONGI_NO){
		$(".view-wrap-map").hide();
		return;
	}

	var position = new kakao.maps.LatLng(shUseObj.LATI_NO, shUseObj.LONGI_NO);

	if(!datailViewMap){
		var mapContainer = document.getElementById('datailViewMap'), // 지도를 표시할 div
			mapOption = {
				center: position, // 지도의 중심좌표
				level: 4 // 지도의 확대 레벨
			};

		// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
		datailViewMap = new kakao.maps.Map(mapContainer, mapOption);
	}

	datailViewMap.setLevel(4);
	setTimeout(function() {
		datailViewMap.relayout();
		datailViewMap.setCenter(position);
		// map.setLevel(2); 필요하면 레벨조정
	}, 100);

	var imageSize = new kakao.maps.Size(46, 54);
	// var imageSrc = "../../assets/ds/pin00.png";

	if(detailViewMarker){
		detailViewMarker.setMap(null);
	}

	// 마커를 생성합니다
	detailViewMarker = new kakao.maps.Marker({
		map: datailViewMap, // 마커를 표시할 지도
		position: position, // 마커를 표시할 위치
		clickable: true,
		size: imageSize,
	});
	$(".view-wrap-map").show();
}

function fnRecommendShUse(shUseType){
	$(".view-wrap-recommend").empty();

	var randomArray = shUseReqMarkerArr.sort(() => Math.random() - 0.5);
	var $ul = $('<ul/>');
	var recommedText = '';

	for(var i=0; i < randomArray.length; i++){
		var randomJson = randomArray[i];
		var shUseObj = randomJson.shUseObj;
		var recommendParam = {
			'imgId' : shUseObj.SH_USE_REQ_ID,
			'addrText' : shUseObj.DT_ADDR+" "+shUseObj.DT_ADDR2,
		}
		if(shUseType === "WHOUSE"){
			recommedText = '추천 창고';
			recommendParam.imageSrc = '../../assets/ds/house.svg';
			recommendParam.spanText = shUseObj.SH_SQU+"평";
			recommendParam.emText = shUseObj.WH_KN_CD_NM;
		}else if(shUseType === "CAR"){
			recommedText = '추천 차량';
			recommendParam.imageSrc = '../../assets/ds/car-front-fill.svg';
			recommendParam.spanText = shUseObj.CAR_CLS_CD_NM + "/" + shUseObj.CAR_TEMP_CD_NM;
			recommendParam.emText = shUseObj.CAR_TYPE;
		}else if(shUseType === "EQUIP"){
			var equipCd = shUseObj.EQUIP_CD;
			recommendParam.imageSrc = '../../assets/ds/cart.svg';
			recommendParam.spanText = "";
			if(equipCd === "F"){
				recommedText = '추천 기자재';
				recommendParam.emText = shUseObj.FKLIFT_CD_NM;
			}else if(equipCd === "K"){
				recommedText = '추천 카트';
				recommendParam.emText = shUseObj.KART_CD_NM;
			}else if(equipCd === "P"){
				recommedText = '추천 파렛트';
				recommendParam.emText = shUseObj.PLT_CD_NM;
			}
		}

		recommendParam = Object.assign(recommendParam, randomJson);
		$ul.append(fnMakeRecommedItem(recommendParam));

		if(i === 4){
			break;
		}
	}
	$(".view-wrap-recommend").append($('<h3/>', {text:recommedText}));
	$(".view-wrap-recommend").append($('<div/>', {class:'img_list_w'}).append($ul));
}

function fnMakeRecommedItem(obj){
	var $li = $('<li/>');
	var $imgViewLink = $('<a/>', {class:'img_view_link', id:obj.imgId}).data('shUseObj',obj);
	$imgViewLink.click(function() {
		fnDetailView($(this).data("shUseObj"));
	});

	var imageSrc = obj.imageSrc;
	if(obj.shUseObj.PHOTO){
		imageSrc = "data:image;base64," + obj.shUseObj.PHOTO;
	}
	var $img = $('<img/>', {src:imageSrc});
	$imgViewLink.append($('<p/>').append($img));

	var $textContDiv = $('<div/>', {class:'text_cont'});
	var $addrStrong = $('<strong/>', {text:obj.addrText});
	$textContDiv.append($addrStrong);

	var $span = $('<span/>', {text:obj.spanText});
	var $em = $('<em/>', {text:obj.emText});
	$span.append($em);
	$textContDiv.append($span);

	$imgViewLink.append($textContDiv);
	$li.append($imgViewLink);
	return $li;
}

function fnShUseReqApply(shUseObj){
	var param = DsUtil.getCamelData(shUseObj);

	if(param.shUseYn !== "R"){
		alert("공유 등록 상태인 것만 사용신청 할 수 있습니다.");
		return;
	}

	if(confirm("신청하시겠습니까?")){
		$.ajax({
			url:'/rs/apvMatch/saveShUseApply',
			type: 'POST',
			data: JSON.stringify(param),
			contentType: 'application/json',
			dataType: 'json',
			success:function(result){
				alert("신청되었습니다.");
				fnSearchMap();
			}
		});
	}
}

function fnMakeWhouseFacility(shUseObj){
	var facilityJson = {
		'FARM_YN' : '농산물' ,
		'FISH_YN' : '수산물',
		'MEAT_YN' : '축산물',
		'FOOD_YN' : '음식료품',
		'FASHION_YN' : '의류',
		'MACH_YN' : '기계',
		'MEDI_YN' : '의료용품',
		'FURN_YN' : '가구목재',
		'ELEC_YN' : '전자제품',
		'METAL_YN' : '금속가공',
		'ETC_YN' : '기타',
		'ISO_YN' : 'ISO인증',
		'AEO_YN' : 'AEO인증',
		'KGSP_YN' : 'KGSP인증',
		'TAPA_YN' : 'TAPA인증',
		'LOGI_YN' : '종합물류기업인증',
		'DOCK_YN' : '도크',
		'CANOPY_YN' : '캐노피',
		'CARGO_YN' : '화물승강기',
		'PLAT_YN' : '파렛트랙',
		'AUTO_YN' : '자동화창고',
		'RACK_YN' : '선반랙',
		'VERTICAL_YN' : '수직반송기'
	};

	var facilityTxt = "";
	var facilityCnt = 0;
	Object.keys(facilityJson).forEach((key) => {
		//key => key , value => facilityJson[key]
		if(shUseObj[key] === "Y") {
			facilityTxt += facilityJson[key]+",";
			facilityCnt++;
		}
	});
	if(facilityCnt > 0){
		facilityTxt = facilityTxt.slice(0,-1);
	}

	return facilityTxt;
}