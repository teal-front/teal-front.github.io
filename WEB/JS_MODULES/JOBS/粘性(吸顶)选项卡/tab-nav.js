/**
 * author: yao wang
 * date: 07-29-2014
 * name: 粘性菜单 Sticky Navigation
 * description:用于tab式菜单，带有锚点，可自动吸顶
 * #49行：当菜单复原时，删除掉A上的选中效果。以免用户直接点击置顶按钮，A上的选中效果变化跟不上
 * use:
    a.act-select {}
    tag{oNav}.act-fixed {}
 */
define(function (require, exports, module) {
    var TabNav = function (oNav) {
        this.oNav = oNav;
        this.EXTRA_OFFSET = 20;  //$(this.oNav.parentNode).outerHeight(true);
        this.anchors = this.oNav.getElementsByTagName("a"); //tab菜单中的a标签
        this.targets = []; //锚点元素
        this.length = this.anchors.length;
        this.scrollTops = {}; //store element scrollTop

        this.init();
        this.bindEvent();

        $(window).trigger("scroll.tabNav");
    };
    TabNav.prototype.init = function () {
        for (var i = 0, l = this.anchors.length; i < l; i++) {
            this.targets.push(document.getElementById(this.anchors[i].hash.slice(1)));
        }

        this.scrollTops.nav = $(this.oNav).offset().top;
        this.scrollTops.targets = [];
        for (i = 0, l = this.targets.length; i < l; i++) {
            this.scrollTops.targets.push($(this.targets[i]).offset().top);
        }
    };
    TabNav.prototype.bindEvent = function () {
        var that = this;

       /* $(this.oNav).on("click", "a", function (e){
            e.preventDefault();
            var index = $(this.parentNode).index();
            $(window).scrollTop(function () {
                return that.scrollTops.targets[index] - that.EXTRA_OFFSET;
            });
        });*/

        $(window).on("scroll.tabNav", function () {
            var wScrollTop = $(window).scrollTop();
            if (wScrollTop < that.scrollTops.nav) {
                $(that.oNav).removeClass("act-fixed").find("a").removeClass("act-select");
            } else if (wScrollTop >= that.scrollTops.nav) {
                $(that.oNav.parentNode).height($(that.oNav).height());
                $(that.oNav).addClass("act-fixed");
            }
            var l = that.scrollTops.targets.length;
            while (l--) {
                if (wScrollTop >= that.scrollTops.targets[l]) {
                    that._switchLinkStyle(l);console.log("in while");
                    return;
                }
            }
        });
    };
    TabNav.prototype._switchLinkStyle = function (index) {
        $(this.oNav).find("a").removeClass("act-select").eq(index).addClass("act-select");
    };

    return TabNav;
});

