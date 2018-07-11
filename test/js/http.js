$(function() {
	mui('.mui-scroll-wrapper').scroll()
	//var url = 'http://127.0.0.1:8080/pt-school/api';
	var url = 'http://school.jsonpro.cn/pt-school/api';
	var model = {
		"classId": "1",
		"gradeYear": "1991",
		"sex": "1",
		"campusName": "6",
		"stuName": "admin",
		"phone": "admin",
		"pwd": "e10adc3949ba59abbe56e057f20f883e",
		"nickname": "wh"
	}
	//姓名
	var $stuName = $('#stu-name');
	//性别
	var $sex = $('#sex');
	//手机号
	var $phone = $('#phone');
	//校区
	var $campusName = $('#campus-name');
	//年份
	var $gradeYear = $('#grade-year');
	//班级
	var $classId = $('#class-id');
	//外号
	var $nickname = $('#nickname');
	//密码1
	var $pwd = $('#pwd');
	//密码2
	var $pwd1 = $('#pwd1');

	queryCampus(function(dataList) {
		$campusName.empty();
		$campusName.append('<option value="" disabled selected>请输入您的毕业校区</option>')
		dataList.forEach(function(item, i) {
			var $opt = '<option value="' + item.id + '">' + item.name + '</option>'
			$campusName.append($opt);
		});
	});
	queryGradeList(function(dataList) {
		$gradeYear.empty();
		$gradeYear.append('<option value="" disabled selected>请输入您的毕业年份</option>')
		dataList.forEach(function(item, i) {
			var $opt = '<option value="' + item.id + '">' + item.gradeName + '</option>'
			$gradeYear.append($opt);
		});
	});

	$campusName.on('change', function() {
		console.log('校区改变')
		$classId.val('');
		var campusId = $campusName.val()
		var gradeYear = $gradeYear.val();
		if(gradeYear) {
			queryClass(campusId, gradeYear, function(dataList) {
				$classId.empty();
				$classId.append('<option value="" disabled selected>请输入您的所属班级</option>')
				dataList.forEach(function(item, i) {
					var $opt = '<option value="' + item.id + '">' + item.name + '</option>'
					$classId.append($opt);
				});
			})
		}
	});
	$gradeYear.on('change', function() {
		console.log('学届改变');
		$classId.val('');
		var campusId = $campusName.val()
		var gradeYear = $gradeYear.val();
		if(campusId) {
			$classId.empty();
			$classId.append('<option value="" disabled selected>请输入您的所属班级</option>')
			queryClass(campusId, gradeYear, function(dataList) {
				dataList.forEach(function(item, i) {
					var $opt = '<option value="' + item.id + '">' + item.name + '</option>'
					$classId.append($opt);
				});
			})
		}
	});

	$('.btn-2').on('tap', function() {
		var pwd = $pwd.val();
		var pwd1 = $pwd1.val();
		var params = {
			classId: $classId.val(),
			gradeYear: $gradeYear.val(),
			sex: $sex.val(),
			campusName: $campusName.val(),
			stuName: $stuName.val(),
			phone: $phone.val(),
			pwd: md5(pwd),
			nickname: $nickname.val()
		}
		//参数校验
		if(!params.stuName) {
			mui.alert('请输入您的姓名');
			return;
		}
		if(!params.sex) {
			mui.alert('请输入您的性别');
			return;
		}
		if(!params.phone) {
			mui.alert('请输入您的手机号');
			return;
		}
		if(!params.campusName) {
			mui.alert('请输入您的毕业校区');
			return;
		}
		if(!params.gradeYear) {
			mui.alert('请输入您的毕业年份');
			return;
		}
		if(!params.classId) {
			mui.alert('请输入您的所属班级');
			return;
		}

		if(!pwd) {
			mui.alert('请输入您的密码');
			return;
		}
		if(!pwd1) {
			mui.alert('请确认您的密码');
			return;
		}

		if(pwd !== pwd1) {
			mui.alert('2次输入的密码不一致');
			return;
		}

		studentActive({
			name: params.stuName,
			classId: params.classId,
			sex: params.sex,
			phone: params.phone,
			password: params.pwd,
			nickname: params.nickname
			//longitude
			//latitude
			//address
		}, function(data) {
			//校友身份是否存在
			if(data.code === 200) { //存在
				console.log('校友身份存在')
				mui.alert('激活成功')
			} else if(data.code == 901) { //不存在 data.ret == 901
				mui.confirm('校友不存在，是否提交补录申请？', '提示', ['取消', '确认'], function(e) {
					if(e.index) {
						console.log('提交补录  查找同班同学');
						queryClassmate({
							id: params.classId,
							activeStatus: 0
						}, function(classmates) {
							debugger;
							if(classmates.length > 3) {
								console.log('存在3个同班同学');
								test();

								function test() {
									var html = '';
									classmates.forEach(function(item, i) {
										html += '<option value="' + item.id + '">' + item.name + '</option>'
									});
									html = '<div>校友列表(必须选择三个同学)</div>' + '<select id="classmate-sel" multiple name="">' + html + '</select>';
									mui.confirm(html, '申请校友验证', ['取消', '确认'], function(e) {
										if(e.index) {
											var ids = $('#classmate-sel').val();
											if(ids.length !== 3) {
												mui.alert('有且只能选择三位同学', function() {
													mui.later(function() {
														test()
													}, 500)
												});
												return;
											}
											postrecord({
												name: params.stuName,
												classId: params.classId,
												sex: params.sex,
												auditType: 2,
												ids: ids,
												phone: params.phone,
												password: params.pwd,
												eventType: 1,
											}, function(data) {
												if(data.ret === 0) {
													mui.alert(data.msg)
												}
											})
										}
									}, 'div');
								}
							} else {
								console.log('没有3个同班同学');
								postrecord({
									name: params.stuName,
									classId: params.classId,
									sex: params.sex,
									auditType: 1,
									phone: params.phone,
									password: params.pwd,
									eventType: 1,
								}, function(data) {
									if(data.ret === 200) {
										mui.alert(data.msg)
									}
								})
							}
						});
					}
				}, 'div');
			} else if(data.ret == 902) {
				mui.alert('存在同名的同学，请输入您的外号');
			} else if(data.ret == 903) { //该校友已被激活，您的身份可能被冒用，是否提交审核
				mui.confirm('该校友已被激活，您的身份可能被冒用，是否提交审核？', '提示', ['取消', '确认'], function(e) {
					if(e.index) {
						console.log('提交审核 查找同班同学')
						queryClassmate({
							id: params.classId,
							activeStatus: 1
						}, function(classmates) {
							if(classmates.length > 3) {
								console.log('存在3个同班同学');
								test()

								function test() {
									var html = '';
									classmates.forEach(function(item, i) {
										html += '<option value="' + item._id + '">' + item.name + '</option>'
									});
									html = '<div>校友列表(必须选择三个同学)</div>' + '<select id="classmate-sel" multiple name="">' + html + '</select>';
									mui.confirm(html, '申请校友验证', ['取消', '确认'], function(e) {
										if(e.index) {
											var ids = $('#classmate-sel').val();
											if(ids.length !== 3) {
												mui.alert('有且只能选择三位同学', function() {
													mui.later(function() {
														test()
													}, 500)
												});
												return;
											}
											fakeid({
												name: params.stuName,
												classId: params.classId,
												sex: params.sex,
												auditType: 2,
												ids: ids,
												phone: params.phone,
												password: params.pwd,
												eventType: 2,
											}, function(data) {
												if(data.ret === 0) {
													mui.alert(data.msg)
												}
											})
										}
									}, 'div');
								}
							} else {
								console.log('没有3个同班同学');
								fakeid({
									name: params.stuName,
									classId: params.classId,
									sex: params.sex,
									auditType: 1, 
									phone: params.phone,
									password: params.pwd,
									eventType: 2,
								}, function(data) {
									if(data.ret === 0) {
										mui.alert(data.msg)
									}
								})
							}
						});
					}
				}, 'div');
			}
			//身份审核
			function fakeid(params, success) {
				axios.post(url + '/student/fakeidV2', params)
					.then(function(response) {
						var data = response.data;
						console.log('提交身份审核', data);
						success(data);
					})
					.catch(function(error) {
						console.log(error);
						mui.alert('请求出错');
					});
			}
			//补录申请
			function postrecd(params, success) {
				axios.post(url + '/student/postrecdV2', params)
					.then(function(response) {
						var data = response.data;
						console.log('补录申请', data);
						success(data);
					})
					.catch(function(error) {
						console.log(error);
						mui.alert('请求出错');
					});
			}

			function postrecord(params, success) {
				axios.post(url + '/event/postrecordV2', params).then(function(response) {
						var data = response.data;
						console.log('补录申请', data);
						success(data);
					})
					.catch(function(error) {
						console.log(error);
						mui.alert('请求出错');
					});
			}
			//查找同班同学
			function queryClassmate(params, success) {
				axios.post(url + '/student/classmates/' + params.id, {
						activeStatus: 1
					})
					.then(function(response) {
						var classmates = response.data.data;
						console.log('查找同班同学 classmates', classmates);
						success(classmates);
					})
					.catch(function(error) {
						console.log(error);
						mui.alert('请求出错');
					});
			}
		});
	});

	function queryGradeList(success) {
		//查学届
		axios.get(url + '/grade/list')
			.then(function(response) {
				var gradeList = response.data.data;
				console.log('学届gradeList', gradeList);
				success(gradeList);
			})
			.catch(function(error) {
				console.log(error);
				mui.alert('请求出错');
			});

	}

	function queryCampus(success) {
		//查校区 
		axios.get(url + '/campus/list')
			.then(function(response) {
				var campusList = response.data.data;
				console.log('查校区campus', campusList);
				success(campusList);
			})
			.catch(function(error) {
				console.log(error);
				mui.alert('请求出错');
			});

	}

	function queryClass(campas, grade, success) {
		//查班级
		axios.post(url + '/class/listV2', {
				pageNum: 1,
				pageSize: 200,
				campusId: campas,
				gradeId: grade
			})
			.then(function(response) {
				var classList = response.data.data;
				console.log('查班级 classList', classList);
				success(classList);
			})
			.catch(function(error) {
				console.log(error);
				mui.alert('请求出错');
			});

	}
	//校友激活
	function studentActive(params, success) {
		axios.post(url + '/student/activeV2', params)
		.then(function(response) {
			console.log('校友激活', response.data);
			success(response.data)
		}).catch(function(error) {
			console.log(error);
			mui.alert('请求出错');
		});
	}
});