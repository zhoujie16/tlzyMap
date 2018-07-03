//#bt
(function() {

}())

function getCountryOption(d) {
	var max = 100;
	var value1 = max - d.value;
	var option1 = {
		title: {
			text: d.title,
			textStyle: {
				width: '100%',
				align: 'center',
				color: '#ffffff', 
			},
			left: 'center',
			bottom: 0,
		},
		series: [{
			type: 'pie',
			radius: ['50%', '70%'],
			avoidLabelOverlap: false,
			hoverAnimation: false,
			label: {
				normal: {
					show: true,
					position: 'center',
					fontSize: 12,
					color: '#ffffff'
				}
			},
			labelLine: {
				normal: {
					show: false
				}
			},
			data: [{
					value: d.value,
					name: d.value + '%',
					itemStyle: {
						color: '#b4b5b5'
					}
				},
				{
					value: value1,
					name: '',
					itemStyle: {
						color: 'transparent'
					}
				},
			]
		}, {
			name: '中间圈',
			type: 'pie',
			radius: ['50%', '50%'],
			avoidLabelOverlap: false,
			hoverAnimation: false,

			data: [{
					value: 100,
					name: '',
					itemStyle: {
						color: '#da0819'
					}
				},

			]
		}]
	};
	return option1;
}