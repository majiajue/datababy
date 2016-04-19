angular.module('starter.controllers', ["ionic","ezstuff"])

.controller('DashCtrl', function($scope,commonService,$state) {

  $scope.gotoLogin = function() {
     $state.go('tab.login');
  };
  if(db.getCache(localStorageKeys.cacheUser)!=null){
    var data = {
      "tId": db.getCache(localStorageKeys.cacheUser).teId,
      "orgcode": db.getCache(localStorageKeys.cacheUser).organcode
    }
   var url = config.baseUrl + "/management/api/getClassByTeacher";
   $scope.items = [];
   commonService.sendAjax(url,data,null,function(data){
   if(data.responseCode=="1"||data.responseCode==1){
       $scope.items = data.datas;

   }else{

     commonService.showToaster(data.responseMsg);
   }


   });
 }
  //
  // for(var i=0;i<20;i++)
  //   $scope.items.push(["item ",i+1].join(""));
  // }

}).config(function($ionicConfigProvider){
    $ionicConfigProvider.tabs.position("bottom");  //参数可以是：top | bottom
})
.controller('loginCtrl', function($scope,commonService,$state) {
   $scope.formData = {};
   $scope.login = function(){
     var username = $scope.formData.username;
     var password = $scope.formData.password;
     if(username!=null||username.trim()!=""||password!=null||password.trim()!=null){
       var data = {
         "username": username,
         "password": password
       }
       var url = config.baseUrl + "/management/api/login"
       commonService.sendAjax(url,data,null,function(data){
       if(data.responseCode=="1"||data.responseCode==1){
           commonService.showToaster("登陆成功,即将返回首页");
           $state.go('tab.dash');
           db.cacheItem(localStorageKeys.cacheUser,data.datas);

       }


       });
     }


   }

})
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('ClassCtrl', function($scope) {

});
