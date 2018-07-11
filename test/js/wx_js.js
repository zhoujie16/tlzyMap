(function() {
	//获取token
	function getAccessToken(){
		$.ajax({
			type:"get",
			url:"https://api.weixin.qq.com/cgi-bin/token",
			data:{
				grant_type:'client_credential',
				appid:'wx928ac18162ade986',
				secret:'4abedd5714f243e940b510b413b49d87'
			},
			success:function(data){
				console.log(data)
			},
			error:function(err){
				console.log(err)
			}
		});
	}
	
	return;
	wx.config({
		debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: 'wx928ac18162ade986', // 必填，公众号的唯一标识
		timestamp: new Date(), // 必填，生成签名的时间戳
		nonceStr: 'wx928ac18162ade986', // 必填，生成签名的随机串
		signature: 'wx928ac18162ade986', // 必填，签名
		jsApiList: ['playVoice'] // 必填，需要使用的JS接口列表
	});
	wx.ready(function() {
		// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		console.log('wx.ready');
	});
	wx.error(function(res){
		console.log('wx.error',res)
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
});
}())