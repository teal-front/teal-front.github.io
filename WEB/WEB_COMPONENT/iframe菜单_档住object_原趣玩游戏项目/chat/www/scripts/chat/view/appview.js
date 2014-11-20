/**
 *
 * Created by Administrator on 14-3-28.
 */
define(function(require,exports,module){
    require('../plugs/insert');                     //获取输入框光标位置,并插入内容的一个jquery插件
    var ChatMV = require('./chatmodelview');        //视图处理数据的依赖类
    var collePoll = require('../model/collepool');  //所有频道的集合对象
    var CModel = require('../model/chatmodel');     //数据类
    var jScrollPane = require("jscrollpane");       //滚动条
    var socket = null;                              //存放socket客户端对象


    var AppView = Backbone.View.extend({
        el:$('#chat'),                  //聊天组件的顶级dom元素
        dom:{
            textA:'#entercont',         //输入框
            screen:'.screen',           //显示聊天内容区域
            contMsg:'.cont',            //聊天内容
            channel:'.channel',         //频道列表的DIV
            sendBtn:'.sendbtn',         //发送按钮
            friendList:'.channelList',  //频道列表
            emojiBox:'.emoticons',      //所有表情的盒子
            emoWrap:'.emoWrapper',      //表情图片层
            perinfo:'.person_info',     //用户信息弹出层
            onlineNum:'#onlinenum',     //在线用户数
            tips:"#tips",
            friList:'friList',
            selfScroll:$("#chatroom-scroll-pane")//自定义滚动条的ID
        },
        serverRes:null,                 //存放页面初次加载时，服务器给前端的数据
        emo:[],                         //表情数据
        channel:collePoll.colle,        //所有频道集合的对象
        initialize:function(obj,s){
            //页面初次加载时，获取的前端需要的数据对象
            this.serverRes = obj;
            //socket对象赋给本模块内的socket变量
            socket = s;

            var that = this;

            //创建表情数据
            this.createEmoData();

            _.bindAll(this,'appendOneMsg');
            //点击body需要隐隐的DOM
            $('body').click(function(e){
                $(that.dom.perinfo).hide();   //隐藏用户信息层
            });

            //点击DOM需要阻止冒泡的DOM & 已屏蔽
            $(this.dom.perinfo).click(function(event){
                var $target = $(event.target),
                    unum;
                if ($target.is(".pbs")) {
                    unum = $target.data("unum");
                    window.filterPersonData.push(unum);
                    $target.html("已屏蔽").css("cursor", "default");
                }
                event.stopPropagation();
            });

            //聊天窗口初始化滚动条
            $("#chatroom-scroll-pane").jScrollPane({
                showArrows: true,
                verticalDragMinHeight: 18
            });

            /**
             * socketIO相关
             * 1.参数 msg收到广播的消息对象，curC频道属性名,num在线用户数
             * 2.聊天消息事件名'newMsg'
             * 3.公告消息事件名'notice'
             * 4.在线用户数事件名'onlinenum'
             */

            //聊天信息
            socket.on('newMsg', function(msg,curC) {
                if ($.inArray(msg.unum, window.filterPersonData) == -1) {
                    that.createColleOneMsg(msg, curC);
                }
            });

            //错误信息
            socket.on("errMsg", function(msg) {
               this._errWarn(msg);
            });

            //公告
            socket.on('notice', function(msg,curC) {
                that.createColleOneMsg(msg,curC);
            });

            //发送获取在线人数
            socket.emit('getOnlineNum');
            socket.on('onlineNum',function(num){
                that.updateOnlineNum(parseInt(num));
            });

            //聊天历史记录
            socket.emit('historychat');
            socket.on('sendhistorychat',function(msg,curC){
                console.log('服务器给我的历史聊天记录：'+msg);
                if(msg.length !=0){
                    for(var i= 0,len=msg.length;i<len;i++){
                        that.createColleMoreMsg(msg[i],curC);
                    }
                    that.appendMoreMsg(curC);
                }
            });
        },
        events:{
            "click .sendbtn":"clickSendMsg",            //发送消息按钮绑定事件
            "keydown #entercont":"enterSendMsg",        //回车发送消息
            "click .emoWrap":"showEmo",                 //显示表情层
            "click .emoWrapper":"appendEmo",            //插入表情
            "click body":"hideLay",                     //隐藏表情层
            "click .nameid":"showInfoLay"               //显示隐藏信息层
        },
        render:function(){

        },
        updateOnlineNum:function(num){
            $(this.dom.onlineNum).text(num);
        },
        /**
         * 频道功能
         * 频道管理 这里的频道指的是backbone里的数据集 一个数据集对应一个频道
         * 世界频道 消息频道 好友私聊频道（最多五个私聊）
         * 1.获取当前频道
         *
         */
        getCurChannel:function(){                               //获取当前频道的标识
            return $(this.dom.channel).find('li[class="current"]').data("channelname");
        },
        /**
         *聊天显示区域功能
         *1.悬浮的用户信息层
         */
        showInfoLay:function(event){                            //点击用户名的事件处理函数
            event.stopPropagation();
            var info = this.getInfoUser(event.target),
                $lay = $(this.dom.perinfo);
            this.offsetLay($(event.target).offset());
            this.renderInfoLay(info);
            $lay.show();

        },
        getInfoUser:function(obj){                              //获取data自定义属性的对象
            return $(obj).data("info");
        },
        renderInfoLay:function(d){                              //渲染模板
            d.isVip = parseInt(d.isVip)?"vipshow":"viphide";
            var data = new CModel(d),
                temp = new ChatMV({model:data});
            $(this.dom.perinfo).html(temp.render("LayInfo"));
        },
        offsetLay:function(o){
            $(this.dom.perinfo).css({"left": o.left-10,"top": o.top+20});
        },
        /**
         *
         * 聊天数据处理
         * 1.在数据集创建
         * 2.插入到页面
         */
        xunz_vip:function(data){                        //vip、勋章 显示名字的值设置
            var classVipMsg = parseInt(data.isVip)?"vipshow":"viphide";
            data.vipIsShow = classVipMsg;
            if(parseInt(data.isVip)){
                data.imgVip = "/www/images/vip.jpg";
            }else{
                data.imgVip = "/www/images/vip_grey.jpg";
            }
            if(data.imgXunz == "null"){
                data.imgXunz = '/www/images/mrxz.jpg';
            }
            if(data.unmu == this.serverRes.get("unmu")){
                data.titName = data.mySeeMyName;
            }
            return data;
        },
        createColleOneMsg:function(data,curC){          //给相应的频道数据集添加一条聊天数据
            data = this.xunz_vip(data);
            var m = new CModel(data);
            this.channel[curC].add(m);                  //触发add事件，并执行处理函数（appendOneMsg）
            this.appendOneMsg(m);
        },
        appendOneMsg:function(data){                    //将一条消息到插入到页面的聊天显示区
            var isNotice = data.get('notice')?1: 0,
                mView = null;
            if(!isNotice){
                var  str = "";
                str = this.filterHtml(data.get("msg"));
                str = this.turnEmo(str);
                data.set("msg",str);
                mView = new ChatMV({model:data});
                $(this.dom.screen).find("ul").append(mView.render("ChatList"));   //获得数据和模板引擎转换之后的模板并插入到页面中
            }else{
                mView = new ChatMV({model:data});
                $(this.dom.screen).find("ul").append(mView.render("Notice"));
            }
            globalInterface.fire("initscrollpane",[this.dom.selfScroll]);     //自定义滚动条方法
        },
        createColleMoreMsg:function(data,curC){                               //创建多条聊天信息（历史记录）
            data = this.xunz_vip(data);
            var m = new CModel(data);
            this.channel[curC].add(m);
        },
        appendMoreMsg:function(curC){                                         //插入多条聊天信息（历史记录）
            var colle =  this.channel[curC].toJSON();
            var str = "";
            for(var i= 0,len=colle.length;i<len;i++){
                str = this.filterHtml(colle[i].msg);
                str = this.turnEmo(str);
                colle[i].msg=str;
            }
            var mView = new ChatMV({model:colle});
            $(this.dom.screen).find("ul").append(mView.renderList("HistoryList"));
            globalInterface.fire("initscrollpane",[this.dom.selfScroll]);     //自定义滚动条方法
        },
        turnEmo:function(msg){                                                //表情的标签转换成img标签
            for(var i= 0,len=this.emo.length;i<len;i++){
                for(var p in this.emo[i]){
                    if(typeof this.emo[i][p] == "string"){
                        var regEmo = new RegExp(this.emo[i][p],"g"),
                            arr = msg.match(regEmo);
                        if(arr){
                            var turnArr = this.turnMatchEmo(arr,this.emo[i].max);
                            for(var n=0,nlen=turnArr.length;n<nlen;n++){
                                var repRegStr = "\\["+p+"-"+turnArr[n]+"\\]",
                                    repReg = new RegExp(repRegStr,"g"),
                                    repStrHtml = '<img src="/www/images/'+p+'/'+turnArr[n]+'.gif">';
                                msg = msg.replace(repReg,repStrHtml);
                            }
                        }
                    }
                }
            }
            return msg;
        },
        turnMatchEmo:function(arr,max){                              //转换和过滤表情数据
            var a = [],
                num = 0;
            for(var i= 0,len=arr.length;i<len;i++){
                num = arr[i].slice(1,-1).split("-")[1]-0;
                if(num<=max){
                    a.push(num);
                }
            }
            return a;
        },
        filterHtml:function(msg){                                   //过滤HTML标签
            var reg_lt = /</g,
                reg_gt = />/g;
            msg = msg.replace(reg_lt,"&lt").replace(reg_gt,"&gt");
            return msg;
        },
        /**
         * 表情相关
         * 用了一个是jQ的插件（insertContent）
         */
        showEmo:function(event){                                      //显示或隐藏表情层
            event.stopPropagation();
            var $tar = $(event.target).parent(),
                $emoji  =$tar.find(this.dom.emoWrap);
            if($emoji.is(':hidden')){
                $tar.siblings().find(this.dom.emoWrap).hide();
                $emoji.show();
            }else{
                $emoji.hide();
            }
        },
        hideLay:function(){                                           //隐藏表情层
            $(this.dom.emoWrap).hide();
        },
        createEmoData:function(){                                     //创建表情验证的正则
            var that = this;
            $(this.dom.emojiBox).find('li').each(function(i){
                var obj = {},
                    emjName = $(this).data("emo"),
                    max = $(that.dom.emoWrap,this).find("img").length,
                    regStr = "\\["+emjName+"-[1-9][0-9]*\\]";
                obj[emjName]=regStr;
                obj.max = max;
                that.emo.push(obj);
            });
        },
        appendEmo:function(event){                                    //插入表情层
            event.stopPropagation();
            if(event.target.tagName == "IMG"){
                $(event.target).parent(this.dom.emoWrap).hide();
                var emoData = $(event.target).parents('li').data("emo");
                var emjNum = "["+emoData+"-"+$(event.target).attr('title')+"]";
                $(this.dom.textA).insertContent(emjNum);
            }
        },
        /**
         * 发送一条消息需要的步骤
         * 1.获取聊天框的信息（getMsg）
         * 2.获取用户当前的频道（getCurChannel）
         * 3.获取data-info自定义属性需要的信息
         * 4.在对应的【频道数据集】存放该条信息（createColleOneMsg）
         * 5.请求服务器，如果成功，则把该条信息发送到聊天窗口中否则相应处理（reqServer）
         * 6.最后将以上步骤打包装到一个函数（createMyMsg）
         * 7.回车或发送按钮，调用包装步骤的函数(enterSendMsg,clickSendBtn)
         * 消息的过滤
         * 1.全空格不能发送聊天信息(filterMsg)
         * 用户过滤
         * 1.禁言用户无法发送聊天信息
         * 信息显示
         * 1.是否显示VIP提示信息
         */
        isAvailLength:function(vals){                     //长度50
            var maxLen = 50,
                isAvia = false,
                msgLen = 0;
            vals = $.trim(vals).replace(/\s/g,"a").replace(/\W/g,"aa");
            msgLen = vals.length;
            isAvia = msgLen<=maxLen?true:false;
            return isAvia;
        },
        isAvail:function(vals){                          //验证合法性 （全空格无法发送）
            return $.trim(vals);
        },
        turnSpaceMsg:function(obj){                      //转换空格
            var reg = /\s/g;
            obj.msg = $.trim(obj.msg).replace(reg,"&nbsp;");
            return obj;
        },
        getMsg:function(){                              //获取输入框内容
            return {
                msg:$(this.dom.textA).val()
            }
        },
        isVip:function(){                               //是否为VIp
           return this.serverRes.get("isVip");
        },
        reqServer:function(msg,curC){                   //触发服务器端的postMsg事件，并将聊天信息和频道信息传过去
            if(curC == "worldchannel"){
                socket.emit('postMsg', msg,curC);

            }
        },
        createMyMsg:function(){                         //发送一条消息的步骤集合和相关处理
            var d = {},
                msg = this.getMsg(),
                curC = this.getCurChannel(),
                isAvil = this.isAvail(msg.msg),
                isLen = this.isAvailLength(msg.msg),
                vailMsg = this.turnSpaceMsg(msg);
            if(!isAvil){
                this._errWarn('不能为空！');
                return false;
            }
            if(!isLen){
                this._errWarn('不能超过50个字符！');
                return false;
            }
            d = $.extend(vailMsg,this.serverRes.attributes);
            console.log('发送给服务器的聊天信息：'+d);
                this.reqServer(d,curC);
                this.createColleOneMsg(d,curC);
            return true;
        },
        clickSendMsg:function(){                        //点击【发送】按钮发送消息
            if (this._isOverThresholdTime())  return;
            var isAvail = this.createMyMsg();
            if (isAvail) {
                $(this.dom.textA).val("");
            }
        },
        enterSendMsg:function(event){                   //回车发送消息
            var codeNum = event.keyCode;
            if (codeNum == 13) {
                event.preventDefault();
                if (this._isOverThresholdTime()) return;
                var isAvail = this.createMyMsg();
                if (isAvail) {
                    $(this.dom.textA).val("");
                }
            }
        },
        _lastTimestamp: +new Date() - 5000,
        _isOverThresholdTime: function () {
            var threshold = 5000,
                now = +new Date();
            if (now - this._lastTimestamp < threshold) {
                this._errWarn("发送太频繁,请稍后再发!");
                return true;
            }
            this._lastTimestamp = now;
            return false;
        },
        _errWarn: function (msg) {
            $(this.dom.tips).html(msg).stop(true).fadeIn().delay(800).fadeOut(800);
        }
    });

    module.exports = AppView;
});