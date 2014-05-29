/**
 * Created by wang yao on 14-4-10.
 * for: 好友列表
 */
;define(function (require, exports, module) {
    var $ = require("jquery");

//----------Model-------------
    var Model = function (data) {
        this.data = data;
        this.friendsList = this.data.friendsList;
    };
    Model.fn = Model.prototype;
    Model.fn.sortFriendsList = function (data, callback) {
        //在线vip好友>在线好友>不在线好友，默认为昵称字母排序
        data.sort(function (a, b) {
            if (a.vip > b.vip) {
                return -1;
            } else if (a.vip < b.vip) {
                return 1;
            } else {
                if (a.online > b.online) {
                    return -1;
                } else if (a.online < b.online) {
                    return 1;
                } else {
                    if (a.name > b.name) {
                        return -1;
                    } else if (a.name < b.name) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        });
        (callback || $.noop).call(this, data);
    };
    Model.fn.filterSearchName = function (name, callback) {
        var friendsData = this.friendsList,
            filterNameArr = [],
            nameRegExp = new RegExp(name);
        console.log("friendsData: ", friendsData);
        $.each(friendsData, function () {
            if (this.online && nameRegExp.test(this.name)) {
                filterNameArr.push(this.name);
            }
        });
        console.log("filterNameArr: ", filterNameArr);
        (callback || $.noop).call(this, filterNameArr);
    };


//----------View----------
    $ = require("jquery-tmpl");
    var View = function (model) {
        this.model = model;

        //html-template
        this.$friendsList = $("#myFriendsList");
        this.friendsListTemplate = $("#friendsListTemplate").html();
        this.$searchResult = $("#searchResult");
        this.searchResultTemplate = $("#searchResultTemplate").html();

        this.$friendsNum = $("friendsNum");
    };
    View.fn = View.prototype;
    View.fn.renderFriendsList = function (data) {
        var that = this;
        this.model.sortFriendsList(data, function (data) {
            $.tmpl(that.friendsListTemplate, data).appendTo(that.$friendsList);
        });
    };
    View.fn.renderSearchResult = function (data) {
        var length = data.length;
        $.each(data, function (i) {
            data[i] = {name: data[i]};
        });
        console.log("data: ", data);
        if (length === 0) {
            this.$searchResult.html("没有符合条件的搜索结果").show();
        } else {
            this.$searchResult.empty().append($.tmpl(this.searchResultTemplate, data).wrap("ul")).show();
        }
    };
    View.fn.clearFriendMessageTip = function (id) {
        //friends
        var $friendLi = $("#friend-" + id),
            $friendLiMessageTip = $friendLi.find(".message-tip");
        //chat tab
        var $friendChatLi = $("#friend-chat-" + id),
            $friendChatLiMessageTip = $friendChatLi.length ? $friendChatLi.find(".infonum") : $({});

        $friendLiMessageTip.add($friendChatLiMessageTip).remove();
    };
    View.fn.warnMaxFriendNum = function () {
        var o = this.$friendsNum[0];
        var num = 0;
        setTimeout(function () {
            o.style.color = "#f70";
            setTimeout(function () {
                o.style.color = "#fff";
            }, 400);
            if (++num < 2) {
                setTimeout(arguments.callee, 800);
            }
        }, 800);
    };
    View.fn.addFriend = function (friData) {
        this.model.friendsList.push(friData);
        this.view.renderFriendsList(this.model.friendList);
    };


//-------Controller---------
    var Controller = function (model, view) {
        var that = this;

        this.model = model;
        this.view = view;

        //bind elements
        this.$searchFriendIpt = $("#searchFriendIpt");
        this.$myFriendsList = $("#myFriendsList");
        this.$searchResult = $("#searchResult");

        //init
        this._init();

        //-------bind event--------
        //搜索好友
        this.$searchFriendIpt.keyup(function () {
            that.searchFriendHandle.call(this, that);
        }).click(function (e) {
            e.stopPropagation();
        });
        //点文档空白处关闭好友搜索结果
        $(document).click(function () {
            that.$searchResult.hide();
        });
        //点击好友触发聊天
        this.$myFriendsList.on("click", "li", function () {
            that._triggerFriendChat.call(that, this);
        });
        this.$searchResult.on("click", "li", function (e) {
            that._triggerFriendChat.call(that, this);
            e.stopPropagation();
        });
        //删除好友
        this.$myFriendsList.on("click", ".deleteFriend", function () {
            var $this = $(this),
                $li = $this.closest("li"),
                userId = $li[0].id.split(/\w-/)[1];
            $.post(ZM.AJAX.postMessageURL, {id: userId}, function (d) {
                if (d.status) {
                    $li.fadeOut();

                }
            }, "ajax");
        });
    };
    Controller.fn = Controller.prototype;
    Controller.fn._init = function () {
        this.view.renderFriendsList(this.model.friendsList);
    };
    Controller.fn.searchFriendHandle = function (that) {
        var name = $.trim(this.value);
        console.log("value: ", name);
        if (name === "") {
            that.$searchResult.hide();
            return;
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            that.model.filterSearchName(name, function (data) {
                that.view.renderSearchResult(data);
            });
        }, 300);
    };
    Controller.fn.goChat = function () {
        $(window).trigger("goChat", {name: name});
    };
    Controller.fn.refreshFriendChatTab = function () {
        $(window).trigger("refreshFriendChatTab", {id: id});
    };
    Controller.fn._triggerFriendChat = function (that) {
        var id = this.id.split(/\w+-/)[1];
        that.goChat.call(this, id); //打开聊天消息
        that.refreshFriendChatTab.call(this, id); //切换好友聊天列表
        that.view.clearFriendMessageTip(id); //去掉有消息的状态
    };


    /*
     * Main program
     */
    var Friends = function (data) {
        this.model = new Model(data);
        this.view = new View(this.model);
        this.controller = new Controller(this.model, this.view);
    };

    var friends;
    var isRuned = false; //判断是否第一次运行

    /*
     * exports global interface
     */
    exports.refreshFriendsData = function (data) {
        if (!isRuned) {
            friends = new Friends(data);
            isRuned = true;
        } else {
            friends.controller.model.data = data;
            friends.controller._init();
        }
    };
});