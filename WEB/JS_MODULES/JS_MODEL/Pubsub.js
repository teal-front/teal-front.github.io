/**************************************
 * Observe module(观察者模式)
 ***************************************/

/**
 * jQuery中的观察者模式: $.Callbacks
 */
var callback = $.Callbacks("unique stopOnFalse");
var fn1 = function (mgs) { alert(mgs) };
callback.add(fn1);
callback.fire("message");
callback.remove(fn1);
 
 
/**
 * 基于jQuery的Pubsub模式
 */
var Observe = {
	obj: $({}),
	pub: function () {//发布
		this.obj.trigger.apply(this.obj, arguments);
	},
	sub: function () { //订阅
		this.obj.bind.apply(this.obj, arguments);
	},
	unsub: function () { //取消订阅
		this.obj.unbind.apply(this.obj, arguments);
	}
};

/**
 * Callbacksl构造函数
 */
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
 
/**
 * 简单的ev绑定
 * User.bind("active",function(info){alert(info)});
 * User.trigger("active", ["a message from User"]);
 * User.unbind("active");
*/
var User={};
User.bind=function(ev,callback) {
	this._callbacks||(this._callbacks={});
	(this._callbacks[ev]||(this._callbacks[ev]=[])).push(callback);
	return this;
};
User.unbind = function (ev) {
	if (this._callbacks) {
		if (ev) {
			delete this._callbacks[ev];
		} else {
			this._callbacks = {};
		}
	}
};
//@param {data} String
User.trigger=function(ev,data) {
	var list;
	if(!this._callbacks) return;
	if(!(list=this._callbacks[ev])) return;
	for (var i = 0, l = list.length; i < l; i++) {
		list[i].apply(null, data);
	}
	return this;
};


/**
 * 带命名空间的绑定，支持多事件同时绑定
 * 可用作DOM事件中的命名空间
 * var html = document.documentElement;
 * Pubsub.bind(html, "click.c2", function () {alert("click.c2")});
 * Pubsub.bind(html, "click", function () {alert("html, click")});
 * Pubsub.fire(html, "click");
 * Pubsub.unbind(html, "click.c1");
 */
var Pubsub = {};
Pubsub.bind = function (ele, type, func) {
	if (typeof type === "string") {
		var type = type.indexOf(".") > -1 ? type : type + ".",
			_type = type.split("."),
			type = _type[0],
			namespace = _type[1] || "otherNS";
		ele.event || (ele.event = {});
		ele.event[type] || (ele.event[type] = {});
		ele.event[type][namespace] || (ele.event[type][namespace] = []);
		var namespaceArray = ele.event[type][namespace];
		namespaceArray.push(func);
	} else if (type.length) { //type = > array
		while(type[0]) {
			Pubsub.bind(ele, type.shift(), func);
		}
	}
};
Pubsub.fire = function (ele, type, data) {
	if (typeof type === "string") {
		var type = type.indexOf(".") > -1 ? type : type + ".",
			_type = type.split("."),
			type = _type[0],
			namespace = _type[1] || "";
		var namespaceArray;
		if (!ele.event[type]) return;
		if (!namespace) {
			for (var ns in ele.event[type]) {
				Pubsub.fire(ele, type + "." + ns, data);
			}
		} else if (namespaceArray = ele.event[type][namespace]) {
			var length = namespaceArray.length;
			for (var i = 0; i < length; i++) {
				namespaceArray[i].apply(ele, data || []);  // !important
			}
		}
	} else if (type.length) {
		while (type[0]) {
			Pubsub.fire(ele, type.shift());
		}
	}
};
Pubsub.unbind = function (ele, type) {
	if (typeof type === "string") {
		var type = type.indexOf(".") > -1 ? type : type + ".",
			_type = type.split("."),
			type = _type[0],
			namespace = _type[1] || "";
		var namespaceArray;
		if (!ele.event[type]) return;
		if (!namespace) {
			for (var ns in ele.event[type]) {
				Pubsub.unbind(ele, type + "." + ns);
			}
		} else if (namespaceArray = ele.event[type][namespace]) {
			delete ele.event[type][namespace];  // !important
		}

	} else if (type.length) {
		while (type[0]) {
			Pubsub.unbind(ele, type.shift());
		}
	}
};