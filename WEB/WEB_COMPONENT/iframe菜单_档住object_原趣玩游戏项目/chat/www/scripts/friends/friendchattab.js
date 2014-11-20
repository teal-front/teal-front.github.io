/**
 * Created by Administrator on 14-5-12.
 */
;define(function (require, exports, module) {
    var $ = require("jquery");
    $ = require("jquery-tmpl");

    var Model = function (data) {
        this.data = data.friendsList;
    };

    var View = function (model) {
        this.model = model;

        this.$friendChatList = $("#friendChatList");
        this.$friendChatListTemplate = $("#friendChatListTemplate").html();
        this.$maxChatWarn = $("#maxChatWarn");
    };
    View.prototype.renderFriendChatList = function (data) {
        $.tmpl(this.$friendChatListTemplate, data).appendTo(this.$friendChatList);
    };
    View.prototype.switchFriendChat = function (id) {
        var idArr = this.$friendChatList.data("idArr"),
            index = $.inArray(id, idArr);
        this.$friendChatList.find("li").removeClass("li-hover").eq(index).addClass("li-hover");
        //世界频道关闭Active状态

    };
    View.prototype._addFriendChat = function (data) {
        if (this._countChatNum() === 5) {
            this._warnMaxChatNum();
        } else {
            this.$friendChatList.append(this.renderFriendChatList(data));
        }
    };
    View.prototype._warnMaxChatNum = function () {
        var that = this;
        this.$maxChatWarn.addClass("w-active");
        setTimeout(function () {
            that.$maxChatWarn.removeClass("w-active");
        }, 400);
    };
    View.prototype._countChatNum = function () {
        return this.$friendChatList.find("li").length;
    };

    var Controller = function (model, view) {
        this.model = model;
        this.view = view;

        var that = this;

        //bind elements
        this.$friendChatList = this.view.$friendChatList;


        //bind event
        this.$friendChatList.on("mouseenter", "li", function () {
            $(this).addClass("li-hover");
        }).on("mouseleave", "li", function () {
            $(this).removeClass("li-hover");
        });
        this.$friendChatList.on("click", "li", function () {
            //触发聊天内容区的切换

            var id = $(this).data("id");
            that.view.switchFriendChat(id);
        });
        this.$friendChatList.on("click", ".close", function (e) {
            var $this = $(this),
                $li = $this.closest("li");
            $li.remove();
            e.stopPropagation();
        });

        this._init();
    };
    Controller.prototype._init = function () {
        this.view.renderFriendChatList(this.model.data);
    };


    /*
     * main program
     */
    var FriendChatTab = function (data) {
        this.model = new Model(data);
        this.view = new View(this.model);
        this.controller = new Controller(this.model, this.view);
    };

    var friendChatTab;
    var isRuned = false; //判断是否第一次运行

    /*
     * exports global interface
     */
    exports.refreshFriendChatData = function (data) {
        if (!isRuned) {
            friendChatTab = new FriendChatTab(data);
            isRuned = true;
        } else {
            friendChatTab.controller.model.data = window.globalData;
            friendChatTab.controller._init();
        }
    };
    //exports.refreshFriendChatTab = fn;
});