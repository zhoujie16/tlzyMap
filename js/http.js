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
	//获取中国的数据
	getChinaData: function(success) {
		success(ChinaTest);
	}

}

var dataTool = {
	//获取中国各个省份对应的人数
	getChinaCountryData: function() {
		var provinceData = [];
		$.each(ChinaTest, function(i, d) {
			provinceData.push({
				name: d.name,
				value: d.value
			})
		});
		return provinceData;
	},
	//获取中国省会城市对应的人数
	getChinaProvincialCapitalData: function(success) {
		var provincialCapitalData = [];
		$.each(ChinaTest, function(i, d) {
			provincialCapitalData.push({
				name: d.capital.name,
				value: d.capital.value,
				coor: d.capital.coor,
			})
		});
		return provincialCapitalData;
	},
	//获取各个省对应城市的人数。
	getCityByCapital: function(name) {
		var arr = [];
		$.each(ChinaTest, function(i, d) {
			if(d.name == name) {
				arr = d.city;
				return false;
			}
		});
		return arr;
	}
}
function sortVal(a, b) {
	return b.value - a.value
}
//百分比数据
function getWorldPie() {
	var arr = [];
	worldData.forEach(function(d, i) {
		if(i < 5) {
			arr.push({
				value: d.value,
				name: nameMap[d.name]
			});
		}
	});
	arr.push({
		value: 50,
		name: '其它'
	})
	return arr;
}

function getChinaPie() {
	var arr = [];
	dataTool.getChinaCountryData().forEach(function(d, i) {
		if(i < 5) {
			arr.push({
				value: d.value,
				name: d.name
			});
		}
	});
	arr.push({
		value: 50,
		name: '其它'
	})
	return arr;
}

function getProvincePie(data) {
	var arr = [];
	data.forEach(function(d, i) {
		if(i < 5) {
			arr.push({
				value: d.value,
				name: d.name
			});
		}
	});
	arr.push({
		value: 50,
		name: '其它'
	})
	return arr;
}


function isHaveMap(name){
	var f = false;
	$.each(chinaData,function(i,d){
		if (d.name == name) {
			f = true;
			return false;
		}
	});
	return f;
}
