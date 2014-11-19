!function (root, angular) {
    'use strict';

    var service = angular.module("hbk3.service", [])
        .factory('view', ["$interpolate", // $interpolate同Handlebars一样的用法

        function ($interpolate) {
            return {
                selectedHTML: {
                    empty: $interpolate('<span>您选中了 <strong class="c_ba2636">{{num}}</strong> 注，共 <strong class="c_ba2636">{{price}}</strong> 元</span>'),
                    HTML1: $interpolate('<span>您选中了 <strong class="c_ba2636">{{num}}</strong> 注，共 <strong class="c_ba2636">{{price}}</strong> 元<span class="c_727171">若中奖，奖金 <strong class="c_ba2636">{{award}}</strong> 元，盈利 <strong class="c_ba2636">{{gain}}</strong> 元</span></span>'),
                    HTML2: $interpolate('<span>您选中了 <strong class="c_ba2636">{{num}}</strong> 注，共<strong class="c_ba2636">{{price}}</strong>元<span class="c_727171">若中奖，奖金<strong class="c_ba2636">{{award.start}}</strong>至 <strong class="c_ba2636"> {{award.end}}</strong> 元，盈利<strong class="c_ba2636"> {{gain.start}} </strong>至<strong class="c_ba2636"> {{gain.end}} </strong>元</span></span>')
                },
                render: function (template, data) {
                    return template(data);
                }
            };
        }
    ])
        .factory('calcNum', [
        function () {
            var Core = {
                //@return {String}
                random: function (array, num) { //include min and max
                    array = [].slice.call(array);  //!important 下面会有splice方法会改变array的值
                    var ret = "", index;
                    while (num--) {
                        index = Math.floor(Math.random() * array.length);
                        ret += array.splice(index, 1)[0];
                    }
                    return ret;
                },
                blankspaceFormat: function (string) {
                    return String(string).split("").join(" ");
                },
                commaFormat: function (string) {
                    return string.split("").join(",");
                },
                factorial: function (n) {
                    if (n < 1) return new Error("n must after one");
                    var ret = 1;
                    while (n) {
                        ret *= n;
                        n--;
                    }
                    return ret;
                },
                //计算排列, Ank
                math_rank: function (n, k) {
                    return this.factorial(n) / this.factorial(n - k);
                },
                //计算组合, Cnk
                math_combine: function (n, k) {
                    return this.math_rank(n, k) / this.factorial(k);
                }
            };

            return {
                data: {
                    //和值
                    "hezhi": {
                        "name": "和值",
                        "nums": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                        "prices": [240, 80, 40, 25, 16, 12, 10, 9, 9, 10, 12, 16, 25, 40, 80, 240],
                        "calc": function (array) {
                            var ret = {
                                viewData: {num:0,price:0,award:0,gain:0},
                                modelData: {"3tdx": [], "hezhi": {type: "hezhi",name: "和值",value:[],num:0,price:0}}
                            };
                            for (var i = 0, l = array.length, item; i < l; i++) {
                                ret.viewData.num++;
                                ret.viewData.price = ret.viewData.num * 2;

                                item = array[i];
                                if (item == 3 || item == 18) {
                                    ret.modelData["3tdx"].push({
                                        type: "3tdx",
                                        name: "三同号单选",
                                        value: item === 3 ? "1 1 1" : "6 6 6",
                                        num: 1,
                                        price: 2
                                    });
                                } else {
                                    ret.modelData["hezhi"].value.push(item);
                                    ret.modelData["hezhi"].num++;
                                    ret.modelData["hezhi"].price = ret.modelData["hezhi"].num * 2;
                                }
                            }

                            //calc award & gain
                            var award = [], gain = [];
                            if (ret.modelData["3tdx"].length) award.push(240);
                            for (i = 0; i < ret.modelData["hezhi"].num; i++) {
                                item = ret.modelData["hezhi"].value[i];
                                award.push(this.prices[Core.indexOf(this.nums, item)]);
                            }
                            if (award.length) {
                                if (Math.max.apply(Math, award) === Math.min.apply(Math, award)) {
                                    ret.viewData.award = Math.max.apply(Math, award);
                                    ret.viewData.gain = Math.max.apply(Math, award) - ret.viewData.price;
                                } else {
                                    ret.viewData.award = {start: Math.min.apply(Math, award), end:
                                        Math.max.apply(Math, award)};
                                    ret.viewData.gain = {start:Math.min.apply(Math,
                                        award) - ret.viewData.price,end:Math.max.apply(Math, award) - ret.viewData.price};
                                }
                            }
                            var model = ret.modelData["3tdx"];
                            if (ret.modelData["hezhi"].num) model = model.concat([ret.modelData["hezhi"]]);
                            ret.modelData = model;
                            return ret;
                        }
                    },
                    //三同号通选
                    "3ttx": {
                        "name": "三同号通选",
                        "nums": "三同号通选",
                        "prices": 40,
                        "calc": function (array) {
                            var ret = {
                                viewData:{num:1,price:2,award:40,gain:38},
                                modelData:{
                                    type: "3ttx",
                                    name: "三同号通选",
                                    value: "三同号通选",
                                    num: 1,
                                    price: 2
                                }
                            };
                            if (!array.length) ret.viewData.price = ret.viewData.num = 0;
                            return ret;
                        }
                    },
                    //三同号单选
                    "3tdx": {
                        "name": "三同号单选",
                        "prices": 240,
                        "calc": function (array) { //[111, 444, 555]
                            var ret = {viewData: {num:0,price:null,award:this.prices,gain:null}, modelData:[]};
                            for (var i = 0, l = array.length; i < l; i++) {
                                ret.viewData.num++;
                                ret.viewData.price = ret.viewData.num * 2;
                                ret.viewData.gain = ret.viewData.award - ret.viewData.price;

                                ret.modelData.push({
                                    type: "3tdx",
                                    name: "三同号单选",
                                    value: Core.blankspaceFormat(array[i]),
                                    num: 1,
                                    price: 2
                                });
                            }
                            return ret;
                        }
                    },
                    //三不同号
                    "3bt_normal": {
                        "name": "三不同号",
                        "price": 40,
                        "calc": function (array) {
                            var ret = {
                                viewData: {num:0,price:0,award:this.price,gain:0},
                                modelData:{}
                            };
                            var length = array.length;
                            if (length) {
                                ret.viewData.num = length;
                                ret.viewData.price = length * 2;
                                ret.viewData.gain = ret.viewData.award - ret.viewData.price;

                                ret.modelData = {
                                    type: "3bt_normal",
                                    name: "三不同号",
                                    value: array.join(" "),
                                    num: length,
                                    price: length * 2
                                };
                            }
                            return ret;
                        }
                    },
                    "3bt_special": {
                        "name": "三不同号",
                        "price": 40,
                        "calc": function (array) {
                            var array_dan = array[0], array_tuo = array[1];
                            var ret = {
                                viewData: {num:0,price:0,award:this.price,gain:0},
                                modelData:{
                                    type: "3bt_dan",
                                    name: "三不同号"
                                }
                            };
                            var length_dan = array_dan.length, length_tuo = array_tuo.length, length;
                            length = ret.viewData.num = Core.math_combine(length_tuo, length_tuo - length_dan);
                            ret.modelData.num = ret.viewData.num = length;
                            ret.modelData.price = ret.viewData.price = length * 2;
                            ret.viewData.gain = ret.viewData.award - ret.viewData.price;
                            ret.modelData.value = "(" + array_dan.join(" ") + ")" + array_tuo.join(" ");

                            return ret;
                        }
                    },
                    //三连号通选
                    "3ltx": {
                        "name": "三连号通选",
                        "prices": 40,
                        "calc": function () {
                            var ret = {
                                viewData:{num:1,price:2,award:10,gain:8},
                                modelData:{
                                    type: "3ltx",
                                    name: "三连号通选",
                                    value: "三连号通选",
                                    num: 1,
                                    price: 2
                                }
                            };
                            return ret;
                        }
                    },
                    //二同号复选
                    "2tfx": {
                        "name": "二同号复选",
                        "prices": 15,
                        "calc": function (array) { // [11, 33, 44]
                            var ret = {
                                viewData:{num:0,price:0,award:this.prices,gain:0},
                                modelData:{
                                    type: "2tfx",
                                    name: "二同号复选",
                                    value: ""
                                }
                            };
                            for (var i = 0, l = array.length, temp = []; i < l; i++) {
                                temp.push(array[i] + "*");
                            }
                            ret.viewData.price = ret.modelData.price = l * 2;
                            ret.modelData.value = temp.join(",");
                            ret.viewData.num = ret.modelData.num = l;
                            ret.viewData.gain = ret.viewData.award - ret.viewData.price;
                            return ret;
                        }
                    },
                    //二同号单选
                    "2tdx": {
                        "name": "二同号单选",
                        "prices": 80,
                        "calc": function (array) {
                            var array_same = array[0], array_unsame = array[1];
                            var ret = {
                                viewData:{num:0,price:0,award:this.prices,gain:0},
                                modelData:{
                                    type: "2tdx",
                                    name: "二同号单选",
                                    value: ""
                                }
                            };
                            var length_same = array_same.length, length_unsame = array_unsame.length;
                            ret.modelData.num = ret.viewData.num = length_same * length_unsame;
                            ret.modelData.price = ret.viewData.price = length_same * length_unsame * 2;
                            ret.viewData.gain = ret.viewData.award - ret.modelData.price;
                            ret.modelData.value = array_same.join(" ") + "#" + array_unsame.join(" ");
                            return ret;
                        }
                    },
                    //二不同号
                    "2bt_normal": {
                        "name": "二不同号",
                        "prices": 8,
                        "calc": function (array) {
                            var l = array.length,
                                num = Core.math_combine(l, 2),
                                prices = this.prices;
                            var ret = {
                                viewData:{
                                    num: num,
                                    price: num *2,
                                    award: num > 2 ? {start: prices, end:3 * prices} : prices,
                                    gain: num > 2? {start: prices - num * 2, end: 3 * prices- num * 2}: prices - 2
                                },
                                modelData:{
                                    type: "2bt_normal",
                                    name: "二不同号",
                                    value: array.join(" "),
                                    num: num,
                                    price: num * 2
                                }
                            };
                            return ret;
                        }
                    },
                    "2bt_special": {
                        "name": "二不同号",
                        "prices": 8,
                        "calc": function (array) {
                            var danma = array[0], array_tuo = array[1];
                            var num = array_tuo.length, prices = this.prices;
                            var ret = {
                                viewData: {
                                    num: num,
                                    price:num * 2,
                                    award: num > 1 ? {start: prices, end:2 * prices} : prices,
                                    gain: num > 1 ? {start: prices - num * 2, end:2 * prices - num * 2} : prices - num * 2
                                },
                                modelData:{
                                    type: "2bt_special",
                                    name: "二不同号",
                                    value: "(" + danma + ")" + array_tuo.join(" "),
                                    num: num,
                                    price: num * 2
                                }
                            };
                            return ret;
                        }
                    }
                },
                //@return {Array}
                randomChoose: function (type, n, callback) {
                    var ret = [],
                        item;
                    var array1_6 = [1, 2, 3, 4, 5, 6],
                        array4_17 = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                        temp;
                    while (n--) {
                        item = {
                            type: type,
                            name: this.data[type].name,
                            value: "",
                            num: 1,
                            price: 2,
                            random: true
                        };
                        switch (type) { //todo 没写三不同号与二不同号的两种情况
                            case "hezhi":
                                item.value = Core.random(array4_17, 1);
                                break;
                            case "3ttx":
                                item.value = "三同号通选";
                                break;
                            case "3tdx":
                                temp = Core.random(array1_6, 1);
                                item.value = Core.blankspaceFormat(temp + temp + temp);
                                break;
                            case "3bt":
                                item.value = Core.blankspaceFormat(Core.numSort(Core.random));
                                break;
                            case "3ltx":
                                item.value = "三连号通选";
                                break;
                            case "2tfx":
                                temp = Core.random(array1_6, 1);
                                item.value = temp + temp + "*";
                                break;
                            case "2tdx":
                                temp = Core.random(array1_6, 2);
                                item.value = temp[0] + temp[0] + "#" + temp[1];
                                break;
                            case "2bt":
                                item.value = Core.blankspaceFormat(Core.random(array1_6, 2));
                                break;
                        }
                        ret.push(item);
                    }
                    callback(ret);
                }
            }
        }
    ]);

    service.constant("$nodes", {
        $k3_tab: $("#k3_tab"),
        $mainPanels: $("#mainPanels"),
        $listBox: $("#select_list_box").find("dl"),
        $clearBtn: $(".clear_btn"),
        $betNumCount: $(".betNumCount"),
        $betMoneyCount: $(".betMoneyCount"),
        $randomChoose_multi: $(".randomChoose_multi"),
        $randomChoose_one: $(".randomChoose_one"),
        $betting_Btn: $(".betting_Btn"),

        $panl_hz: $("#panl_hz"),
        $betTypeWrap: $(".betTypeWrap")
    });

}(this, angular);