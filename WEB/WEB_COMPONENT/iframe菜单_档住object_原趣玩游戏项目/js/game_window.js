/**
 * Created by wang yao on 14-4-23.
 */
$(function () {
	//
	document.domain = ZM.domain;

    //------bind elements------------
    var oIframe = document.getElementById("game-iframe"),
        w = oIframe.contentWindow,
        $toolbar = $("#toolbar"),
        $toolbarHandle = $("#toolbar_handle"),
        $gameList = $("#game_list"),
        $signIn = $("#signIn"),
        $jifen = $("#jifen"),
        $jftips = $("#jftips"),
        winResizeTimer = null,// in window resize handleEvent
        currentDirection = document.documentElement.clientWidth > 1000 ? "hor" : "ver"; //horizontal or vertical
    oIframe.src = ZM.gameIframeURL;
    //oIframe.src = 'http://dock.wan.360.cn/game_login.php?server_id=S474&src=loginhistory&gamekey=nsol';

    //----------initialize-----------
    //initialize nav
    new Nav("#nav", ".pop_link");

    //initialize toolbar direction
    if (currentDirection === "ver") {
        $toolbar.addClass("toolbar_mini");
    }

    //------bind event---------------
    //window resize
    oIframe.resize = function (fullScreen) {
        var height = fullScreen ? $(window).height() :
                $(window).height() - $toolbar.outerHeight(),
            width = document.documentElement.clientWidth;
        $(this).css({height: height, width: width});
    };
    $(window).resize(function () {
        //clearTimeout(winResizeTimer);
        //winResizeTimer = setTimeout(function () {
        var wWidth = document.documentElement.clientWidth;
        if (wWidth < 1000) {
            $(".iframe-layout, .popbox").hide();
            w.layout.remove();
            $toolbar.addClass("toolbar_mini").removeClass("toolbar_mini_hidden");
            oIframe.resize(true);
            currentDirection = "ver";
            $toolbar.css("right", 0);
            toggleToolbar();
        } else if (wWidth >= 1000) {
            $(".iframe-layout, .popbox").hide();
            w.layout.remove();
            $toolbar.removeClass("toolbar_mini toolbar_mini_hidden");
            oIframe.resize(false);
            currentDirection = "hor";
            $toolbar.css("right", 0);
        }
        //}, 10);
    });
    //iframe load
    $(oIframe).load(function () {
        $(window).trigger("resize");
    });

    //collapse mini toolbar
    $toolbarHandle.click(function () {
        toggleToolbar();
    });


    //-------------helpers----------------
    //点击菜单时，根据菜单位置创建Iframe元素遮挡object.
    function Nav(pSelector, cSelector) {
        var that = this;

        this.$parent = $(pSelector);

        this.$parent.on("click", cSelector, function () {
            that.openList.call(this, that);
        });
        this.$parent.on("click", ".close", function () {
            that.closeList.call(this, that);
        });

        //在构造函数里定义Prototype
        if (typeof Nav.openList !== "function") {
            Nav.prototype.openList = function (that) {
                var $this = $(this),
                    popId = $this.attr("pop"),
                    $Pop = $("#" + popId);
                if ($Pop.is(":visible")) {
                    $Pop.find(".close").trigger("click");
                    return;
                }
                var position = {
                    width: $Pop.outerWidth(),
                    height: $Pop.outerHeight()
                };
                $(".popbox").hide();
                position.left = currentDirection === "ver" ? -position.width : 0;
                $Pop.css("left", position.left).show();
                position.iLeft = $Pop.offset().left;//游戏页面中里的iframe的left
                position.iTop = currentDirection === "ver" ? $Pop.offset().top : "auto";//游戏页面中里的iframe的top
                position.iBottom = currentDirection === "ver" ? "auto" : 0;

                //show iframe layout
                that._openRelMask.call(this, position);
            };
        }
        if (typeof Nav._openRelMask !== "function") {
            Nav.prototype._openRelMask = function (position) {
                var iF = document.createElement("iframe");
                iF.scrolling = "no";
                iF.frameborder = "0";
                iF.className = "iframe-layout";
                iF.allowtransparency = "true";
                for (var name in position) {
                    iF.style[name] = position[name] + "px";
                }
                $(".iframe-layout").remove();
                $(this).after(iF);

                //iframe里面的layout
                position.left = position.iLeft;
                position.top = position.iTop;
                position.bottom = position.iBottom;
                w.layout.create(position);
            };
        }
        if (typeof Nav._openRelMask !== "function") {
            Nav.prototype.closeList = function () {
                $(this).closest(".popbox").hide();
                $(".iframe-layout").remove();
                w.layout.remove();
            };
        }
    }

    function toggleToolbar() {
        var isHide = $toolbar.is(".toolbar_mini_hidden"),
            value = isHide ? "0px" : "-103px";
        /* $toolbar.animate({"right": value}, 700, "easeOutQuint", function () {
            $toolbar.toggleClass("toolbar_mini_hidden");
        });*/
        $toolbar.toggleClass("toolbar_mini_hidden").css("right", value);
    }
});