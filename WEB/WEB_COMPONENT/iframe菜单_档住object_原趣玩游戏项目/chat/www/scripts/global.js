/**
 * Created by Administrator on 14-3-27.
 */
define(function(require,exports,module){
    //导入全局依赖模块
    var jq = require('jquery');
    var un = require('underscore');
    var bb = require('backbone');


    //添加全局属性来引用依赖模块
    var $;
        $ = window.$ = window.jQuery = jq.noConflict(true);
    var _;
        _ = window._ = un.noConflict(true);
    var Backbone;
    Backbone = window.Backbone = bb.noConflict(true);

    //给Backbone的$属性赋值jq对象
    Backbone.$ = $;

    /*
     * global interface
     */
    window.globalInterface = new (require("tools/callbacks"));  //全局接口对象
    window.filterPersonData = [];                               //屏蔽用户的数据
});