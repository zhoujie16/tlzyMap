var chinaData = [];
//国家数据
var worldData = []
//著名首都坐标
var worldCityData = []
var mapName = '';
var areaData = [];
var cityData = [];
var pieData = [];
var mainChart = echarts.init(document.getElementById('main-map'));
http.getChinaData(function(data) {
	chinaData = data.sort(sortVal);
	http.getWorldCountryData(function(data) {
		worldData = data.sort(sortVal);
		http.getWorldCapitalData(function(data) {
			worldCityData = data.sort(sortVal);
			showWorldMap()
		})
	});
})

function showWorldMap() {
	mapName = 'world';
	areaData = worldData;
	cityData = worldCityData;
	pieData = getWorldPie();
	mainChart.setOption(getMapOption());
	mainChart.on('click', function(d) {
		console.log('mainChart click', d)
		//				alert( (d.event.target.path._x0).toFixed(2) + ',' +  (d.event.target.path._y0).toFixed(2))
		if(d.name == 'China') {
			showChinaMap()
			return;
		}
		if(isHaveMap(d.name)) {
			showProvince({
				name: d.name,
				areaData: dataTool.getCityByCapital(d.name).sort(sortVal),
				cityData: dataTool.getCityByCapital(d.name).sort(sortVal),
			})
		}
	});
}

function showChinaMap() {
	mapName = 'china';
	areaData = dataTool.getChinaCountryData();
	cityData = dataTool.getChinaProvincialCapitalData();
	pieData = getChinaPie();
	mainChart.setOption(getMapOption());
}

function showProvince(d) {
	mapName = d.name;
	areaData = d.areaData;
	cityData = d.cityData;
	pieData = getProvincePie(d.areaData);
	mainChart.setOption(getMapOption());
}

//获取绘制地图的数据
function getMapOption() {
	return {
		//标题组件
		title: {
			text: '中国地区校友分布',
			top: 20,
			left: 'center',
			textStyle: {
				color: '#fff'
			}
		},
		//提示框组件
		tooltip: {

		},
		//地理坐标系组件
		geo: {
			map: mapName,
			left: '5%',
			right: '25%',
			top: '10%',
			//					bottom:'10%',
			layoutCenter: ['38%', '50%'],
			layoutSize: '100%',
			//					nameMap:nameMap,
			label: {
				normal: {
					show: false
				},
				emphasis: {
					show: false
				}
			},
			itemStyle: {
				emphasis: {
					areaColor: '#66CC66'
				}
			},
			regions: [{
				name: '南海诸岛',
				value: 0,
				itemStyle: {
					normal: {
						opacity: 0,
						label: {
							show: false
						}
					}
				}
			}],
		},
		grid: {
			right: 40,
			bottom: '10%',
			width: '15%',
			height: '300px'
		},
		xAxis: [{
			gridIndex: 0,
			axisTick: {
				show: false
			},
			axisLabel: {
				show: false
			},
			splitLine: {
				show: false
			},
			axisLine: {
				show: false
			}
		}],
		yAxis: [{
			gridIndex: 0,
			interval: 0,
			axisTick: {
				show: false
			},
			axisLabel: {
				show: true
			},
			splitLine: {
				show: false
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: "#6173a3"
				}
			},
			data: function() {
				//
				var arr = [];
				areaData.forEach(function(d, i) {
					if(i < 6) {
						arr.push(nameMap[d.name] || d.name)
					}
				});
				return arr.reverse();
			}(),
		}],
		visualMap: {
			type: 'continuous',
			text: ['', ''],
			showLabel: true,
			seriesIndex: [0],
			min: 0,
			max: 100,
			inRange: {
				color: ['#edfbfb', '#b7d6f3', '#40a9ed', '#3598c1', '#215096', ]
			},
			textStyle: {
				color: '#000'
			},
			bottom: 30,
			left: 'left',
		},
		series: [{
				name: 'mapSer', //鼠标移动到省份上面  显示的提示信息
				type: 'map',
				geoIndex: 0,
				label: {
					show: false,
				},
				tooltip: {
					formatter: function(d) {
						console.log('tooltip map', d)
						return(nameMap[d.name] || d.name) + '：' + d.data.value || '0' + '人'
					},
					textStyle: {

					}
				},

				data: areaData
			},
			//省会城市 地图 数据
			{
				name: 'provincialCapital',
				type: 'effectScatter',
				coordinateSystem: 'geo',
				data: function() {
					var arr = [];
					cityData.forEach(function(item, i) {
						arr.push({
							name: item.name,
							value: [item.coor[0], item.coor[1], item.value]
						})
					});
					console.log(arr)
					return arr;
				}(),
				symbolSize: function(val) {
					console.log('symbolSize', val)
					return 8;
					return Math.max(val[2] / 10, 8);
				},
				showEffectOn: 'emphasis',
				rippleEffect: {
					brushType: 'stroke'
				},
				hoverAnimation: true,
				tooltip: {
					show: true,
					formatter: function(d) {
						console.log('provincialCapital tooltip', d)
						return d.name + '：' + d.data.value[2] + '人'
					},
				},
				label: {
					normal: {
						formatter: '{b}',
						position: 'right',
						show: true
					}
				},
				itemStyle: {
					normal: {
						color: '#FF9900',
						shadowBlur: 10,
						shadowColor: '#333'
					}
				},
				zlevel: 1
			},
			//柱形图数据
			{
				name: 'barSer',
				type: 'bar',
				visualMap: false,
				barMaxWidth: 50,
				itemStyle: {
					normal: {
						color: '#40a9ed'
					},
					emphasis: {
						color: "#3596c0"
					}
				},
				tooltip: {
					formatter: function(d) {
						console.log('tooltip', d)
						return d.name + '：' + d.data['value'] + '人'
					},
					textStyle: {

					}
				},
				data: function() {
					var arr = [];
					areaData.forEach(function(item, i) {
						if(i < 6) {
							arr.push(item)
						}
					});
					return arr.reverse();
				}(),
			},
			//饼图
			{
				name: '校友分布占比',
				type: 'pie',
				radius: '20%',
				center: ['90%', '26%'],
				color: ['#86c9f4', '#4da8ec', '#3a91d2', '#005fa6', '#315f97'],
				labelLine: {
					normal: {
						show: false
					}
				},
				data: pieData,
				itemStyle: {
					normal: {
						label: {
							show: true,
							formatter: '{b} \n ({d}%)',
							textStyle: {
								color: '#B1B9D3'
							}
						}
					},
				},
			}
		]
	}
}