//中国地图
const chinaMapOpt = {
	title: {
		text: '中国',
		x: 'center',
		textStyle: {
			color: '#fff'
		}
	},
	legend: {
		data: ['PM2.5'], //与series的name属性对应
		orient: 'vertical',
		y: 'bottom',
		x: 'right',
		textStyle: {
			color: '#fff'
		}
	},
	tooltip: {
		trigger: 'item',
		formatter: function(params) {
			return params.name + ' : ' + params.value[2];
		}
	},
	geo: {
		map: 'china',
		roam: false, //开启鼠标缩放和漫游
		zoom: 1, //地图缩放级别
		selectedMode: false, //选中模式：single | multiple
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		layoutCenter: ['50%', '50%'], //设置后left/right/top/bottom等属性无效
		layoutSize: '100%',
		label: {
			emphasis: {
				show: false
			}
		},
		itemStyle: {
			normal: {
				areaColor: '#101f32',
				borderWidth: 1.1,
				borderColor: '#43d0d6'
			},
			emphasis: {
				areaColor: '#069'
			}
		}
	},
	series: []
};

function showChinaMap() {
	mainChart.setOption(chinaMapOpt);
	minChart.setOption(worldMapOpt);
	minChart.on('click', function(params) {

		console.log(params);
	});
}