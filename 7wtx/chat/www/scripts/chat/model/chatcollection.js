;define(function(require,exports,module){
    var ChatM = require("./chatmodel");//数据类

    var ChatColl = Backbone.Collection.extend({
        url:"/",
        model:ChatM             //依赖的数据类
    })

    module.exports = ChatColl;
})