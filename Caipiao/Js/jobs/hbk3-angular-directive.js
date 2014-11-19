!function (angular, _, $) {
    'use strict';
    angular.module("hbk3.directive", [])
        .directive("myDelegateObject", function () {
            return function (scope, element, attrs) {
                var eventObj = angular.fromJson(attrs.myDelegateObject),
                    selectors = eventObj.selectors,
                    fns = _.map(eventObj.handlers, function (value) {
                        return scope[value];
                    }),
                    eventTypes = eventObj.events;
                element = element.jquery ? element : $(element);
                for (var i = 0, l = selectors.length; i < l; i++) {
                    element.on(eventTypes[i], selectors[i], (function (i) {
                        return function (e) {
                            fns[i].call(this, e);
                        };
                    })(i));
                }
                console.log("directive link run times");
                element.removeAttr("myDelegateObject");
            };
        })
        .directive("sometag", function () {
            return {

                restrict: "A",
                template: function () {
                    return 1;
                }
            }
        })
        ;
}(angular, _, jQuery);
