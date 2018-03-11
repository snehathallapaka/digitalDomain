var app = angular.module('lognlink');

app.controller('chat', ['$scope', 'CookieServices', 'UserServices', '$location', '$anchorScroll', function ($scope, CookieServices, UserServices, $location, $anchorScroll) {
    var socket = io.connect();
    $scope.selected = '';
    console.log('sel...',$scope.selected);
    $scope.onSelect = function ($item) {
        console.log($item)
    };
    // console.log(CookieServices.getToken());
    $scope.messages = [];
    function getFriends() {
        UserServices.getFriends(function (success) {
            if(success.data.status) {
                $scope.fromId = success.data.id;
                $scope.friends = success.data.details;
                socket.emit('init-channel', {fromId: $scope.fromId});
                // $scope.updateToId(0);
                // $scope.toId = $scope.friends[0]._id;
                console.log($scope.friends);
            }
        });
    }
    getFriends();
    $scope.msgunread = 'msg-unread';
    // socket.emit('init-channel', {fromId: $scope.fromId,toId:'sai',msg:'HI'});
    $scope.updateToId = function (index) {
        $scope.showChatBox = true;
        console.log(typeof index,index);
        if(typeof(index) === "object"){
            $scope.toId = index._id;
            $scope.toName = index.firstName+' '+index.lastName;
        } else {
            $scope.toId = $scope.friends[index]._id;
            $scope.toName = $scope.friends[index].firstName+' '+$scope.friends[index].lastName;
        }
        UserServices.getMessages({friendId:$scope.toId},function (success) {
            $scope.messages = success.data.details;
            $scope.friends[index].visited = true;
            // console.log($scope.messages);
        });
        gotoBottom();
    };

    $scope.sendMsg = function () {
        console.log($scope.message);
        if($scope.message){
            $scope.messages.push({fromId: $scope.fromId,message:$scope.message});
            socket.emit('message-channel', {fromId: $scope.fromId,toId:$scope.toId,message:$scope.message});
            $scope.message = '';
            getFriends();
            gotoBottom();
        }
    };
    socket.on('message-channel', function (data) {
        console.log('user controller', data);
        $scope.messages.push(data);
        getFriends();
        // console.log($scope.messages);
    });

    function gotoBottom(){
        $location.hash($scope.messages.length);
        console.log("len...",$scope.messages.length);
        $anchorScroll();
    }

    $scope.getMins = function (x) {
        // var ms = Math.abs(new Date("2017-08-30T06:26:44.553Z").getTime() - new Date(x));
        var ms = Math.abs(new Date().getTime() - new Date(x));
        var d = Math.round(new Date(ms).getTime());
        var sec = (d/1000).toFixed(0);
        var min = (d/(1000 * 60)).toFixed(0);
        var hour = (d/(1000 * 60 * 60)).toFixed(0);
        var day = (d/(1000 * 60 * 60 * 24)).toFixed(0);
        var month = (d/(1000 * 60 * 60 * 24 * 30)).toFixed(0);
        var year = (d/(1000 * 60 * 60 * 24 * 365)).toFixed(0);

        if (sec < 60) {
            return sec + " Sec";
        } else if (min < 60) {
            return min + " Min";
        } else if (hour < 24) {
            if(hour === '1') return hour + " Hr";
            else return hour + " Hrs";
        } else if (day < 31) {
            if(day === '1') return day + " Day";
            else return day + " days";
        } else if (month < 12) {
            return month + " months";
        } else {
            return year + " Years"
        }
    };
}]);