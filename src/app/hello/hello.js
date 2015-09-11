angular.module("hello",[])
.controller("HelloCtrl", [
    "$scope", "$window", "$rootScope", "$timeout", 
    function ($scope, $window, $rootScope, $timeout){
      $scope.languages = $window.BiLanguage.available();
    
      $scope.setLanguage = function(lang) {
        console.log(lang);
        $rootScope.installationData.lang = lang.id;
        $rootScope.selectedLang = lang.title;
      }
      // TODO : language selection
      Installation.setLocale("C.UTF-8");

      $scope.btScan = function(){
        $scope.scannedList = [];
        $scope.notDetect = false;
        $scope.scanning = true;
        $timeout(function(){
          var scanned = Installation.btScan();
          if (scanned.length > 1) {
            for (var i=1;i<scanned.length;i++) {
              var item = scanned[i].replace(/[^a-zA-Z0-9-_:]/g, '');
              var obj = {
                addr : item.slice(0,17),
                hostname : item.slice(17)
              }
              $scope.scannedList.push(obj);
            }
            $scope.notDetect = false;
            $scope.scanning = false;
          } else {
            $scope.notDetect = true;
            $scope.scanning = false;
          }
        }, 500)
      }
      $scope.setBluetooth = function(addr){
        $rootScope.installationData.bluetooth = addr;
        $rootScope.next();
      }
}])
