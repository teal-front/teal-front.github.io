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

    //initialize text slide bar
    if ($('#slide').find("li").length) {
        new ZM.fn.TextSlide($('#slide')[0]).start();
    }

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

    //nav hover
    $toolbar.on("mouseenter", ".nav_list",function () {
        $(this).addClass("nav_list_hover");
    }).on('mouseleave', ".nav_list", function () {
            $(this).removeClass("nav_list_hover");
        });

    //delete relative game log
    $gameList.on("mouseenter", "li",function () {
        $(this).find(".remove").show();
    }).on("mouseleave", "li",function () {
            $(this).find(".remove").hide();
        }).on("click", ".remove", function () {
            var $li = $(this).closest("li"),
                id = $li.data("id");
            $.post(ZM.removeNewestGameURL, {id: id}, function (d) {
                if (d.status) {
                    $li.remove();
                }
            }, "json");
        });

    //link hover
    $toolbar.on("mouseenter", ".close",function () {
        $(this).addClass("orange");
    }).on("mouseleave", ".close", function () {
            $(this).removeClass("orange");
        });
    $gameList.on("mouseenter", ".game_link",function () {
        $(this).children().addClass("underline");
    }).on("mouseleave", ".game_link", function () {
            $(this).children().removeClass("underline");
        });

    //点击游戏礼包
    $("#nav_link_gift").one("click", function () {
        var pageURL = location.href,
            urlPairs = pageURL.match(/\/game_id\/(\d+)\/server_id\/(\d+)/);
        if (urlPairs === null) {return;}
        new Image().src = ZM.gameWindowsendGiftURL + "?game_id=" + encodeURIComponent(urlPairs[1]) + "&server_id=" + encodeURIComponent(urlPairs[2]);
    });

    //copy card number
    !function () {
        if ($(".copy").length) {
            ZeroClipboard.setDefaults({
                moviePath: ZM.JSURL + "ZeroClipboard.swf",
                hoverClass: "underline"
            });
            new ZeroClipboard($(".copy")).on('complete', function () {
                $('.copy-success').fadeIn(200).fadeOut(1400);
            });
        }
    }();

    //签到
    $signIn.click(function () {
        var that = this;
        if (this.signed) {
            return;
        }
        $.ajax({
            type: "POST",
            url: ZM.qdChargeURL,
            dataType: "json"
        }).done(function (data) {
                if (data.status) {
                    that.signed = true;
                    $jifen.text(data.data.total);
                    $jftips.animate({
                        bottom: 24,
                        opacity: 'show'
                    }, 500).fadeOut();
                    $signIn.html("已签到");
                    $(window).trigger("honor", [eval("(" + (data.honorList) + ")")]);
                }
            });
    });


    //-------------helpers----------------
    function Nav(pSelector, cSelector) {
        var that = this;

        this.$parent = $(pSelector);

        this.$parent.on("click", cSelector, function () {
            that.openList.call(this, that);
        });
        this.$parent.on("click", ".close", function () {
            that.closeList.call(this, that);
        });

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