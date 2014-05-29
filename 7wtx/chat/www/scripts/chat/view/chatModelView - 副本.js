/**
 * Created by Administrator on 14-3-25.
 */
define(function(require,exports,module){
    var ModelToView = Backbone.View.extend({
        template: _.template($("#chatContList").html()),            //发送单条消息的模板
        templateList: _.template($("#chatContListAll").html()),     //切换频道时更新信息列表的模板
//        friendstempList:_.template($("#friendsList").html()),       //好友列表模板
        initialize:function(){

        },
        render:function(){                  //单个渲染
            return this.template(this.model.toJSON());
        },
        renderColleList:function(){         //整个数据集渲染
            return this.templateList({colle:this.model});
        },
        renderFriChannel:function(){        //好友模板
            return this.friendstempList(this.model);
        }
    });

    module.exports=ModelToView;
})
