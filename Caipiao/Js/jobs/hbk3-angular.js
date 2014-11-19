var hbk3 = angular.module("hbk3", ["hbk3.service", "hbk3.directive"]);

hbk3.controller("Xuanhao", ["$scope", "$http", "view", "calcNum", "$nodes", function ($scope, $http, view, calcNum, $nodes) {
	$scope.types = ["hezhi", "3ttx", "3tdx", "3bt", "3ltx", "2tfx", "2tdx", "2bt"];
	$scope.navIndex = 2;
	$scope.type = function () {
        if ($scope.navIndex === 3 || $scope.navIndex === 7) {
            return $nodes.$box.find(".betTypeWrap").find("input:checked").val();
        }
		return $scope.types[$scope.navIndex];
	};
	$scope.result = [];
	$scope.store = {
		"hezhi": [],
        "3ttx": [],
        "3tdx": [],
        "3bt_normal": [],
        "3bt_special": [[], []],
        "3ltx": [],
        "2tfx": [],
        "2tdx": [[], []],
        "2bt_normal": [],
        "2bt_special": [[], []]
	};
	$scope._isDoubleRow = function (context, callback1, callback2) {
        //if (this !== $scope) throw new Error("'this' isn't reference to $scope");
        if ($scope.type().match(/(3bt_special|2tdx|2bt_special)/)) {
            callback1.call(context);
        } else {
            callback2.call(context);
        }
    };
    $scope.$watch("navIndex", function (newIndex, oldIndex) { // newValue, oldValue
        console.log(newIndex, oldIndex);
		var li = document.getElementById("k3_tab").querySelectorAll("li");
		li[oldIndex].classList.remove("active");
		li[newIndex].classList.add("active");

        $nodes.$box = $nodes.$mainPanels.find(".betBox").eq(newIndex);
        $nodes.$selectInfo = $nodes.$box.find(".selectInfo");
        $nodes.$betbtn = $nodes.$box.find(".betbtn");
    });
    _.each($scope.store, function (value, key) {
    	if (typeof key !== "string") throw new Error("_.each is use wrong");
        $scope.$watchCollection("store['"+key+"']", function (value) {
            console.log("newValue: ", value);
            var data = calcNum.data[$scope.type()].calc(value),
                template = !data.viewData.num ? view.selectedHTML.empty :
                    typeof data.viewData.gain.start  === "number" ? view.selectedHTML.HTML2 : view.selectedHTML.HTML1;
            $(".selectInfo").eq($scope.navIndex).html(view.render(template, data.viewData));
            $(".betbtn").eq($scope.navIndex).toggleClass("disabled", !data.viewData.num);
        });
    });
    $scope.randomChooseOne = function () {
        calcNum.randomChoose($scope.type(), 1, function (data) {
            $scope.renderResult(data, 1, 2);
        });
    };
    $scope.randomChooseMulti =function (event) {
        var n = +$(event.target).prev().find("input").val();
        calcNum.randomChoose($scope.type(), n, function (data) {
            $scope.renderResult(data, data.length, data.length * 2);
        });
    };
    $scope.menuChange = function () {
        var index = $(this).index();
        $scope.navIndex = index;
        $scope.$digest();
    };
    $scope.switchInnerTab = function () {
        var $this = $(this),
            $gameWrap = $this.closest(".betBox").find(".gameWrap"),
            index = $this.parent().index();
        $gameWrap.hide().eq(index).show();
        //that.type = this.value;
    };
	$scope.chooseNum = function () {
        var $this = $(this),
            active = $this.is(".active"),
            value = $this.data("value");
        if ($scope.type() == "hezhi") {
            if (!active) {
                _.without($scope.store[$scope.type()], value);
            } else {
                $scope.store[$scope.type].push(value);
            }
        } else {
            if (active) {
                $this.removeClass("active"); //与和值的点击事件冲突
                $scope._isDoubleRow($this, function () {
                    if (this.is(".js_ball1")) {
                        $scope.store[$scope.type()][0] =  _.without($scope.store[$scope.type()][0], value);
                    } else {
                        $scope.store[$scope.type()][1] = _.without($scope.store[$scope.type()][1], value);
                    }
                }, function () {
                    $scope.store[$scope.type()] = _.without($scope.store[$scope.type()], value);
                });
            } else {
                $this.addClass("active");
                $scope._isDoubleRow($this, function () {
                    if (this.is(".js_ball1")) {
                        $scope.store[$scope.type()][0].push(value);
                    } else {
                        $scope.store[$scope.type()][1].push(value);
                    }
                }, function () {
                    $scope.store[$scope.type()].push(value);
                });
            }
        }
        $scope.$digest();
        console.log($scope.store[$scope.type()]);
        //todo add judge
        $scope.renderChoose();
	};

    $scope.renderChoose = function () {
        var value = $scope.store[$scope.type()],
            data = calcNum.data[$scope.type()].calc(value),
            template = !data.viewData.num ? view.selectedHTML.empty :
                typeof data.viewData.gain.start  === "number" ? view.selectedHTML.HTML2 : view.selectedHTML.HTML1;
        $nodes.$selectInfo.html(view.render(template, data.viewData));
        $nodes.$betbtn.toggleClass("disabled", !data.viewData.num);
    };
	$scope.confirmChoose = function (e) {
        if ($(this).is(".disabled")) {
            alert("Please choose valid number."); //todo 换成机选
            return;
        }
        $scope.addChoose();
        $scope.emptyChoose.call(this);
	};
    $scope.addChoose = function () {
        console.log($scope.store[this.type]);
        var value = $scope.store[$scope.type()],
            data = calcNum.data[$scope.type()].calc(value);
        this.renderResult(data.modelData, data.viewData.num, data.viewData.price);
    };
    $scope.renderResult = function (data, num, price) { //todo 出现时的fade效果
        if (!$.isArray(data)) data = [data];
        $scope.result.unshift.apply($scope.result, data);
        //$nodes.$listBox.prepend(view.render(view.resultListHTML, data));
        $scope.$digest();
        $nodes.$listBox[0].scrollTop = 0;
        $nodes.$betNumCount.html(+$nodes.$betNumCount.html() + num);
        $nodes.$betMoneyCount.html(+$nodes.$betMoneyCount.html() + price);
    };
    $scope.emptyChoose = function (element) {
        $scope._isDoubleRow(null, function () {
            $scope.store[$scope.type()] = [[], []];
        }, function () {
            $scope.store[$scope.type()] = [];
        });
        $nodes.$betbtn.addClass("disabled");
        $nodes.$selectInfo.html(view.render(view.selectedHTML.empty, {num:0,price:0}));
        (element ? $(element).siblings(".js_ball") : $nodes.$box.find(".js_ball")).removeClass("active");
    };

    $scope.deleteRow = function () {
        var $dd = $(this).closest("dd"), index = $dd.index();
        var num = $scope.result[index].num, price = $scope.result[index].price;
        $dd.remove();
        $scope.result.splice(index, 1);
        $nodes.$betNumCount.html(+$nodes.$betNumCount.html() - num);
        $nodes.$betMoneyCount.html(+$nodes.$betMoneyCount.html() - price);
    };
    $scope.clearBalls = function () {
        //console.log("clearBalls");
        $scope.emptyChoose(this);
    };
    $scope.clearList = function () {
        if (window.confirm("确认删除？")) {
            $nodes.$listBox.empty();
            $nodes.$betMoneyCount[0].innerHTML = $nodes.$betNumCount[0].innerHTML = 0;
            $scope.result = [];
        }
    };
    $scope.buy = function () {
        $http.post("http://localhost:8888/Views/dataHandle.php", $scope.result)
            .success(function (data) {
               console.log("ajax data: ", data);
            })
            .error(function (data) {
                console.log("ajax error");
            });
    }
}]);