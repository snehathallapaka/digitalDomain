"use strict";
var app = angular.module('lognlink');

app.controller('liveLogController', ['$scope', function ($scope) {
    var socket = io.connect();
    $scope.logs=[];

    function emitEvent() {
        console.log('In emit event');
        socket.emit('message-channel', {message:'Hi from message channel'});
    }

    emitEvent();
    socket.on('newLog', function(data) {
        $scope.logs.push(data);
        $scope.$apply();
        console.log('new log',data.new_val);
    });
}]);
