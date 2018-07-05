(function() {
	//数据纯属虚构
	var data = [{
			name: '北京',
			value: 53
		},
		{
			name: '天津',
			value: 38
		},
		{
			name: '上海',
			value: 46
		},
		{
			name: '重庆',
			value: 36
		},
		{
			name: '河北',
			value: 34
		},
		{
			name: '河南',
			value: 32
		},
		{
			name: '云南',
			value: 16
		},
		{
			name: '辽宁',
			value: 43
		},
		{
			name: '黑龙江',
			value: 41
		},
		{
			name: '湖南',
			value: 24
		},
		{
			name: '安徽',
			value: 33
		},
		{
			name: '山东',
			value: 30
		},
		{
			name: '新疆',
			value: 1
		},
		{
			name: '江苏',
			value: 39
		},
		{
			name: '浙江',
			value: 35
		},
		{
			name: '江西',
			value: 20
		},
		{
			name: '湖北',
			value: 21
		},
		{
			name: '广西',
			value: 30
		},
		{
			name: '甘肃',
			value: 12
		},
		{
			name: '山西',
			value: 32
		},
		{
			name: '内蒙古',
			value: 35
		},
		{
			name: '陕西',
			value: 25
		},
		{
			name: '吉林',
			value: 45
		},
		{
			name: '福建',
			value: 28
		},
		{
			name: '贵州',
			value: 18
		},
		{
			name: '广东',
			value: 37
		},
		{
			name: '青海',
			value: 06
		},
		{
			name: '西藏',
			value: 04
		},
		{
			name: '四川',
			value: 33
		},
		{
			name: '宁夏',
			value: 08
		},
		{
			name: '海南',
			value: 19
		},
		{
			name: '台湾',
			value: 01
		},
		{
			name: '香港',
			value: 01
		},
		{
			name: '澳门',
			value: 01
		}
	];

	var yData = [];

	data.sort(function(o1, o2) {
		if(isNaN(o1.value) || o1.value == null) return -1;
		if(isNaN(o2.value) || o2.value == null) return 1;
		return o1.value - o2.value;
	});

	for(var i = 0; i < data.length; i++) {
		yData.push(data[i].name);
	}
	chinaOpt = {
		title: {
			text: '中国地区校友分布',
			top:20,
			left: 'center',
			textStyle: {
				color: '#fff'
			}
		},
		tooltip: {
			show: true,
			formatter: function(params) {
				return params.name + '：' + params.data['value'] + '人'
			},
		},
		visualMap: {
			type: 'continuous',
			text: ['', ''],
			showLabel: true,
			seriesIndex: [0],
			min: 0,
			max: 7,
			inRange: {
				color: ['#edfbfb', '#b7d6f3', '#40a9ed', '#3598c1', '#215096', ]
			},
			textStyle: {
				color: '#000'
			},
			bottom: 30,
			left: 'left',
		},
		grid: {
			right: 40,
			top: 100,
			bottom: 40,
			width: '15%'
		},
		xAxis: {
			type: 'value',
			scale: true,
			position: 'top',
			splitNumber: 1,
			boundaryGap: false,
			splitLine: {
				show: false
			},
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				margin: 2,
				textStyle: {
					color: '#aaa'
				}
			}
		},
		yAxis: {
			type: 'category',
			nameGap: 16,
			axisLine: {
				show: false,
				lineStyle: {
					color: '#ddd'
				}
			},
			axisTick: {
				show: false,
				lineStyle: {
					color: '#ddd'
				}
			},
			axisLabel: {
				interval: 0,
				textStyle: {
					color: '#999'
				}
			},
			data: yData
		},
		geo: { 
			map: 'china',
			left: '10%',
			right: '25%',
			layoutSize: '80%',
			label: {
				emphasis: {
					show: false
				}
			},
			itemStyle: {
				emphasis: {
					areaColor: '#fff464'
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
		series: [{
			name: 'mapSer',
			type: 'map',
			roam: false,
			geoIndex: 0,
			label: {
				show: false,
			},
			data: data
		}, {
			name: 'barSer',
			type: 'bar',
			roam: false,
			visualMap: false,
			zlevel: 2,
			barMaxWidth: 20,
			itemStyle: {
				normal: {
					color: '#40a9ed'
				},
				emphasis: {
					color: "#3596c0"
				}
			},
			label: {
				normal: {
					show: false,
					position: 'right',
					offset: [0, 10]
				},
				emphasis: {
					show: true,
					position: 'right',
					offset: [10, 0]
				}
			},
			data: data
		}]
	};

}())