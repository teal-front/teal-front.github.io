/**
 *
 * Created by Administrator on 14-3-28.
 */
define(function(require,exports,module){
    require('../plugs/insert');                     //获取输入框光标位置,并插入内容的一个jquery插件
    var ChatMV = require('./chatModelView');        //视图处理数据的依赖类
    var collePoll = require('../model/collePool');  //所有频道的集合对象
    var CModel = require('../model/chatModel');     //数据类
    var socket = io.connect();

    var AppView = Backbone.View.extend({
        el:$('#chat'),                  //聊天组件的顶级dom元素
        dom:{
            textA:'#entercont',         //输入框
            screen:'.screen',           //显示聊天内容区域
            contMsg:'.cont',            //聊天内容
            channel:'.channel',         //频道列表的DIV
            sendBtn:'.sendbtn',         //发送按钮
            friendList:'.channelList',  //频道列表
            emoji:'.emojiWrapper',      //表情层
            perIinfo:'person_info',     //用户信息弹出层
            friList:'friList'
        },
        serverRes:{                     //和服务器对应的对象接口
            vipShow:''
        },
        channel:collePoll.colle,        //所有频道集合的对象
        initialize:function(obj){       //obj是服务器传给客户端的数据对象

            $.extend(this.serverRes,obj);

            var that = this;

            _.bindAll(this,'appendOneMsg','changeChannel','addFriChannel','hideLay');

            this.channel.worldchannel.bind('add',this.appendOneMsg);//初始给世界频道集合绑定add事件

            $(document).on('click',this.hideLay);

            $(window).bind('addChannel',this.addFriChannel);

            socket.on('newMsg', function(msg,curC) {                //msg收到广播的消息对象，curC频道属性名
                that.createColleOneMsg(msg,curC);
            });
        },
        events:{
            "click .sendbtn":"clickSendMsg",            //发送消息按钮绑定事件
            "keydown #entercont":"enterSendMsg",        //回车发送消息
            "click .channel":"changeChannel",           //切换频道绑定事件
            "click .emoji":"showEmoji",                 //显示表情层
            "click .emojiWrapper":"appendEmoji",        //插入表情
            "click body":"hideLay"                      //隐藏表情层
        },
        render:function(){

        },
        changeChannel:function(event){                  //切换频道（改变样式 改变绑定集合 显示对应频道的集合信息）
            var $li = $(event.target).parents('li');
            var lChannel = this.getCurChannel();
            $li.addClass('current').siblings().removeClass();
            var curChannel = this.getCurChannel();

            this.changBindColle(curChannel,lChannel);
            this.showChannelMsg(curChannel);
        },
        changBindColle:function(bindcoll,unbindColl){   //改变视图对象绑定的数据集
            this.channel[unbindColl].unbind('add',this.appendOneMsg);
            this.channel[bindcoll].bind('add',this.appendOneMsg);
        },
        showChannelMsg:function(curC){                  //显示频道的集合信息
            var colle =  this.channel[curC].toJSON();
            var chatMVShow = new ChatMV({model:colle});

            $(this.dom.screen).find('li').remove();
            $(this.dom.screen).find("ul").append(chatMVShow.renderColleList());
        },
        addFriChannel:function(event,data){
            var mView = new ChatMV({model:data});
            $(this.dom.friendList).append(mView.renderFriChannel());    //获得数据和模板引擎转换之后的模板并插入到页面中
            this.addFriChatColle(data.socId);
        },
        addFriChatColle:function(channelColleName){                     //创建一个私聊的集合存入到集合池中
            this.channel[channelColleName] = collePoll.createColle();
        },
        /**
         * 表情相关
         * 用了一个是jQ的插件（insertContent）
         */
        showEmoji:function(event){                                      //显示或隐藏表情层
            event.stopPropagation();
            var $tar = $(event.target),
                $emj = $tar.next(this.dom.emoji);
            if($emj.is(':hidden')){
                $tar.parent('li').siblings().find('.emojiWrapper').hide();
                $tar.next(this.dom.emoji).show();
            }else{
                $tar.next(this.dom.emoji).hide();
            }
        },
        hideLay:function(){
            $(this.dom.emoji).hide();                                   //隐藏表情层
        },
        appendEmoji:function(event){                                    //插入表情层
            event.stopPropagation();
            if(event.target.tagName == "IMG"){
                $(event.target).parent(this.dom.emoji).hide();
                var emjNum = "[emoji"+$(event.target).attr('title')+"]";
                $(this.dom.textA).insertContent(emjNum);
            }
        },
        /**
         * 发送一条消息需要的步骤
         * 1.获取聊天框的信息（getMsg）
         * 2.获取用户当前的频道（getCurChannel）
         * 3.在对应的【频道数据集】存放该条信息（createColleOneMsg）
         * 4.请求服务器，如果成功，则把该条信息发送到聊天窗口中否则相应处理（reqServer）
         * 5.最后将以上步骤打包装到一个函数（createMyMsg）
         * 6.回车或发送按钮，调用包装步骤的函数(enterSendMsg,clickSendBtn)
         * 消息的过滤
         * 1.全空格不能发送聊天信息(filterMsg)
         * 用户过滤
         * 1.禁言用户无法发送聊天信息
         * 信息显示
         * 1.是否显示VIP提示信息
         */
        filterMsg:function(vals){                       //全空格无法发送
            var regEmp = /^\S+$/;
            return regEmp.test($.trim(vals));
        },
        getCurChannel:function(){                       //获取当前频道的标识
            return  $(this.dom.channel).find('li[class="current"]').data("channelname");
        },
        getMsg:function(){                              //获取输入框内容
            return {
                msg:$(this.dom.textA).val()
            }
        },
        isVip:function(){                               //是否为VIp
           return this.serverRes.isVip;
        },
        createColleOneMsg:function(data,curC){          //给相应的频道数据集添加一条聊天数据
            var m = new CModel(data);
            this.channel[curC].add(m);                  //触发add事件，并执行处理函数（appendOneMsg）
        },
        appendOneMsg:function(data){                                //将一条消息到插入到页面的聊天显示区
            var classVipMsg = this.isVip()?"vipshow":"viphide";
            data.set("vipIsShow",classVipMsg);
            var mView = new ChatMV({model:data});
            $(this.dom.screen).find("ul").append(mView.render());   //获得数据和模板引擎转换之后的模板并插入到页面中
        },
        reqServer:function(msg,curC){                   //触发服务器端的postMsg事件，并将聊天信息和频道信息传过去
            if(curC == "worldchannel"){
                socket.emit('postMsg', msg,curC);
            }else{
                socket.emit('sl', msg,curC);
            }
        },
        createMyMsg:function(){                         //发送一条消息的步骤集合和相关处理
            var data = this.getMsg(),
                curC = this.getCurChannel(),
                isEmp = this.filterMsg(data.msg);
            if(isEmp){
                $.extend(data,this.serverRes);
                data.myName = "我";
                this.createColleOneMsg(data,curC);
                data.myName = this.serverRes.myName;
                this.reqServer(data,curC);
            }
        },
        clickSendMsg:function(){                        //点击【发送】按钮发送消息
            this.createMyMsg();
            $(this.dom.textA).val("");
        },
        enterSendMsg:function(event){                   //回车发送消息
            var codeNum = event.keyCode;
            if(codeNum==13 || codeNum==32){
                this.createMyMsg();
                $(this.dom.textA).val("");
            }
        }
    });

    module.exports = AppView;
});