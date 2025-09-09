
var help = {
	
	// event 영역
	fnEvent : function() {
		
		$("#btnHelp").on("click", function() {
			$("#modal-background").fadeIn(300);
			$("#pophelp").css("display", "flex").hide().fadeIn();
		    $("body").css("overflow", "hidden");
		});
		
		// 팝업 닫기 버튼
		$("[id^='btnPopClose']").on("click", function() {
			$(".manualpop").empty();
			help.fn_popClose();
		});
	},
	
	fn_popClose : function() {
		$("#modal-background").fadeOut();
		$("#pophelp").css("display", "flex").show().fadeOut();	
	}
}
	
	function share() {
		$(".manualpop").empty();
		let iframeHtml = '<iframe src="../com/share.html" id="fshare" width="950px" style="display:block; height: 750px"></iframe>';
		$(".manualpop").append(iframeHtml);
	}
	
	function trans() {		
		$(".manualpop").empty();
		let iframeHtml = '<iframe src="../com/trans.html" id="ftrans"  width="950px" style="display:block; height: 750px"></iframe>';
		$(".manualpop").append(iframeHtml);
	}
	
	function order() {		
		$(".manualpop").empty();
		let iframeHtml = '<iframe src="../com/order.html" id="forder" width="950px" style="display:block; height: 750px"></iframe>';
		$(".manualpop").append(iframeHtml);
	}
	
	
	function whouse() {		
		$(".manualpop").empty();
		let iframeHtml = '<iframe src="../com/whouse.html" id="fwhouse" width="950px" style="display:block; height: 750px"></iframe>';
		$(".manualpop").append(iframeHtml);
	}
	
	function oper() {		
		$(".manualpop").empty();
		let iframeHtml = '<iframe src="../com/oper.html" id="foper" width="950px" style="display:block; height: 750px"></iframe>';
		$(".manualpop").append(iframeHtml);
	}
		 
$(function () {
	help.fnEvent();
});