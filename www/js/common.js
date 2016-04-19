var db = window.db = window.db || {};
/*
 * 显示页面加载中图片
 * */
db.loadingShow = function() {
	if(document.getElementById("loading-img")){
		document.getElementById("loading-img").style.display = "block";
	}else{

		var loadingOuter = document.createElement('div');
		loadingOuter.setAttribute("id", "loading-img");
		var loadingInner = document.createElement('div');
		loadingInner.setAttribute("id", "loading");
		loadingOuter.appendChild(loadingInner);
		document.body.appendChild(loadingOuter);

//		var path = "images/picture/public/loading.gif";
//		if(window.location.href.indexOf("sfa/index.html") == -1){
//			path = "../../images/picture/public/loading.gif"
//		}
//		var loadingImg = document.createElement('img');
//		loadingImg.setAttribute("src", path);
//		loadingImg.setAttribute("id", "loading-img");
//		document.body.appendChild(loadingImg);
	}

}

db.loadingHide = function(){
	document.getElementById("loading-img").style.display = "none";
}

/*
 * 将数据缓存到本地localStorage中
 * */
db.cacheItem = function(key, value){
	if(!key || (value == null || value == undefined)){
		return;
	}
	if(typeof value =="object"){
		value=JSON.stringify(value);
	}

	window.localStorage.setItem(key,value);
}

/*
 * 从localStorage中获取数据
 * */
db.getCache = function(key){
	 var value=window.localStorage.getItem(key);
	 if(value){
	    value=JSON.parse(value);
	 }
	 return value;
}

/*
 * 删除localStorage中指定数据
 * */
db.removeCache = function(key){
	window.localStorage.removeItem(key);
}

/*
 * 清空localStorage中的数据
 * */
db.clearCache = function(){
	window.localStorage.clear();
}

db.sendAjax = function($http, url, params, data, sucessCallBack, errorCallBack){
	boe.loadingShow();
	$http({
		method : 'POST',
		url : url,
		params : params,
		timeout:30000,
		data : data, // pass in data as strings
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
		}
	}).success(function(data) {
		if (typeof (sucessCallBack) == 'function') {
			boe.loadingHide();
			sucessCallBack(data);
		}
	}).error(function(data) {
		if (typeof (errorCallBack) == 'function') {
			boe.loadingHide();
			errorCallBack(data);
		}
	});
}

/*
 * 获取当前页面url参数
 * */
db.getUrlParams = function(){
	var url = location.href;
	url = decodeURI(url).replace("#/","");
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
	var paraObj = {};
	for (i=0; j=paraString[i]; i++){
		paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
	};
	return paraObj;
}


