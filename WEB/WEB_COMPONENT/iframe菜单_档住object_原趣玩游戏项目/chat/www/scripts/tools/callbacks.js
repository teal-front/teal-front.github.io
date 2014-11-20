/**
 * Created by Administrator on 14-5-14.
 */
;define(function (require, exports, module) {
    var Callbacks = function () {
        this.handles = {};
    };
    Callbacks.prototype = {
        constructor: Callbacks,
        add: function (type, handle) {
            if (typeof type === "string") {
                type = [type];
            }
            for (var i = 0, l = type.length, typeItem; i < l; i++) {
                typeItem = type[i];
                if (this.handles[typeItem] === undefined) {
                    this.handles[typeItem] = [];
                }
                this.handles[typeItem].push(handle);
            }
        },
        fire: function (type, args) {
            if (this.handles[type] instanceof Array) {
                var handles = this.handles[type];
                for (var i = 0, l = handles.length; i < l; i++) {
                    handles[i].apply(null, args);
                }
            }
        },
        fireWith: function (context, type, paramArray) {
            if (this.handles[type] instanceof Array) {
                var handles = this.handles[type];
                for (var i = 0, l = handles.length; i < l; i++) {
                    handles[i].apply(context, paramArray);
                }
            }
        }
    };

    module.exports = Callbacks;
});