(function() {
	var url = 'http://101.201.196.132/school_webapi';
	//获取校区/campus/list
	Mock.mock(url + '/campus/list', 'get', {
		'dataList|2':[{
			'_id|+1':0,
			'name|+1':['校区1','校区2']
		}],
		'msg': '操作成功',
		'ret': 0,
		'totalCount': 2
	});
	//获取学届
	Mock.mock(url + '/grade/list', 'post', {
		'dataList|10':[{
			'_id|+1':2000,
			'name|+1':['2000届','2001届','2002届','2003届','2004届','2005届','2006届','2007届','2008届','2009届']
		}],
		'msg': '操作成功',
		'ret': 0,
		'totalCount': 10
	});
	
	//查班级 /class/list
	Mock.mock(url + '/class/list', 'post', {
		'dataList|10':[{
			'_id|+1':301,
			'name|+1':301
		}],
		'msg': '操作成功',
		'ret': 0,
		'totalCount': 10
	});
	//校友激活
	Mock.mock(url + '/student/active', 'post', {
		'msg': '操作成功',
		'ret|+1': [0,901,902,903],
		'totalCount': 1
	});
	
	//查找同班同学
	Mock.mock(url + '/student/classmates', 'post', {
		'dataList|10':[{
			'_id|+1':100,
			'name|+1':100
		}],
		'msg': '操作成功',
		'ret|+1': [0,901,902,903],
		'totalCount': 1
	});
	
	//身份审核  补录申请
	Mock.mock(url + '/event/postrecord', 'post', {
		'msg': '操作成功',
		'ret|+1': [0,901,902,903],
		'totalCount': 1
	});
	 
}())