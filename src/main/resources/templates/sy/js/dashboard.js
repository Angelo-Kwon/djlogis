var dashboard = {
	gridObjs: { ship: null, news: null},
	map: null,
	ready: function() {	
		//dashboard.makeGrid();
		dashboard.makeMap();
		dashboard.makeLogisList();
		dashboard.makeShList();
		dashboard.makeSrList();
		$(".list-tab-menu").on("click", dashboard.tabChange);

		dashboard.loadChartData();
		
		// token Payload 값 취득
		var token = localStorage.getItem("token").replace("Bearer ", "");
		var base64Payload = token.split('.')[1]; 
		var payload = window.atob(base64Payload);		
		var jsonpayload = JSON.parse(payload);
		
		// 사용자유형에 따른 화면분기
		if (jsonpayload.user_type == 'RSS'){
			$('.area_inout').hide();
			$('.area_logis').hide();
			$('.area_rs').hide();
			$('.area_share').show();						
		} else if(jsonpayload.user_id == 'admin') {
			$('.area_inout').show();
			$('.area_logis').show();
			$('.area_rs').show();
			$('.area_share').show();
		} else {
			$('.area_inout').show();
			$('.area_logis').show();
			$('.area_rs').show();
			$('.area_share').hide();
		} 
		
		// 운송현황 클릭 시 
		$(document).on('click', '.logis-li', function(e) {
			var { info } = e.target.dataset;
			info = JSON.parse(info);
			if(!info.VHLOAT){
				dashboard.makeMap();
				return;
			}
			
			dashboard.moveMap(info);
		});
	},
	makeGrid: function() {
		var model = {
			ship: [
				{ title: "차량명", halign: "center", align: "left", dataType: "string", dataIndx: "VHCSNAM"},
				{ title: "차량번호", halign: "center", align: "left", dataType: "string", dataIndx: "PLNSTNM"},
				{ title: "", dataType: "string", dataIndx: "VHLOLAT", hidden: true }, // 위도
				{ title: "", dataType: "string", dataIndx: "VHLOLON", hidden: true }, // 경도
			]
		}

		var options = {
			width: '100%',
			height: '100%',
			editable: false
		};

		var gridList = ["ship"];
		for (var id of gridList) {
			dashboard.gridObjs[id] = new GridUtil(model[id], "dashboard/" + id, "dashboard_" + id + "_pqgrid", options);
			dashboard.gridObjs[id].open();
			dashboard.gridObjs[id].setCreate(dashboard.getGridData(id));
		}

		// 운송현황 그리드 클릭 이벤트
		dashboard.gridObjs.ship.getGrid().on("rowClick", function(event, ui) {
			if (!ui.rowData.VHLOLAT) {
				dashboard.makeMap();
				return;
			};
			dashboard.moveMap(ui.rowData);
		});
	},
	getGridData: function(id) {
		var grid = pq.grid("#dashboard_" + id + "_pqgrid");
		var url = "/sy/dashboard/grid/" + id;

		$.ajax({
			type: "GET",
			dataType: "json",
			url: url,
			success: function(data) {
				if (!data.error) {
					grid.option("dataModel.data", data.data);
					grid.refreshDataAndView();
				} else {
					console.log(data.error);
				}
			},
			error: function(e) {
				console.log(e)
			}
		});
	},
	getData: function(url) {
		var rt;
		$.ajax({
			type: "GET",
			dataType: "json",
			url: url,
			async: false,
			success: function(data) {
				if (!data.error) {
					if(data.data){
						rt = data.data;
					} else {
						rt = data.dataList;
					}
				} else {
					console.log(data.error);
				}
			},
			error: function(e) {
				console.log(e)
			}
		});
		return rt;
	},
	tabChange: function(e) {
		$(".list-tab-menu").removeClass("on");
		$(".list-tab-content").removeClass("active");

		$(e.target).addClass("on");
		$("#" + e.target.dataset.tab).addClass("active");

		dashboard.gridObjs[e.target.dataset.grid].getGrid().refresh();
	},
	makeLogisList: function() {
		var data = dashboard.getData("/sy/dashboard/grid/ship");
		if (data.length > 0) {
			$("#logis-list").empty();
			for (var i = 0; i < data.length; i++) {
				if(i < 6){
					$("#logis-list").append(`<li class='logis-li' data-info='`+ JSON.stringify(data[i]) + `' style='cursor: pointer;'> [` + data[i].PLNSTNM + `] ` + data[i].VHCSNAM + `</li>`);
				}
			}
		}
	},
	makeMap: function() {
		var mapContainer = document.getElementById('dashboard_ship_map');
		var mapOption = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			level: 5
		};
		dashboard.map = new kakao.maps.Map(mapContainer, mapOption);

		var data = dashboard.getData("/sy/dashboard/grid/ship");
		for (var i = 0; i < data.length; i++) {
			new kakao.maps.Marker({
				map: dashboard.map,
				position: new kakao.maps.LatLng(data[i].VHLOLAT, data[i].VHLOLON),
				title: data[i].VHCSNAM
			});
		}

		if (data.length > 0) {
			dashboard.moveMap(data[0]);
		}
	},
	moveMap: function(option) {
		if (option.VHLOLAT && option.VHLOLON) {
			dashboard.map.panTo(new kakao.maps.LatLng(option.VHLOLAT, option.VHLOLON));
		};
	},
	makeShList: function() {
		var data = dashboard.getData("/sy/dashboard/html/shList");
		if (data.length > 0) {
			$(".sign-list").empty();
			for (var i = 0; i < data.length; i++) {
				$(".sign-list").append("<li>" + data[i].LI_TEXT + "</li>");
			}
		}
	},
	makeSrList: function() {
		var data = dashboard.getData("/sy/dashboard/html/srList");
		if (data.length > 0) {
			$("#sr-list").empty();
			for (var i = 0; i < data.length; i++) {
				$("#sr-list").append("<li>" + data[i].LI_TEXT + "</li>");
			}
		}
	},
	
	convertBase64ToBlob: function(base64, mimeType) {
		var byteCharacters = atob(base64);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += 512) {
			var slice = byteCharacters.slice(offset, offset + 512);
			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			var byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		return new Blob(byteArrays, { type: mimeType });
	},
	setD_StockChart: function(data) {
		var doughnutCtx = $('#s_DStockChart').get(0).getContext('2d');
		var labels = [];
		var chartData = [];
		
		var doption ={
		  responsive: false,		
		   plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        pointStyle: 'circle',
                        usePointStyle: true,
                    }
                }
            }
		};

		for (var i = 0; i < data.data.length; i++) {
			labels.push(data.data[i].DOCTYNM);
			chartData.push(data.data[i].S_QTY);
		}

		new Chart(doughnutCtx, {
			type: 'doughnut',
			data: {
				labels: labels,
				datasets: [{
					data: chartData,
					backgroundColor: this.getColorsArray(data.data.length),
					borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
					borderWidth: 2
				}],				
			},
			options: doption
		});
	},
	setB_StockChart: function(data) {
		var barCtx = $('#s_BStockChart').get(0).getContext('2d');
		new Chart(barCtx, {
			type: 'bar',
			data: {
				labels: ['주문', '수량', 'SKU'],
				datasets: [{
					data: [data.data[0].T_ORDER, data.data[0].T_QTY, data.data[0].T_SKU],
					backgroundColor: ['#FFCD56', '#FF6384', '#36A2EB'],
					borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
					borderWidth: 1
				}]
			},
			options: {
				indexAxis: 'y',
				responsive: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						callbacks: {
							label: function(context) {
								var label = context.chart.data.labels[context.dataIndex];
								var total = context.dataset.data[context.dataIndex];
								var completed;
								switch (label) {
									case '주문':
										completed = data.data[0].C_ORDER;
										break;
									case '수량':
										completed = data.data[0].C_QTY;
										break;
									case 'SKU':
										completed = data.data[0].C_SKU;
										break;
									default:
										completed = 0;
								}
								return label + ': ' + completed + '/' + total;
							}
						}
					}
				}
			}
		});
	},
	setD_DeliveryChart: function(data) {
		var doughnutCtx = $('#s_DDeliveryChart').get(0).getContext('2d');

		var labels = [];
		var chartData = [];
		var doption ={
		  responsive: false,		
		   plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        pointStyle: 'circle',
                        usePointStyle: true,
                    }
                }
            }
		};

		for (var i = 0; i < data.data.length; i++) {
			labels.push(data.data[i].DOCTYNM);
			chartData.push(data.data[i].DEL_QTY);
		}

		new Chart(doughnutCtx, {
			type: 'doughnut',
			data: {
				labels: labels,
				datasets: [{
					data: chartData,
					backgroundColor: this.getColorsArray(data.data.length),
					borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
					borderWidth: 2
				}]
			},
			options: doption
		});
	},
	setB_DeliveryChart: function(data) {
		var barCtx = $('#s_BDeliveryChart').get(0).getContext('2d');
		new Chart(barCtx, {
			type: 'bar',
			data: {
				labels: ['주문', '수량', 'SKU'],
				datasets: [{
					data: [data.data[0].T_ORDER, data.data[0].T_QTY, data.data[0].T_SKU],
					backgroundColor: ['#FFCD56', '#FF6384', '#36A2EB'],
					borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
					borderWidth: 1
				}]
			},
			options: {
				indexAxis: 'y',
				responsive: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						callbacks: {
							label: function(context) {
								var label = context.chart.data.labels[context.dataIndex];
								var total = context.dataset.data[context.dataIndex];
								var completed;
								switch (label) {
									case '주문':
										completed = data.data[0].C_ORDER;
										break;
									case '수량':
										completed = data.data[0].C_QTY;
										break;
									case 'SKU':
										completed = data.data[0].C_SKU;
										break;
									default:
										completed = 0;
								}
								return label + ': ' + completed + '/' + total;
							}
						}
					}
				}
			}
		});
	},

	setD_WorkerChart: function(data) {
		var doughnutCtx = $('#s_DWorkerChart').get(0).getContext('2d');
		var chartData = [];		
		new Chart(doughnutCtx, {
			type: 'doughnut',
			data: {
				labels: ['작업완료'],
				datasets: [{
					data: [data.data[0].COM_WORKER, data.data[0].RESULT_CNT],
					backgroundColor: ['#36A2EB', 'gray'],
					borderColor: ['#36A2EB', 'transparent'],
					borderWidth: 2
				}]
			},
			options: {
				cutoutPercentage: 80,
				responsive: false,
				plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        pointStyle: 'circle',
                        usePointStyle: true,
                    }
                }
            },
				tooltips: {
					enabled: false
				}
			}
		});
	},
	setB_WorkerChart: function(data) {

		var barCtx = $('#s_BWorkerChart').get(0).getContext('2d');
		new Chart(barCtx, {
			type: 'bar',
			data: {
				labels: ['지게차현황', '출고작업자', '입고작업자'],
				datasets: [{
					data: [data.data[0].LIFT_CNT, data.data[0].MAN_OUT_CNT, data.data[0].MAN_IN_CNT],
					backgroundColor: ['#FFCD56', '#FF6384', '#36A2EB'],
					borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
					borderWidth: 1
				}]
			},
			options: {
				indexAxis: 'y',
				responsive: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						callbacks: {
							label: function(context) {
								var label = context.chart.data.labels[context.dataIndex];
								var total = context.dataset.data[context.dataIndex];
								var completed;
								switch (label) {
									case '지게차현황':
										completed = data.data[0].LIFT_CNT_COM;
										break;
									case '출고작업자':
										completed = data.data[0].MAN_OUT_CNT_COM;
										break;
									case '입고작업자':
										completed = data.data[0].MAN_IN_CNT_COM;
										break;
									default:
										completed = 0;
								}
								return label + ': ' + completed + '/' + total;
							}
						}
					}
				}
			}
		});
	},

	loadChartData: function() {
		var compkey = $("#compkey").val();

		//입고차트[막대]
		$.ajax({
			url: '/sy/dashboard/chart/stockBar',
			method: 'GET',
			data: {
				compkey: compkey
			},
			dataType: 'json',
			success: function(data) {
				dashboard.setB_StockChart(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error('AJAX 요청 실패:', textStatus, errorThrown);
			}
		});
		//입고차트[도넛]
		$.ajax({
			url: '/sy/dashboard/chart/stockDou',
			method: 'GET',
			data: {
				compkey: compkey
			},
			dataType: 'json',
			success: function(data) {
				dashboard.setD_StockChart(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error('AJAX 요청 실패:', textStatus, errorThrown);
			}
		});

		//출고차트[막대]
		$.ajax({
			url: '/sy/dashboard/chart/deliveryBar',
			method: 'GET',
			data: {
				compkey: compkey
			},
			dataType: 'json',
			success: function(data) {
				dashboard.setB_DeliveryChart(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error('AJAX 요청 실패:', textStatus, errorThrown);
			}
		});

		//출고차트[도넛]
		$.ajax({
			url: '/sy/dashboard/chart/deliveryDou', // 서버의 데이터 엔드포인트 URL
			method: 'GET',
			data: {
				compkey: compkey
			},
			dataType: 'json',
			success: function(data) {
				dashboard.setD_DeliveryChart(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error('AJAX 요청 실패:', textStatus, errorThrown);
			}
		});

		//작업자차트[도넛]
		$.ajax({
			url: '/sy/dashboard/chart/selectWorkerDou', // 서버의 데이터 엔드포인트 URL
			method: 'GET',
			data: {
				compkey: compkey
			},
			dataType: 'json',
			success: function(data) {
				dashboard.setD_WorkerChart(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error('AJAX 요청 실패:', textStatus, errorThrown);
			}
		});
		//작업자차트[막대]
		$.ajax({
			url: '/sy/dashboard/chart/selectWorkerBar', // 서버의 데이터 엔드포인트 URL
			method: 'GET',
			data: {
				compkey: compkey
			},
			dataType: 'json',
			success: function(data) {
				dashboard.setB_WorkerChart(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error('AJAX 요청 실패:', textStatus, errorThrown);
			}
		});
	},
	generateRandomColor: function() {
		// 16진수로 된 색상 코드 생성
		var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
		return randomColor;
	},
	getColorsArray: function(length) {
		var colors = [];
		for (var i = 0; i < length; i++) {
			colors.push(this.generateRandomColor());
		}
		return colors;
	}
}

$(document).ready(dashboard.ready);