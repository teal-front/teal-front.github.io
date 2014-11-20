/*
 ** Directive Communication
 * from: https://egghead.io/lessons/angularjs-directive-communication
 */
angular.module("app-directive", [])
    .controller("directiveCtrl", ["$scope", function ($scope) {
    }])
    .directive("country", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {},
            template: "<div>this's country warp.</div>",
            controller: function () {
                this.make = function (msg) {
                    console.log(msg);
                };
            },
            link: function (scope, element, attrs) {
                element.css("color", "#ff33ff");
            }
        }
    })
    .directive("city", function () {
        return {
            restrict: "E",
            priority: 9, //同一元素上指令执行的优先级
            require: "^country",
            controllerAs: "city",
            template: "<span>{{city.cityName}}</span>",
            controller: function () {
                this.cityName = "New York";
                this.make = function (msg) {
                    console.log(msg, "by city directive");
                }
            },
            link: function (scope, element, attrs, countryCtrl) {
                countryCtrl.make("write by city from the countryCtrl");
            }
        }
    })
    .directive("district", function () {
        return {
            restrict: "E",
            require: ["^country", "^city"],
            link: function (scope, element, attrs, ctrls) {
                ctrls[0].make("message1");
                ctrls[1].make("message2");
            }
        }
    });


/**
 * Isolating the $scope From the Directive
 * from: http://tutorials.jenkov.com/angularjs/custom-directives.html
 */
angular.module("app-directive")
    .controller("directiveCtrl", function ($scope) {
        $scope.transcludedHTML = "html";

        $scope.john = {
            name: "john",
            age: "16"
        };
        $scope.sasa = {
            name: "sasa",
            age: "17"
        };
        $scope.send = function () {
            $scope.john.name = "lalala";
        }
    })
/**
 * the compile function and transclude(Wraps Elements)
 * from: http://tutorials.jenkov.com/angularjs/custom-directives.html
 */
    .directive("userinfo", function () {
        return {
            restrict: "E",
            replace: true, // 替换掉自定义标签
            transclude: true, //template里面有ngTransclude的标签会把HTML页面上userinfo里面的内容包进去
            scope: {
                //绑定策略
                user: "=", // 同"=user"    双向绑定上对应的$scope的值
                myUrl: "@", // 同"@=myUrl"  直接引用属性上的值
                method: "&"  // 同"&method" 引用绑定
            },
            template: "<div>name: {{user.name}}, age: {{user.age}},{{myUrl}} <span ng-transclude></span></div>",
            //template: "<div>name: {{user.name}}, age: {{user.age}}, <span ng-transclude>{{transcludeHTML}}</span></div>", //transcludeHTML放这里解析不出来
            compile: function () {
                console.log("as a configuration only run once at every directive.");
                return function linkFunction(scope, element, attrs) {
                    element.css("background", "#ccc");
                };
            }
        };
    });


angular.element(document).ready(function () {
    var areaDirective = document.getElementById("area-directive");
    angular.bootstrap(areaDirective, ["app-directive"]);
});