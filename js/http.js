//模拟http-ajax请求

var http = {
	//获取国家对应的人数
	getWorldCountryData: function(success) {
		var data = [{
			"name": "Togo",
			"value": 47
		}, {
			"name": "Italy",
			"value": 15
		}, {
			"name": "French Southern and Antarctic Lands",
			"value": 59
		}, {
			"name": "Br. Indian Ocean Ter.",
			"value": 3
		}, {
			"name": "Latvia",
			"value": 5
		}, {
			"name": "Belarus",
			"value": 41
		}, {
			"name": "Czech Rep.",
			"value": 56
		}, {
			"name": "Bosnia and Herz.",
			"value": 83
		}, {
			"name": "Argentina",
			"value": 16
		}, {
			"name": "Mali",
			"value": 57
		}, {
			"name": "Singapore Rep.",
			"value": 37
		}, {
			"name": "Angola",
			"value": 51
		}, {
			"name": "Switzerland",
			"value": 55
		}, {
			"name": "Gabon",
			"value": 29
		}, {
			"name": "Zimbabwe",
			"value": 42
		}, {
			"name": "Fiji",
			"value": 36
		}, {
			"name": "Cambodia",
			"value": 34
		}, {
			"name": "Tunisia",
			"value": 34
		}, {
			"name": "Kuwait",
			"value": 59
		}, {
			"name": "Denmark",
			"value": 60
		}, {
			"name": "Burundi",
			"value": 60
		}, {
			"name": "Portugal",
			"value": 15
		}, {
			"name": "Pakistan",
			"value": 61
		}, {
			"name": "Ghana",
			"value": 73
		}, {
			"name": "Honduras",
			"value": 78
		}, {
			"name": "Namibia",
			"value": 40
		}, {
			"name": "Iraq",
			"value": 61
		}, {
			"name": "Saudi Arabia",
			"value": 46
		}, {
			"name": "Thailand",
			"value": 54
		}, {
			"name": "Peru",
			"value": 9
		}, {
			"name": "Ethiopia",
			"value": 66
		}, {
			"name": "Vietnam",
			"value": 47
		}, {
			"name": "Chad",
			"value": 42
		}, {
			"name": "Myanmar",
			"value": 21
		}, {
			"name": "Kazakhstan",
			"value": 18
		}, {
			"name": "Puerto Rico",
			"value": 54
		}, {
			"name": "Philippines",
			"value": 11
		}, {
			"name": "Hungary",
			"value": 75
		}, {
			"name": "Nigeria",
			"value": 79
		}, {
			"name": "Qatar",
			"value": 85
		}, {
			"name": "Kenya",
			"value": 31
		}, {
			"name": "Belize",
			"value": 60
		}, {
			"name": "Tanzania",
			"value": 61
		}, {
			"name": "Central African Rep.",
			"value": 17
		}, {
			"name": "Indonesia",
			"value": 74
		}, {
			"name": "Djibouti",
			"value": 1
		}, {
			"name": "Mongolia",
			"value": 11
		}, {
			"name": "Eq. Guinea",
			"value": 84
		}, {
			"name": "Vanuatu",
			"value": 8
		}, {
			"name": "New Caledonia",
			"value": 60
		}, {
			"name": "Azerbaijan",
			"value": 82
		}, {
			"name": "United Arab Emirates",
			"value": 78
		}, {
			"name": "Bermuda",
			"value": 35
		}, {
			"name": "Guatemala",
			"value": 83
		}, {
			"name": "Belgium",
			"value": 29
		}, {
			"name": "Lao PDR",
			"value": 50
		}, {
			"name": "Sierra Leone",
			"value": 44
		}, {
			"name": "Bulgaria",
			"value": 10
		}, {
			"name": "India",
			"value": 75
		}, {
			"name": "Mozambique",
			"value": 23
		}, {
			"name": "French Guiana",
			"value": 58
		}, {
			"name": "Cyprus",
			"value": 39
		}, {
			"name": "Lesotho",
			"value": 49
		}, {
			"name": "Japan",
			"value": 78
		}, {
			"name": "Netherlands",
			"value": 52
		}, {
			"name": "West Bank",
			"value": 61
		}, {
			"name": "Algeria",
			"value": 1
		}, {
			"name": "Dominican Rep.",
			"value": 40
		}, {
			"name": "United Kingdom",
			"value": 77
		}, {
			"name": "Zambia",
			"value": 5
		}, {
			"name": "Slovakia",
			"value": 46
		}, {
			"name": "Spain",
			"value": 73
		}, {
			"name": "Israel",
			"value": 68
		}, {
			"name": "Haiti",
			"value": 51
		}, {
			"name": "Cameroon",
			"value": 65
		}, {
			"name": "Mexico",
			"value": 77
		}, {
			"name": "Palestine",
			"value": 23
		}, {
			"name": "Bahamas",
			"value": 16
		}, {
			"name": "Suriname",
			"value": 11
		}, {
			"name": "Malawi",
			"value": 54
		}, {
			"name": "Chile",
			"value": 33
		}, {
			"name": "Croatia",
			"value": 37
		}, {
			"name": "Bangladesh",
			"value": 38
		}, {
			"name": "Austria",
			"value": 48
		}, {
			"name": "Timor-Leste",
			"value": 57
		}, {
			"name": "Venezuela",
			"value": 45
		}, {
			"name": "Sri Lanka",
			"value": 40
		}, {
			"name": "N. Cyprus",
			"value": 65
		}, {
			"name": "Canada",
			"value": 500
		}, {
			"name": "Nepal",
			"value": 45
		}, {
			"name": "Costa Rica",
			"value": 18
		}, {
			"name": "Paraguay",
			"value": 56
		}, {
			"name": "Niger",
			"value": 43
		}, {
			"name": "Korea",
			"value": 63
		}, {
			"name": "Somaliland",
			"value": 26
		}, {
			"name": "Ukraine",
			"value": 11
		}, {
			"name": "Kosovo",
			"value": 26
		}, {
			"name": "Afghanistan",
			"value": 49
		}, {
			"name": "Solomon Is.",
			"value": 21
		}, {
			"name": "Morocco",
			"value": 14
		}, {
			"name": "Benin",
			"value": 19
		}, {
			"name": "Greece",
			"value": 60
		}, {
			"name": "Tajikistan",
			"value": 47
		}, {
			"name": "Egypt",
			"value": 87
		}, {
			"name": "Jamaica",
			"value": 57
		}, {
			"name": "Uganda",
			"value": 79
		}, {
			"name": "Estonia",
			"value": 25
		}, {
			"name": "Rwanda",
			"value": 35
		}, {
			"name": "China",
			"value": 888
		}, {
			"name": "Gambia",
			"value": 74
		}, {
			"name": "Romania",
			"value": 19
		}, {
			"name": "Syria",
			"value": 75
		}, {
			"name": "Panama",
			"value": 11
		}, {
			"name": "El Salvador",
			"value": 84
		}, {
			"name": "South Africa",
			"value": 46
		}, {
			"name": "United States",
			"value": 500
		}, {
			"name": "Papua New Guinea",
			"value": 80
		}, {
			"name": "Cuba",
			"value": 4
		}, {
			"name": "Guyana",
			"value": 11
		}, {
			"name": "Mauritania",
			"value": 54
		}, {
			"name": "Bolivia",
			"value": 60
		}, {
			"name": "Jordan",
			"value": 60
		}, {
			"name": "Dem. Rep. Korea",
			"value": 24
		}, {
			"name": "Russia",
			"value": 200
		}, {
			"name": "The Bahamas",
			"value": 34
		}, {
			"name": "Yemen",
			"value": 57
		}, {
			"name": "Iceland",
			"value": 1
		}, {
			"name": "France",
			"value": 70
		}, {
			"name": "Swaziland",
			"value": 86
		}, {
			"name": "Botswana",
			"value": 18
		}, {
			"name": "Bhutan",
			"value": 0
		}, {
			"name": "Guinea",
			"value": 66
		}, {
			"name": "Turkmenistan",
			"value": 13
		}, {
			"name": "Dem. Rep. Congo",
			"value": 69
		}, {
			"name": "W. Sahara",
			"value": 49
		}, {
			"name": "Germany",
			"value": 11
		}, {
			"name": "Libya",
			"value": 41
		}, {
			"name": "Brazil",
			"value": 81
		}, {
			"name": "Uzbekistan",
			"value": 42
		}, {
			"name": "Albania",
			"value": 16
		}, {
			"name": "Macedonia",
			"value": 7
		}, {
			"name": "Kyrgyzstan",
			"value": 64
		}, {
			"name": "Lebanon",
			"value": 4
		}, {
			"name": "Trinidad and Tobago",
			"value": 69
		}, {
			"name": "Madagascar",
			"value": 61
		}, {
			"name": "East Timor",
			"value": 37
		}, {
			"name": "Burkina Faso",
			"value": 36
		}, {
			"name": "Slovenia",
			"value": 85
		}, {
			"name": "S. Sudan",
			"value": 50
		}, {
			"name": "Luxembourg",
			"value": 33
		}, {
			"name": "Ecuador",
			"value": 87
		}, {
			"name": "Guinea Bissau",
			"value": 64
		}, {
			"name": "Poland",
			"value": 3
		}, {
			"name": "Somalia",
			"value": 10
		}, {
			"name": "Ireland",
			"value": 70
		}, {
			"name": "Armenia",
			"value": 33
		}, {
			"name": "Senegal",
			"value": 40
		}, {
			"name": "Lithuania",
			"value": 59
		}, {
			"name": "Eritrea",
			"value": 49
		}, {
			"name": "Finland",
			"value": 87
		}, {
			"name": "Ivory Coast",
			"value": 56
		}, {
			"name": "Iran",
			"value": 35
		}, {
			"name": "Serbia",
			"value": 50
		}, {
			"name": "Congo",
			"value": 75
		}, {
			"name": "Colombia",
			"value": 64
		}, {
			"name": "New Zealand",
			"value": 70
		}, {
			"name": "Oman",
			"value": 57
		}, {
			"name": "Uruguay",
			"value": 58
		}, {
			"name": "Brunei",
			"value": 47
		}, {
			"name": "Montenegro",
			"value": 80
		}, {
			"name": "Siachen Glacier",
			"value": 57
		}, {
			"name": "Georgia",
			"value": 19
		}, {
			"name": "Greenland",
			"value": 56
		}, {
			"name": "Norway",
			"value": 27
		}, {
			"name": "Liberia",
			"value": 41
		}, {
			"name": "Nicaragua",
			"value": 61
		}, {
			"name": "Turkey",
			"value": 50
		}, {
			"name": "Guinea-Bissau",
			"value": 23
		}, {
			"name": "Falkland Islands",
			"value": 16
		}, {
			"name": "Malaysia",
			"value": 55
		}, {
			"name": "Sudan",
			"value": 71
		}, {
			"name": "Sweden",
			"value": 3
		}, {
			"name": "Côte d'Ivoire",
			"value": 54
		}, {
			"name": "Moldova",
			"value": 76
		}, {
			"name": "Australia",
			"value": 445
		}];
		success(data);
	},
	//获取知名首都对应的人数
	getWorldCapitalData: function(success) {
		var data = [{
			"name": "伦敦",
			"coor": [0, 51.3],
			"value": 456
		}, {
			"name": "纽约",
			"coor": [-73.55, 40.44],
			"value": 528
		}, {
			"name": "芝加哥",
			"coor": [-87.4, 41.5],
			"value": 166
		}, {
			"name": "东京",
			"coor": [139.4, 35.4],
			"value": 797
		}, {
			"name": "巴黎",
			"coor": [2.2, 48.5],
			"value": 219
		}, {
			"name": "新加坡",
			"coor": [103.5, 1.22],
			"value": 371
		}, {
			"name": "香港",
			"coor": [114.1, 22.2],
			"value": 931
		}, {
			"name": "上海",
			"coor": [121.3, 31.2],
			"value": 467
		}, {
			"name": "北京",
			"coor": [114.3, 39.6],
			"value": 364
		}, {
			"name": "悉尼",
			"coor": [151.2, -33.6],
			"value": 825
		}, {
			"name": "迪拜",
			"coor": [55.2, 25.2],
			"value": 991
		}, {
			"name": "莫斯科",
			"coor": [34.4, 55.5],
			"value": 868
		}, {
			"name": "首尔",
			"coor": [127, 37.4],
			"value": 323
		}, {
			"name": "牛津",
			"coor": [-1.2577263, 51.7520209],
			"value": 375
		}, {
			"name": "瑞典",
			"coor": [18.643501, 60.128161],
			"value": 372
		}, {
			"name": "汉堡",
			"coor": [9.9936819, 53.5510846],
			"value": 496
		}, {
			"name": "洛杉矶",
			"coor": [-118.2436849, 34.0522342],
			"value": 367
		}, {
			"name": "开罗",
			"coor": [31.2357116, 30.0444196],
			"value": 535
		}, {
			"name": "曼谷",
			"coor": [100.5017651, 13.7563309],
			"value": 423
		}];
		success(data);
	},
	//获取中国各个省份对应的人数
	getChinaCountryData: function(success) {
		var data = [{
				name: '安徽',
				value: 200
			}, {
				name: '浙江',
				value: 180
			},
			{
				name: '上海',
				value: 150
			}, {
				name: '广东',
				value: 120
			},
			{
				name: '湖北',
				value: 100
			}, {
				name: '北京',
				value: 80
			},
			{
				name: '天津',
				value: 60
			},
			{
				name: '重庆',
				value: 56
			},
			{
				name: '河北',
				value: 55
			},
			{
				name: '河南',
				value: 50
			},
			{
				name: '云南',
				value: 48
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
				name: '山东',
				value: 20
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
				name: '江西',
				value: 20
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
		success(data)
	},
	//获取中国省会城市对应的人数
	getChinaProvincialCapitalData: function(success) {
		var data = [{
			"name": "上海",
			"coor": [121.4648, 31.2891],
			"value": 685
		}, {
			"name": "天津",
			"coor": [117.4219, 39.4189],
			"value": 152
		}, {
			"name": "北京",
			"coor": [116.4551, 40.2539],
			"value": 103
		}, {
			"name": "重庆",
			"coor": [107.7539, 30.1904],
			"value": 922
		}, {
			"name": "石家庄",
			"coor": [114.4995, 38.1006],
			"value": 386
		}, {
			"name": "太原",
			"coor": [112.3352, 37.9413],
			"value": 135
		}, {
			"name": "沈阳",
			"coor": [123.1238, 42.1216],
			"value": 82
		}, {
			"name": "长春",
			"coor": [125.8154, 44.2584],
			"value": 994
		}, {
			"name": "哈尔滨",
			"coor": [127.9688, 45.368],
			"value": 617
		}, {
			"name": "南京",
			"coor": [118.8062, 31.9208],
			"value": 381
		}, {
			"name": "杭州",
			"coor": [119.5313, 29.8773],
			"value": 841
		}, {
			"name": "合肥",
			"coor": [117.29, 32.0581],
			"value": 148
		}, {
			"name": "福州",
			"coor": [119.4543, 25.9222],
			"value": 331
		}, {
			"name": "南昌",
			"coor": [116.0046, 28.6633],
			"value": 549
		}, {
			"name": "济南",
			"coor": [117.1582, 36.8701],
			"value": 164
		}, {
			"name": "郑州",
			"coor": [113.4668, 34.6234],
			"value": 116
		}, {
			"name": "广州",
			"coor": [113.5107, 23.2196],
			"value": 392
		}, {
			"name": "长沙",
			"coor": [113.0823, 28.2568],
			"value": 279
		}, {
			"name": "武汉",
			"coor": [114.3896, 30.6628],
			"value": 239
		}, {
			"name": "海口",
			"coor": [110.3893, 19.8516],
			"value": 914
		}, {
			"name": "成都",
			"coor": [103.9526, 30.7617],
			"value": 635
		}, {
			"name": "贵阳",
			"coor": [106.6992, 26.7682],
			"value": 294
		}, {
			"name": "昆明",
			"coor": [102.9199, 25.4663],
			"value": 193
		}, {
			"name": "西安",
			"coor": [109.1162, 34.2004],
			"value": 184
		}, {
			"name": "兰州",
			"coor": [103.5901, 36.3043],
			"value": 832
		}, {
			"name": "西宁",
			"coor": [101.4038, 36.8207],
			"value": 423
		}, {
			"name": "呼和浩特",
			"coor": [111.4124, 40.4901],
			"value": 658
		}, {
			"name": "南宁",
			"coor": [108.479, 23.1152],
			"value": 123
		}, {
			"name": "拉萨",
			"coor": [91.1865, 30.1465],
			"value": 15
		}, {
			"name": "银川",
			"coor": [106.3586, 38.1775],
			"value": 498
		}, {
			"name": "乌鲁木齐",
			"coor": [87.9236, 43.5883],
			"value": 710
		}];
		success(data);
	},
	//获取各个省对应城市的人数。
	
}

function test() {
	var data = {};
	worldData.forEach(function(d, i) {
		data[d.name] = d.value;
	})
	console.log(JSON.stringify(data))
}

function test2(){
	var dd = ['anhui.js','aomen.js','beijing.js','chongqing.js','fujian.js','gansu.js','guangdong.js','guangxi.js','guizhou.js','hainan.js','hebei.js','heilongjiang.js','henan.js','hubei.js','hunan.js','jiangsu.js','jiangxi.js','jilin.js','liaoning.js','neimenggu.js','ningxia.js','qinghai.js','shandong.js','shanghai.js','shanxi.js','shanxi1.js','sichuan.js','taiwan.js','tianjin.js','xianggang.js','xinjiang.js','xizang.js','yunnan.js','zhejiang.js'];
	$.each(dd, function(i,d) {
		dd[i] = '<script src="libs/echarts/map/province/'+ d+'" type="text/javascript" charset="utf-8"></script>'
	});
	var s = '';
	dd.forEach(function(d,i){
		s+=d
	})
	console.log(s)
}
