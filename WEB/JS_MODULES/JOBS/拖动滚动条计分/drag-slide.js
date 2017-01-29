/**
 * author: yao wang
 * time: 2014/09/09
 * description: 可拖动按钮选择分数、也可以点击状态条来选择
 * use: div[parent] > (input:hidden[value=3] + .slide-bar + .active-slide-bar + (.slide-btn > .slide-num))
 */
;
!function ($, win, undefined) {
    var DragSlide = function (options) {
        options = $.extend({}, DragSlide.fn.setting, options);

        this.$parent = $(options.parent);
        this.$slideActiveBar = this.$parent.find(options.slideActiveBar);
        this.$slideBar = this.$parent.find(options.slideBar);
        this.$slideBtn = this.$parent.find(options.slideBtn);
        this.$slideNum = this.$parent.find(options.slideNum);
        this.$input = this.$parent.find("input");

        this.callback = options.callback || $.noop;

        this.parentOffsetLeft = this.$parent.offset().left;
        this.steps = (options.max - options.min) / options.step; //最小值到最大值之间的步数
        this.stepWidth = this.$parent.width() / this.steps; //上面所算每一步的宽度
        this.detectWidth = this.stepWidth / 2; //按钮移动的最小距离
        this.spaceWidth = options.halfWidthOfSlideBtn ? this.$slideBtn.width() / 2 : this.$slideBtn.width(); //按钮距离父元素边距的碰撞值

        this.init();
        this.bindEvent();
    };
    DragSlide.fn = DragSlide.prototype;
    DragSlide.fn.setting = {
        parent: null, //包裹的父元素
        slideBar: ".slide-bar",  //状态条
        slideActiveBar: ".active-slide-bar", //已选择部分的状态条or拖动按钮的左边部分
        slideBtn: ".slide-btn", //拖动按钮
        slideNum: ".slide-num", //对应的数字
        halfWidthOfSlideBtn: true, //拖动按钮在最左边时left值是否为0还是宽度的一半
        step: 5, //数字间的间隔
        min: 1, //最小值
        max: 10, //最大值
        callback: $.noop //context: null, a.k. ajax num
    };

    DragSlide.fn.init = function () {
        var num = +this.$input[0].value;
        this._render(num, true);
    };
    DragSlide.fn.bindEvent = function () {
        var that = this;
        var slideActiveBar = this.$slideBtn[0];
        this.drag.call(this, slideActiveBar);

        this.$slideBar.click(function (e) {
            var num = that._calcPosition.call(this, e, that);
            that._render(num);
        });
        this.$slideActiveBar.click(function (e) {
            var num = that._calcPosition.call(this, e, that);
            that._render(num);
        });

        //在页面加载完成后初始化
        /*$(function() {
         that.init();
         });*/
    };
    DragSlide.fn.drag = function (oDrag) {
        var that = this;
        oDrag.onmousedown = function (e) {
            e = e || event;
            var x = e.clientX - this.offsetLeft;

            document.onmousemove = function (e) {
                e = e || window.event;
                var curLeft = parseInt(oDrag.style.left),
                    dragLeft = e.clientX - x,
                    direction = dragLeft - curLeft;
                if (Math.abs(direction) >= that.detectWidth) {
                    var num = +that.$slideNum.html();
                    if (num === 1 && direction < 0 || num === 10 && direction > 0) {
                        return false;
                    }
                    direction < 0 ? num-- : num++;

                    that._render(num);
                }
                return false;
            };

            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
            if (e.preventDefault) e.preventDefault();
            if (e.returnValue) e.returnValue = false;
            return false;
        };
    };
    DragSlide.fn._calcPosition = function (e, that) {
        var deltaX = e.clientX - that.parentOffsetLeft;
        return Math.round(deltaX / that.stepWidth) + 1;
    };
    DragSlide.fn._render = function (num, isInit) {
        var that = this;

        var field = that.$parent.find("input")[0];
        field.value = num;

        this.$slideNum.html(num);
        this.$slideActiveBar.width(function () {
            return (num - 1) / that.steps * 100 + "%";
        });
        this.$slideBtn.css("left", function () {
            return (num - 1) * that.$parent.width() / that.steps - that.spaceWidth;
        });

        !isInit && that.callback.call(null, num);
    };

    win.DragSlide = DragSlide;

}(jQuery, window);