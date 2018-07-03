var worldMapOpt = {
	geo: {
		map: 'world', 
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
	}
};
 
function showWorldMap(){
	mainChart.setOption(worldMapOpt);
}
