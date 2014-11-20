angular.module("app-animate", ["ngAnimate"])  //这里要引入模块
.controller("animateCtrl", function () {})
.animate(".toggle", function () {
	return {
		enter: function (element, done) {
			element.text("Yay, I'm alive!");
			element.width(500);
		},
		leave: function (element, done) {
			element.text("Nooooo!!!");
			element.width(100);
		}
	}
});

angular.element(document).ready(function () {
	var areaAnimate = document.getElementById("area-animate");
	angular.bootstrap(areaAnimate, "app-animate");
});