//check if iphone
db.isAppleDevice = function ()
{
	//alert(navigator.platform);
	var isiOS =(['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0);
	//alert(isiOS);
	return isiOS;

}

// 公共组件
angular.module("ezstuff",[]).factory('commonService', ["$rootScope", "$http", "$ionicLoading", "$timeout", "$ionicPopup", function($rootScope, $http, $ionicLoading, $timeout, $ionicPopup) {
	// 提示信息
    var toaster = function(msg) {
    	$ionicLoading.show({
    		template:msg
    	});
    	$timeout(function(){
    		$ionicLoading.hide();
    	},2000);
    };

    // 公共提交接口
    /*
     * 参数说明： url请求路径
     * 			 data请求参数{xxx：xxx}
     *           successCallBack请求成功回调函数
     *           errorCallBack请求失败回调函数
     * */
    var sendAjax = function(url, params, data, sucessCallBack, errorCallBack){
    	//boe.loadingShow();
    	$http({
    		method : 'POST',
    		url : url,
    		params : params,
    		data : data, // pass in data as strings
    		headers : {
    			'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    		}
    	}).success(function(data) {
    		if (typeof (sucessCallBack) == 'function') {
    			//boe.loadingHide();
    			sucessCallBack(data);
    		}
    	}).error(function(data) {
    		if (typeof (errorCallBack) == 'function') {
    			//boe.loadingHide();
    			errorCallBack(data);
    		}
    	});
    }

    /*带input框的弹出框
     * 参数说明： $scope当前操作的域
     *           title弹出框title
     *           callback，当用户点击确定按钮时的回调函数
     * 注意： 需在国际化资源文件中定义“popup_no”和“popup_yes”
     * */
    var inputPopup = function($scope, title, callback){
    	$scope.popup = {};
    	// 调用$ionicPopup弹出定制弹出框
		$ionicPopup.show({
			template: "<input type='password' ng-model='popup.data'>",
			title: title,
     		cssClass: 'custom-popup',
			scope: $scope,
			buttons: [
				{ text: popup_no },
				{
					text: "<b>" + popup_yes + "</b>",
					type: "button-positive",
					onTap: function(e) {
						return $scope.popup.data;
					}
				}
			]
		}).then(function(res) {
			if(typeof(callback) == "function"){
				callback(res);
			}
			return res;
		});
    }

    var confirmPopup = function(title, template, callback){
		$ionicPopup.confirm({
			title: title,
			template: template,
			buttons: [
						{ text: popup_no,
						  onTap: function(e){
							  return false;
						  }
						},
						{
						text: "<b>" + popup_yes + "</b>",
						onTap: function(e){
							return true;
						}
						}
					]
		})
		.then(function(res) {
			if(typeof(callback) == "function"){
				callback(res);
			}
		});
    }

    var signOut=function(failedCallback){
    	sendAjax(config.baseUrl + "/management/boe/person/signOut", null, null,  function(data){
    		if(data != null){
    			//boe.removeCache(localStorageKeys.autoLogin);
    			//boe.removeCache(localStorageKeys.cacheUser);
				 boe.cacheItem(localStorageKeys.isLogin,false);
 				 indexModule.$scope.logout_button_hide=false;//隐藏
 				 indexModule.$scope.login_button_show=false;
    			switch (data.responseCode) {
    			case '1':
    				var tip_msg = "退出成功！";
    				if(getCurrentLangCode() == "en"){
    					tip_msg = "Logged out successfully!";
    				}
					  //boe.removeCache(localStorageKeys.getSessionTime);//删除session获取成功的时间
    				toaster(tip_msg);
    				$timeout(function(){
						window.open("index.html", "_self");
		  			}, 2000);
    				break;
    			}
    		}
    	}, function(){
    		failedCallback();
    	});
    }

	var passwordVaildate = function(passwordStr){
		var alert_tip_txt_5 = "密码不能输入空格!";
		var alert_tip_txt_6 = "密码输入错误,只能填写6~18位字符，可以使用字母、数字，需以字母开头";
		if(getCurrentLangCode() == "en"){
			alert_tip_txt_5 = "Password can not enter the space!";
			alert_tip_txt_6 = "Password input error, can only fill in 6 ~ 18 characters, you can use letters, Numbers, and must begin with a letter";
		}
		if(passwordStr.indexOf(" ") > -1){
			toaster(alert_tip_txt_5);
			return false;
		}else{
			var passwordvalid = /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/;
			if(passwordvalid.test(passwordStr)){
				return true;
			}else{
				toaster(alert_tip_txt_6);
				return false;
			}
		}
	}

	var phoneVaildate = function(phoneStr){
		var alert_tip_txt_5 = "电话号码不能包含特殊字符，必须是数字！";
		var alert_tip_txt_6 = "电话号码必须是数字且不能包含空格！";
		var alert_tip_txt_7 = "电话号码长度不能超过14位数字！";
		if(getCurrentLangCode() == "en"){
			alert_tip_txt_5 = "Phone numbers cannot contain special characters, must be a number!";
			alert_tip_txt_6 = "The number must be a number!";
			alert_tip_txt_7 = "Phone number length can not be more than 14 digits!";
		}
		var pattern=/[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im;
		if(phoneStr.length <= 14){
			if(pattern.test(phoneStr)){
				toaster(alert_tip_txt_5);
				return false;
			}else{
				var type = /^[0-9]*[1-9][0-9]*$/;
				var re = new RegExp(type);
				if (phoneStr.match(re) == null) {
					toaster(alert_tip_txt_6);
					return false;
				}else{
					return true;
				}
			}
		}else{
			toaster(alert_tip_txt_7);
			return false;
		}
		/*if(pattern.test(phoneStr)){
			toaster(alert_tip_txt_5);
			return false;
		}else{
			var type = /^[0-9]*[1-9][0-9]*$/;
			var re = new RegExp(type);
			if (phoneStr.match(re) == null) {
				toaster(alert_tip_txt_6);
				return false;
			}else{
				return true;
			}
		}*/
	}

    return {
    	showToaster: function(msg) { return toaster(msg); },
    	sendAjax: function(url, params, data, sucessCallBack, errorCallBack){
    		return sendAjax(url, params, data, sucessCallBack, errorCallBack);
    	},
    	checkLogin: function(successCallBack, errorCallBack){
    		return sendAjax(config.baseUrl + "/management/boe/person/hasSession", null, null,  successCallBack, errorCallBack);
    	},
    	showInputPopup: function($scope, title, callback){
    		return inputPopup($scope, title, callback);
    	},
    	showConfirmPopup: function(title, template, callback){
    		return confirmPopup(title, template, callback);
    	},
    	checkPwd : function($scope,callbackOK,callbackNo) {
    		return checkPwd($scope,callbackOK,callbackNo);
    	},
    	signOut : function(failedCallback) {
    		return signOut(failedCallback);
    	},
		phoneVaildate : function(phoneStr){
			return phoneVaildate(phoneStr);
		},
		passwordVaildate : function(passwordStr){
			return passwordVaildate(passwordStr);
		}

    };
  }]);
