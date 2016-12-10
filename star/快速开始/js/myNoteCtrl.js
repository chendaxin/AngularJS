/**
 * Created by Administrator on 2016/12/10.
 */
app.controller("myNoteCtrl", function($scope){
    $scope.message = "";
    $scope.left = function(){
        var value = 100 - $scope.message.length;
        if(value >= 0){
            return value;
        }else {
            alert("超出字数限制");
        }
    }
    $scope.clear = function(){
        $scope.message = "";
    }
    $scope.save = function(){
        alert("保存成功");
    }

})