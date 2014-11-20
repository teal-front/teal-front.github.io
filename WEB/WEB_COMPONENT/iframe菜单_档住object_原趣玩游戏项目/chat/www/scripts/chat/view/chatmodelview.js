/**
 * Created by Administrator on 14-3-25.
 */
define(function(require,exports,module){
    var ModelToView = Backbone.View.extend({
        templateChatList: _.template($("#chatContList").html()),            //发送单条消息的模板
        templateHistoryList: _.template($("#historyChat").html()),            //发送单条消息的模板
        templateLayInfo:_.template($("#infoLay").html()),                   //用户信息浮层
        templateNotice:_.template($("#chatContNotice").html()),             //系统公告
        initialize:function(){

        },
        render:function(s){
            return this["template"+s](this.model.toJSON());
        },
        renderList:function(s){
            var obj = {}
            obj.colle = this.model;
            return this["template"+s](obj);
        }
    });

    module.exports=ModelToView;
})
