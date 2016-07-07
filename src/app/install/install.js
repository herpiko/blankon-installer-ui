angular.module("install",[])
.controller("InstallCtrl", ["$scope", "$window", "$rootScope","$timeout","$interval",
  function ($scope, $window, $rootScope, $timeout, $interval){
    
    $(".content").css("height", $rootScope.contentHeight);

    console.log(JSON.stringify($rootScope.installationData));
    Installation.setTimezone($rootScope.installationData.timezone);

    var showError = function(){
      console.log("error");
      $scope.error = true;
    }
    var currentProgress;
    var updateStatus = function(){
      var status = $rootScope.installation.getStatus();
      console.log(status.status + ":" + status.description);
      $scope.currentStep = status.description;
      $scope.progressBarWidth = status.progress;
      if ($scope.currentStep === 'copying_filesystem') {
        if (!currentProgress) {
          currentProgress = 20;
        }
        if (currentProgress < 80) {
          currentProgress += 0.5;
        }
        status.progress = currentProgress;
        console.log(status.progress);
      }
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
    $scope.loadingDot = "";
    $interval(function(){
      if ($scope.loadingDot.length === 8) {
        $scope.loadingDot = "";
      } else {
        $scope.loadingDot += " .";
      }
    }, 500);


    var params = "";
    params += "&partition=" + $rootScope.installationData.partition;
    params += "&device=" + $rootScope.installationData.device;
    params += "&device_path=" + $rootScope.installationData.device_path;
    params += "&hostname=" + $rootScope.installationData.hostname;
    params += "&username=" + $rootScope.installationData.username;
    params += "&fullname=" + $rootScope.installationData.fullname;
    params += "&password=" + $rootScope.installationData.password;
    params += "&language=" + $rootScope.installationData.language;
    params += "&timezone=" + $rootScope.installationData.timezone;
    params += "&keyboard=" + $rootScope.installationData.keyboard;
    params += "&autologin=" + $rootScope.installationData.autologin;
    params += "&advancedMode=" + $rootScope.advancedPartition;
    if ($rootScope.advancedPartition) {
        params += "&steps=" + $rootScope.partitionSteps;
    }
    if ($rootScope.isEfi) {
        params += "&isEfi=" + true;
        params += "&efiPartition=" + $rootScope.selectedEfiPartition;
        params += "&efiNeedFormat=" + $rootScope.efiNeedFormat;
    }  else {
        params += "&isEfi=" + "";
        params += "&efiPartition=" + "";
        params += "&efiNeedFormat=" + "";
    }
    // give time for view transition
    $timeout(function(){
      console.log(params);
      $rootScope.installation = new Installation(params);
      $rootScope.installation.start();
      $scope.currentStep = "";
      statusUpdater = $interval(updateStatus, 1000);
    }, 1000);

}])
