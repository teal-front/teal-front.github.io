/**
 * Created by wang yao on 14-4-29.
 * for: game_window.js
 */
window.ZM || (window.ZM = {});
ZM.fn || (ZM.fn = {});

//add jQuery easing
$.extend($.easing, {easeOutSine: function (x, t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}, easeOutQuint: function (x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
}});

/**
 * 文字滚动
 */
void function ($) {
    var TextSlide = function ($cont, setting) {
        this.$cont = $cont;
        this.$li = this.$cont.getElementsByTagName('li');
        this.length = this.$li.length + 1;
        this.index = 0;
        this._initStatus = false;
        this.opt = {
            time: 3000,
            auto: true,
            diff: this.$li[0].offsetHeight || 39,
            direction: 'top'
        };
        this._extend(setting);
        this._timer = '';
        this._eventTime = '';
        this.timer = '';
        this.$cont.style[this.opt.direction] = '0px';
    };
    TextSlide.prototype = {
        _extend: function (obj1, obj2) {
            if (arguments.length === 1) {
                obj2 = obj1;
                obj1 = this.opt;
            }
            for (var key in obj2) {
                obj1[key] = obj2[key];
            }
        },
        _tween: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        _init: function (callbak) {
            if (!this._initStatus) {
                var $new = this.$li[0].cloneNode(true),
                    me = this;
                this.$cont.appendChild($new);
                this.$cont.onmouseover = function () {
                    me.stop();
                    clearTimeout(me._eventTime);
                };
                this.$cont.onmouseout = function () {
                    me._eventTime = setTimeout(function () {
                        me.start();
                    }, 200);
                };
                this._initStatus = true;
            }
            setTimeout(function () {
                callbak.call(me);
            }, 0);
        },
        _animate: function (i) {
            var direction = this.opt.direction,
                me = this,
                diff = this.opt.diff;
            clearTimeout(this._timer);
            this._timer = null;
            if (i < 0) {
                i = this.length - 1;
            }
            if (i > this.length - 1) {
                i = 1;
            }
            if (i === this.index) {
                return false;
            }
            if (typeof this.opt.startCallbak === 'function') {
                this.opt.startCallbak.call(this, this.index, i);
            }
            if (this.index >= this.length - 1) {
                this.$cont.style[direction] = '0px';
                this.index = 0;
            }
            var t = 0,
                b = parseInt(this.$cont.style[direction]),
                c = -(i - this.index) * diff,
                d = 20;
            this.index = i;
            (function () {
                if (t < d) {
                    t++;
                    me.$cont.style[direction] = Math.ceil(me._tween(t, b, c, d)) + "px";
                    me._timer = setTimeout(arguments.callee, 1000 / 30);
                } else {
                    me.$cont.style[direction] = b + c + "px";
                    clearTimeout(me._timer);
                    me._timer = null;
                    if (typeof me.opt.endCallbak === 'function') {
                        me.opt.endCallbak.call(this);
                    }
                }
            })();
        },
        next: function () {
            this._animate(this.index + 1);
        },
        prev: function () {
            this._animate(this.index - 1);
        },
        auto: function () {
            var me = this;
            this.timer = setTimeout(function () {
                me._animate(me.index + 1);
                me.timer = setTimeout(arguments.callee, me.opt.time);
            }, this.opt.time);
        },
        start: function () {
            var me = this;
            this._init(function () {
                if (me.opt.auto) {
                    me.auto();
                }
            });
        },
        stop: function () {
            this.mouseover = true;
            clearTimeout(this.timer);
        }
    };
    ZM.fn.TextSlide = TextSlide;
}(jQuery);
