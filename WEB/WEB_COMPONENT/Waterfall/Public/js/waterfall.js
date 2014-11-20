/**
 * author: yao wang
 * time: 08-01-2014
 * description:async load data as waterfall by scroll the page
 * 多列浮动，列数固定，不随窗口缩放而变化（不是position定位）；
 *
 */
(function ($, context, undefined) {
    "use strict";

    var Waterfall = function (setting) {
        this.options = {
            ajaxURL: "getData.php",
            payloadNum: 6,
            colNum: 3,
            firstPayloadNum: 12,
            $cols: $(".col")
        };

        this.currentIndex = 0; //数据集当前值
        this.scrollTop = 0;
        //this.loadFinish = false; 用来终止加载

        this.setup();
    };
    Waterfall.prototype.setup = function () {
        var that = this;
        this.loader(this.options.firstPayloadNum, this.currentIndex);
        $(window).on("scroll.waterfall", function () {
            var scrollTop = window.scrollY || document.documentElement.offsetTop;
            if (scrollTop - that.scrollTop > 100) {
                that.scrollTop = scrollTop;
                if (that.detectLoad()) {
                    that.loader();
                }
            }
        });
    };
    Waterfall.prototype.detectLoad = function () {
        var min, offsetTopArray = [];
        for (var i = 0, offsetTop; i < this.options.colNum; i++) {
            offsetTop = this.options.$cols.eq(i).height() + this.options.$cols.eq(i).offset().top;
            offsetTopArray.push(offsetTop);
        }
        console.log("offsetTopArray: ", offsetTopArray);
        min = Math.min.apply(null, offsetTopArray);
        console.log(min);
        return min <= this.scrollTop + (window.innerHeight || document.documentElement.clientHeight);
    };
    Waterfall.prototype.loader = function (payloadNum, lastId) {
        var that = this;
        payloadNum = payloadNum || this.options.payloadNum;
        lastId = lastId || this.currentIndex;
        $.get("getData.php", {payloadNum: payloadNum, lastId: lastId}, function (data) {
           if (data.length) {
                var items = that.render(data),
                    index = 0, colNum = that.options.colNum;
               $.each(items, function (index, item) {
                   var col_index = index % colNum;
                   that.options.$cols.eq(col_index).append(item);
               });
               console.log(that.currentIndex);
               that.currentIndex++;
           } else {
               console.log("lastId", that.currentIndex);
               alert("loadFinished");
               $(window).unbind("scroll.waterfall");
           }
        }, "json");
    };
    Waterfall.prototype.render = function (dataList) {
        var template = $("#item-template").html(), ret = [];
        var i = 0, l = dataList.length, item, tmp_template, key, key_re;
        for (; i < l; i++) {
            item = dataList[i];
            tmp_template = template;
            for (key in item) {
                if (item.hasOwnProperty(key)) {
                    key_re = new RegExp("\\${" + key + "}", "mg");
                    tmp_template = tmp_template.replace(key_re, item[key]);
                }
            }
            ret.push(tmp_template);
        }

        return ret;
    };

    context.Waterfall = Waterfall;

})(jQuery, this);