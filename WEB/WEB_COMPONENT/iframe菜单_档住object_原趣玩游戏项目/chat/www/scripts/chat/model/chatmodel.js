/**
 * Created by Administrator on 14-3-25.
 */
;define(function(require,exports,module){
    var ChatModel = Backbone.Model.extend({
        url:'/',            //数据存放的服务器接口
        initialize:function(){

        },
        defaults:{
            msg:''           //输入框的消息
        }
    })

    module.exports = ChatModel;
});
