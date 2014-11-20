/**
 * Provider: A provider is an object with a $get() method. The injector calls the $get method to create a new instance of a service. The Provider can have additional methods which would allow for configuration of the provider.
 *
 *from: http://blog.xebia.com/2013/09/01/differences-between-providers-in-angularjs/
 *constant: a value that can be injected everywhere. The value of a constant can never be changed
 *value: a simple injectable value
 *service: an injectable constructor
 *factory: an injectable function
 *decorator: modify or encapsulate other providers except a constant(expection: define in config function)
 *provider:  a configurable factory
 */
angular.module("selfProvider", [])
	.config(function ($provide) {  //provider定义的方法一： 在config里定义，需引入$provider
		$provide.constant("form", "some text never change");
		$provide.value("change", "value");
		$provide.service("jone", function () {
			this.name = "happy";
			this.age = "18";
		});
		$provide.factory("useInfo", function () {
			var someData = new Date();
			return {
				getData: function () {
					return someData;
				}
			};
		});
		/*$provide.decorator("aChange", function ($delegate) { //decorator不能在这个地方定义，得放在config里面
			return $delegate.push.apply($delegate, [1, 2, 3]);
		});*/
	})
	.constant("form1", "asdfsfd") //provider定义的方法二：直接在module后面定义
	.value("value2", "value2")
	.service("jone2", function () {
		this.name = "asdsdf";
	})
	.factory("useInfo2", function () {
		var someData = "asdsdf";
		return {
			get: function () {
				return someData;
			}
		}
	})
	/*.decorator("value2", function ($delegate) { //decorator不能在这个地方定义，得放在config里面
		return $delegate.push(2344);
	})*/
	.provider("movie", function () {
		var movieName = "Tan";
		return {
			setMovie: function (value) {
				movieName = value;
			},
			$get: function () { //
				return {
					movieName: movieName
				}
			}
		};
	});

//实际使用
angular.module("app-provider", ["selfProvider"])
	.config(function ($provide, movieProvider, form1) { //movie本是一个provider,在这里加上了**Provider来引用 | form1可作为constant来注入，但value就不行
		movieProvider.setMovie("Tan2");
        console.log(form1);
		$provide.decorator("value2", function ($delegate) {
			return $delegate + " a modify value";
		});
	})
.controller("providerCtrl", function ($scope, movie, value2) {
	this.movieName = movie;
	this.value2 = value2;
});


angular.element(document).ready(function () {
	var areaProvider = document.getElementById("area-provider");
	angular.bootstrap(areaProvider, ["app-provider"]); //这里有加【】
});