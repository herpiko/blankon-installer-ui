angular.module("install",[])
.controller("InstallCtrl", [
    "$scope", "$window", "$rootScope","$timeout","$interval", 
    function ($scope, $window, $rootScope, $timeout, $interval){
  console.log(JSON.stringify($rootScope.installationData));

    var params = "";
    params += "&partition=" + installationData.partition;
    params += "&device=" + installationData.device;
    params += "&hostname=" + installationData.hostname;
    params += "&username=" + installationData.username;
    params += "&fullname=" + installationData.fullname;
    params += "&password=" + installationData.password;
    params += "&language=" + installationData.language;
    params += "&timezone=" + installationData.timezone;
    params += "&keyboard=" + installationData.keyboard;
    params += "&autologin=" + installationData.autologin;
    installation = new Installation(params);
    installation.start();
    $scope.currentStep = "";
    updateStatus();
    statusUpdater = $interval(updateStatus, 5000);

    var updateStatus = function(){
      var status = installation.getStatus();
      console.log(status.status + ":" + status.description);
      $scope.currentStep = status.description;
      $scope.progressBarWidth = status.progress;
      if (status.status > 1) {
        $interval.cancel(statusUpdater);
        if (status.status == 2) {
          showError();
        } else {
          $rootScope.next();
        }
      }
    }
    var showError = function(){
      $scope.errorLog = "Error!";
    }


}])
