/**
 * Created by Administrator on 14-3-25.
 */
define(function(require,exports,module){
    var AppView = require('../view/appview'),
        initInfo = require('../model/initinfomodel');

    var appinit = function(obj,s){
        var info = initInfo(obj);       //存放页面初次加载时，服务器给前端的数据 initInfo方法将原始数据包装成一个backbone数据对象，
        var appV = new AppView(info,s); //s是传过来的socket对象
    }

    module.exports = appinit;

})