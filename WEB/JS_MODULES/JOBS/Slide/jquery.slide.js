/**
 * name: slide module, fade & scrollX & scrollY
 * author:yao wang
 * time: 08-05-2014
 * @options:
 * @$container: String, contains child: ([rel=banner]>.banner-list)+([rel=controller]>i)+([rel=arrow]>a.prev+a.next)
 * @effect: fade | scrollX | scrollY
 * p.s.: [rel=banner]的直接子元素没有UL,直接滚动像素
 */
define(function (require, exports, module) {

    //----helpers
    $.extend($.easing, {
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }
    });

    var Slide = function (options) {
        this.options = {
            interval: 3000,
            effect: "fade",
            $container: null,
            autoStart: true,
            isArrowAlwaysShow: false //左右切换箭头是不是Hover事件，hide and show
        };
        this.setting = $.extend({}, this.options, options);
        this.$container = $(this.setting.$container);
        this.$banner = this.$container.find("[rel=banner]");
        this.$controller = this.$container.find("[rel=controller]");
        this.$arrow = this.$container.find("[rel=arrow]");

        this.index = 0;
        this.timer = null;
        this.length = this.$banner.children().length;
        this.con_width = this.$container.width();
        this.con_height = this.$container.height();

        this.init();
    };
    Slide.prototype = {
        constructor: Slide,
        init: function () {
            var that = this;
            that.setting.isArrowAlwaysShow && that.$arrow.show();
            switch (this.setting.effect) {
                case "fade":
                    this.$banner.children().css({
                        position: "absolute",
                        top: 0,
                        left: 0
                    }).first().css("zIndex", 1);
                    break;
                case "scrollX":
                    this.$banner.width(this.con_width * this.length).css({
                        position: "absolute",
                        top: 0,
                        left: 0
                    }).children().width(this.con_width);
                    break;
                case "scrollY":
                    this.$banner.height(this.con_height * this.length).css({
                        position: "absolute",
                        top: 0,
                        left: 0
                    }).children().height(this.con_height);
                    break;
            }

            this.bindEvent();

            this.setting.autoStart && this.startAnimate();
        },
        bindEvent: function () {
            var that = this;
            this.$container.on("mouseenter", function () {
                that.timer && clearInterval(that.timer);
                that.setting.isArrowAlwaysShow || that.$arrow.show();
            }).on("mouseleave", function () {
                that.autoStart && that.startAnimate();
                that.setting.isArrowAlwaysShow || that.$arrow.hide();
            });

            if (this.$controller.length) {
                this.$controller.on("click", "i", function () {
                    var i  = $(this).index();
                    if(i === that.index || that.animated) return;
                    if (that.setting.effect === "fade") {
                        that._doFade(that.index = i);
                    } else if (/^(scrollX|scrollY)$/.test(that.setting.effect)) {
                        var step = i - that.index;
                        that.index = i;
                        that._doMove(step);
                    }
                });
            }

            if (that.$arrow.length) {
                that.$arrow.on("click", "a", function () {
                    if (that.animated || that.length === 1) return; //只有一个tab-list时不切换
                    var step = /prev/.test(this.className) ? -1 : 1;
                    that.index = that.index + step;
                    that.index > that.length -1 && (that.index = 0);
                    that.index < 0 && (that.index = that.length -1);
                    that[that.setting.effect === "fade" ? "_doFade" : "_doMove"](step);

                    return false;
                });
            }

        },
        startAnimate: function () {
            var that = this;
            this.timer = setInterval(function () {
                that.index++;
                that.index > that.length -1 && (that.index = 0);
                that.animated || that.doAnimate();
            }, this.setting.interval);
        },
        doAnimate: function () {
            if (this.setting.effect === "fade") {
                this._doFade();
            } else if (/^(scrollX|scrollY)$/.test(this.setting.effect)) {
                this._doMove(1);
            }
        },
        _doFade: function () {
            this.animated = true;

            this.$banner.children().eq(this.index).stop().animate({opacity:1},200).css("zIndex",1).siblings().animate({opacity:0},200).css("z-index", 0);
            this.$controller.find("i").removeClass("on").eq(this.index).addClass("on");

            this.animated = false;
        },
        _doMove: function (step) {
            this.animated = true;

            var that = this,
                moveDirec = this.setting.effect === "scrollX" ? "left" : "top",
                moveUnit = this.setting.effect === "scrollX" ? this.con_width : this.con_height;
            var animateProp = {};
            if (step < 0) { //向左浏览或向上浏览
                step = Math.abs(step);
                while (step--) {
                    this.$banner.css(moveDirec, "-=" + moveUnit);
                    this.$banner.prepend(this.$banner.children().last());
                }
                animateProp[moveDirec] = 0;
                this.$banner.stop().animate(animateProp, 500, "easeInOutCubic", function () {
                    that.animated = false;
                });
            } else if (step > 0) { //向右浏览或向下浏览
                animateProp[moveDirec] = -step * moveUnit;
                this.$banner.stop().animate(animateProp, 500, "easeInOutCubic", function () {
                    while (step--) {
                        that.$banner.css(moveDirec, "+=" + moveUnit);
                        that.$banner.append(that.$banner.children().first());
                    }
                    that.animated = false;
                });
            }

            this.$controller.find("i").removeClass("on").eq(this.index).addClass("on");
        }
    };

    return Slide;

});