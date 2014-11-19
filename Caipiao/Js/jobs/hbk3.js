/**
 * @author: yaowang
 * @time: 2014/10/17
 * @description: http://caipiao.163.com/order/preBet_hbkuai3.html
 */
!function ($, handlebars, _, Core) {
    var Model = function () {
        this.result = [];
        this.store = {
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
    };
    Model.prototype = {
        constructor: Model,
        //@return {Array}
        randomChoose: function (type, n, callback) {
            var ret = [], item;
            var array1_6 = [1, 2, 3, 4, 5, 6],
                array4_17 = [4, 5, 6 ,7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                temp;
            while (n--) {
                item = {type: type, name: this.data[type].name, value: "", num: 1, price: 2, random: true};
                switch (type) { //todo 没写三不同号与二不同号的两种情况
                    case "hezhi":
                        item.value = Core.random(array4_17, 1);break;
                    case "3ttx":
                        item.value = "三同号通选";break;
                    case "3tdx":
                        temp = Core.random(array1_6, 1);
                        item.value = Core.blankspaceFormat(temp + temp + temp);
                        break;
                    case "3bt":
                        item.value = Core.blankspaceFormat(Core.numSort(Core.random));break;
                    case "3ltx":
                        item.value = "三连号通选";break;
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
    };
    Model.prototype.data = {
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
    };

    var View = function (model) {
        this.model = model;

        this.selectedHTML = {
            empty: Handlebars.compile('<span>您选中了 <strong class="c_ba2636">{{num}}</strong> 注，共 <strong class="c_ba2636">{{price}}</strong> 元</span>'),
            HTML1: Handlebars.compile('<span>您选中了 <strong class="c_ba2636">{{num}}</strong> 注，共 <strong class="c_ba2636">{{price}}</strong> 元<span class="c_727171">若中奖，奖金 <strong class="c_ba2636">{{award}}</strong> 元，盈利 <strong class="c_ba2636">{{gain}}</strong> 元</span></span>'),
            HTML2: Handlebars.compile('<span>您选中了 <strong class="c_ba2636">{{num}}</strong> 注，共<strong class="c_ba2636">{{price}}</strong>元<span class="c_727171">若中奖，奖金<strong class="c_ba2636">{{award.start}}</strong>至 <strong class="c_ba2636"> {{award.end}}</strong> 元，盈利<strong class="c_ba2636"> {{gain.start}} </strong>至<strong class="c_ba2636"> {{gain.end}} </strong>元</span></span>')
        };
        this.resultListHTML = Handlebars.compile('{{#each this}}<dd><span class="type">{{name}}</span><span class="nums"><strong class="c_ba2636">{{value}}</strong></span><span class="edit"><a class="betDel" rel="betPoolAct">删除</a></span><span class="sum">{{price}}元</span></dd>{{/each}}');
    };
    View.prototype = {
        constructor: View,
        render: function (template, data) {
            return template(data);
        }
    };
    var Controller = function (model, view, subController) {
        this.model = model;
        this.view = view;
        this.types = ["hezhi", "3ttx", "3tdx", "3bt", "3ltx", "2tfx", "2tdx", "2bt"];
        this.bindElement();
        this.bindEvent();
        for (var subCtrl in subController) {
            if (subController.hasOwnProperty(subCtrl)) {
                this[subCtrl] = subController[subCtrl];
                this[subCtrl].call(this);
            }
        }
        this.init();
    };
    Controller.prototype = {
        constructor: Controller,
        bindElement: function () {
            this.$k3_tab = $("#k3_tab");
            this.$mainPanels = $("#mainPanels");
            this.$listBox = $("#select_list_box").find("dl");
            this.$clearBtn = $(".clear_btn");
            this.$betNumCount = $(".betNumCount");
            this.$betMoneyCount = $(".betMoneyCount");
            this.$randomChoose_multi = $(".randomChoose_multi");
            this.$randomChoose_one = $(".randomChoose_one");
            this.$betting_Btn = $(".betting_Btn");

            this.$panl_hz = $("#panl_hz");
            this.$betTypeWrap = $(".betTypeWrap");
        },
        init: function () {
            var that = this;
            this.$k3_tab.find("li").each(function (i) {
                this.setAttribute("name", that.types[i]);
            });
            this.$k3_tab.find("li").eq(7).trigger("click");
        },
        bindEvent: function () {
            var that = this;
            //tab switch
            this.$k3_tab.on("click", "li", function () {
                var $this = $(this),
                    $siblings = $this.parent().find("li"),
                    index = $this.index(),
                    $content = $("#mainPanels").find(".betBox");
                $siblings.removeClass("active");
                $this.addClass("active");
                $content.hide().eq(index).show();
                that.$box = that.$mainPanels.find(".betBox").eq(index);//todo 没考虑子选项卡
                that.$selectInfo = that.$box.find(".selectInfo");
                that.$betbtn = that.$box.find(".betbtn");
                that.type = this.getAttribute("name");
                if (that.type.match(/(2bt|3bt)/)) {
                    that.type = that.$box.find(".betTypeWrap").find("input:checked").val();
                }
                console.log("type: ", that.type);
            });
            //inner tab
            this.$betTypeWrap.on("click", "input", function () {
                  var $this = $(this),
                      $gameWrap = $this.closest(".betBox").find(".gameWrap"),
                      index = $this.parent().index();
                    $gameWrap.hide().eq(index).show();
                that.type = this.value;
            });
            //choose num
            this.$mainPanels.on("click", ".js_ball", function () {
                var $this = $(this),
                    active = $this.is(".active"),
                    value = $this.data("value");
                if (that.type == "hezhi") {
                    if (!active) {
                        Core.without(that.model.store[that.type], value);
                    } else {
                        that.model.store[that.type].push(value);
                    }
                } else {
                    if (active) {
                        $this.removeClass("active"); //与和值的点击事件冲突
                        that._isDoubleRow(this, function () {
                            if ($this.is(".js_ball1")) {
                                Core.without(that.model.store[that.type][0], value);
                            } else {
                                Core.without(that.model.store[that.type][1], value);
                            }
                        }, function () {
                            Core.without(that.model.store[that.type], value);
                        });
                    } else {
                        $this.addClass("active");
                        that._isDoubleRow(this, function () {
                            if ($this.is(".js_ball1")) {
                                that.model.store[that.type][0].push(value);
                            } else {
                                that.model.store[that.type][1].push(value);
                            }
                        }, function () {
                            that.model.store[that.type].push(value);
                        });
                    }
                }
                console.log(that.model.store[that.type]);
                //todo
                //add judge
                that.judge(function () {
                    //renderChoose
                    that.renderChoose.call(that);
                });
            });
            //confirm choose
            this.$mainPanels.on("click", ".betbtn", function () {
                 if ($(this).is(".disabled")) {
                    alert("Please choose valid number."); //todo 换成机选
                    return;
                 }
                that.addChoose();
                that.emptyChoose();
            });
            //删除选号结果单列
            this.$listBox.on("click", ".betDel", function () { //todo animate
                var $dd = $(this).closest("dd"), index = $dd.index();
                var num = that.model.result[index].num, price = that.model.result[index].price;
                $dd.remove();
                that.model.result.splice(index, 1);
                that.$betNumCount.html(+that.$betNumCount.html() - num);
                that.$betMoneyCount.html(+that.$betMoneyCount.html() - price);
            });
            //清空选号区
            this.$mainPanels.on("click", ".clearBalls", function () {
                that.emptyChoose(this);
            });
            //清空输出列表
            this.$clearBtn.click(function () {
               if (window.confirm("确认删除？")) {
                   that.$listBox.empty();
                   that.$betMoneyCount[0].innerHTML = that.$betNumCount[0].innerHTML = 0;
                   that.model.result = [];
               }
            });
            //单选一个
            this.$randomChoose_one.click(function () {
                that.model.randomChoose(that.type, 1, function (data) {
                    that.renderResult(data, 1, 2);
                });
            });
            //单选多个
            that.$randomChoose_multi.click(function () {
                var n = +$(this).prev().find("input").val();
                that.model.randomChoose(that.type, n, function (data) {
                    that.renderResult(data, data.length, data.length * 2);
                });
            });
            //立即投注
            this.$betting_Btn.click(function () {
                if (!that.model.result.length) {
                    if (window.confirm("至少选择1注号码才能投注，是否机选1注碰碰运气？")) {
                        that.$randomChoose_one.click();
                    } else {
                        return;
                    }
                }
                if (true) { //login?
                    console.log(that.model.result);
                }
            });
        },
        judge: function (callback) {
            var isOk = true;
            if (isOk) {
                callback.call(this);
            }
        },
        //点击数字按钮之后
        renderChoose: function () {
            var value = this.model.store[this.type],
                data = this.model.data[this.type].calc(value),
                template = !data.viewData.num ? this.view.selectedHTML.empty :
                    typeof data.viewData.gain.start  === "number" ? this.view.selectedHTML.HTML2 : this.view.selectedHTML.HTML1;
            this.$selectInfo.html(this.view.render(template, data.viewData));
            this.$betbtn.toggleClass("disabled", !data.viewData.num);
        },
        //确认选中和机选之后
        renderResult: function (data, num, price) { //todo 出现时的fade效果
            if (!$.isArray(data)) data = [data];
            this.model.result.unshift.apply(this.model.result, data);
            this.$listBox.prepend(this.view.render(this.view.resultListHTML, data));
            this.$listBox[0].scrollTop = 0;
            this.$betNumCount.html(+this.$betNumCount.html() + num);
            this.$betMoneyCount.html(+this.$betMoneyCount.html() + price);
        },
        addChoose: function () {
            console.log(this.model.store[this.type]);
            var value = this.model.store[this.type],
                data = this.model.data[this.type].calc(value);
            this.renderResult(data.modelData, data.viewData.num, data.viewData.price);
        },
        //确认选中之后复原选区
        emptyChoose: function (element) {
            this._isDoubleRow(this, function () {
                this.model.store[this.type] = [[], []];
            }, function () {
                this.model.store[this.type] = [];
            });
            this.$betbtn.addClass("disabled");
            this.$selectInfo.html(this.view.render(this.view.selectedHTML.empty, {num:0,price:0}));
            (element ? $(element).siblings(".js_ball") : this.$box.find(".js_ball")).removeClass("active");
        },
        _isDoubleRow: function (context, callback1, callback2) {
            if (this.type.match(/(3bt_special|2tdx|2bt_special)/)) {
                callback1.call(context);
            } else {
                callback2.call(context);
            }
        }
    };

    //和值单独的Controller
    var hezhiController = function () {
            var map = {
                    "xiao":[3, 4, 5, 6, 7, 8, 9, 10],
                    "dan": [3, 5, 7, 9, 11, 13, 15, 17],
                    "shuan": [4, 6, 8, 10, 12, 14, 16, 18],
                    "da": [11, 12, 13, 14, 15, 16, 17, 18],
                    "xiao_dan": [3, 5, 7, 9],
                    "xiao_shuan": [4, 6, 8, 10],
                    "da_dan": [11, 13, 15, 17],
                    "da_shuan": [12, 14, 16, 18]
                },
                typeMap = {
                    "0": "xiao",
                    "1": "dan",
                    "2": "shuan",
                    "3": "da",
                    "01": "xiao_dan",
                    "02": "xiao_shuan",
                    "13": "da_dan",
                    "23": "da_shuan"
                };
            var that = this;
            this.$panl_hz.on("click", ".assistBtn", function () {
                var $this = $(this),
                    $btns = $this.parent().find("em"),
                    index = $btns.index($this),
                    $balls = that.$panl_hz.find(".js_ball");
                var mutexMap = {0: 3, 3: 0, 1: 2, 2: 1},
                    mutexIndex = mutexMap[index], result = [], type = "";
                $btns.eq(mutexIndex).removeClass("active");
                $this.toggleClass("active");
                $btns.each(function () {
                    if ($(this).is(".active")) {
                        type += $btns.index(this);
                    }
                });
                result = _.extend([],map[typeMap[type]] || []); //有可能“小单双大”都没选，此时result为undefined //对map[typeMap[type]]只能复制过去，而不能引用，否则后面的计算会改变它的值

                $balls.removeClass("active");
                _.each(result, function (value) {
                    $balls.eq(value - 3).addClass("active");
                });
                that.model.store[that.type] = result;
                that.renderChoose();
            });
            this.$panl_hz.on("click", ".js_ball", function () {
                var result = [], type = "",
                    $balls = $(this).parent().find(".js_ball");
                var $btns = that.$panl_hz.find(".assistBtn");
                $(this).toggleClass("active");
                $balls.each(function (i, node) {
                    var $node = $(node);
                    if ($node.is(".active")) {
                        result.push($node.data("value"));
                    }
                });
                _.each(map, function (value, key) {
                    if (_.isEqual(value, result)) {
                        type = key;
                        return false;
                    }
                });
                if (type != "") {
                    _.each(typeMap, function (value, key) {
                        if (value === type) {
                            type = key;
                            return false;
                        }
                    });
                }
                type = type.split("");
                $btns.removeClass("active");
                if (type.length) {
                    _.each(type, function (elem) {
                        $btns.eq(elem).addClass("active");
                    });
                }
            });
            this.$panl_hz.on("click", ".betbtn", function () {
                that.$panl_hz.find(".assistBtn").removeClass("active");
            });
    };

    var Hbk3 = function () {
        this.model = new Model();
        this.view = new View(this.model);
        this.subController = {
            hezhiController: hezhiController
        };
        this.controller = new Controller(this.model, this.view, this.subController);
    };

    window.hbk3 = new Hbk3();
}(jQuery, Handlebars, _,  window.Core);
