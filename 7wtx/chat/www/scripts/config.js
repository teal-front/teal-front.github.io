/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-3-6
 * Time: 下午4:07
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-3-6
 * Time: 下午4:07
 * To change this template use File | Settings | File Templates.
 */
var seajs_cfg = {

    // 别名配置
    alias: {
        "$":"tools/jquery-sea",
        "jquery": "tools/jquery-sea",
        "underscore":"tools/underscore",
        "backbone":"tools/backbone.min",
        "jquery-tmpl": "tools/jquery.sea.tmpl.min",
        "jscrollpane": "tools/jscrollpane",
        "global": "global"
    },


    // 预加载项
    preload: [
        'global'
    ],

    // Sea.js 的基础路径
    base: '/chat/www/scripts/'

};

seajs._use = seajs.use;
seajs.use = function(t,n){
    seajs._use(t,n)
}

seajs.config(seajs_cfg);








