/**
 * Created by Administrator on 14-5-12.
 * 存放页面初次加载时，服务器给前端的数据，
 * 以Backbone的Model对象存放
 */
define(function(require,exports,module){
    var initServerInfo = Backbone.Model.extend({
        url:"/",
        initialize:function(obj){

        }
    });

    var init = function(obj){
        return new initServerInfo(obj);
    }
    module.exports = init;
});