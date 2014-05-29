/**
 * Created by Administrator on 14-3-25.
 */
define(function(require,exports,module){

//          friends = require("../../friends/friends"),
//          friendChatTab = require("../../friends/friendChatTab");
//          globalInterface.add("refreshFriendChatTab", friendChatTab.refreshFriendChatTab);
//          globalInterface.add("refreshFriendsData", friends.refreshFriendsData);
//          globalInterface.add("refreshFriendChatData", friendChatTab.refreshFriendChatData);


    //用户验证信息获取
    var userVerification = {
        getInfo:function(){
            var arrlocal = [],
                pathObj = {};
            arrlocal = location.pathname.split("/");
            if(arrlocal.length != 0){
                pathObj.info1 = arrlocal[arrlocal.length-2];
                pathObj.info2 = arrlocal[arrlocal.length-1];
            }
            return pathObj;
        },
        getCookie:function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

            if(arr=document.cookie.match(reg))

                return unescape(arr[2]);
            else
                return null;
        },
        isVail:false
    };

    //socket用户验证
    function sendVer(){
        var urlinfo = userVerification.getInfo(),
            cookieInfo = userVerification.getCookie('7wtx-access');
        if(!cookieInfo){
            window.location.href = 'http://www.7wtx.com/';
        }else{
            socket.emit('userVerification',urlinfo.info1,urlinfo.info2,cookieInfo);
        }
    }

    //创建socketIO客户端连接对象
    var socket = io.connect('http://localhost:4000');

    //验证用户不合法时跳转页面
    socket.on('isJump',function(isJump){
        if(isJump){
            location.href = 'http//www.7wtx.com/';
        }
    });

    //执行socket用户验证
    sendVer();

    //入口方法来传递视图层需要的对象（初始数据和socket对象）
    var chat = require("../module/chat");
    var rk = function(d){
        chat(d,socket);
    };

    /**
     *add方法第一参数 自定义事件名（也可以是数组）
     *      第二个参数 绑定的事件处理函数，
     *
     */
    //自定义滚动条
    globalInterface.add("initscrollpane", function ($scrollPane) {
        var api = $scrollPane.data('jsp');
        api.reinitialise();
        api.scrollToBottom();
    });

    //refreshGlobalData获得服务器端初始给前端的总数据对象
    !function (refreshGlobalData) {
        //页面加载时各组件间的通信
        $(refreshGlobalData);

        //正常的服务器返回消息
        /*setTimeout(function () {
         refreshGlobalData();
         setTimeout(arguments.callee, 1000);
         }, 1000);*/
    }(function () {
        $.getJSON("/www/chat.json", function (data) {
            if (data.status) {
                globalInterface.fire("refreshFriendsData", [data]); //第二个参数为数组
                globalInterface.fire("refreshFriendChatData", [data]);

            }
        });
    });


    module.exports = rk;
});
