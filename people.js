/*global angular*/
var myApp = angular.module('myApp', []);
myApp.controller('PeopleController', function($scope, $http){
   var url = 'https://assignment2-andrew7550.c9users.io/listMember';
   $http.get(url).
        then(function(response) {
            $scope.people = response.data.list;
   });
  /* $scope.submit = function() {
        
   };*/
   
});