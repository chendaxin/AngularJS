/**
 * Created by Administrator on 2016/12/6.
 */
angular.module('myApp', []).controller('personCtrl', function($scope) {
    $scope.firstName = "John",
        $scope.lastName = "Doe",
        $scope.fullName = function() {
            return $scope.firstName + " " + $scope.lastName;
        }
});