//!function () {
/* utils */
var $ = {
    toCamelCase:function (string) {
        return string.replace(/-(\w)/g, function (match, subMatch, offset, string) {
            return subMatch.toUpperCase();
        });
    },
    toRealArray: function (alikeArray) {
        var i = 0, l = alikeArray.length,
            array = [];
        for (; i < l; i++) {
            array.push(alikeArray[i]);
        }
        return array;
    },
    /* 查找几个数组中重复的元素，只对数组中的简单数据有效 */
    getDuplicateOfArray: function () {
        if (arguments.length === 1) return arguments[0];
        var array = [].slice.call(arguments);
        while (array.length != 1) {
            array.push(m(array.pop(), array.pop()));
        }
        return array[0];

        function m(array1, array2) {
            var match,
                ret = [];
            for (var i = 0, l = array1.length; i < l; i++) {
                match = array1[i];
                for (var j = 0, k = array2.length; j < k; j++) {
                    if (match === array2[j]) {
                        ret.push(match);
                        break;
                    }
                }
            }
            return ret;
        }
    },
    before: function (targetFunc, callback) {
        var _self = targetFunc;
        return function () {
            if (callback.apply(null, arguments) === false) {
                return false;
            }
            return targetFunc.apply(null, arguments);
        };
    },
    after: function (targetFunc, callback) {
        var _self = targetFunc;
        return function () {
            var ret = targetFunc.apply(null, arguments);
            if (ret === false) {
                return false;
            }
            callback.apply(null, arguments);
            return ret;
        };
    }
};

    /* DOM */
    var getById = function (string) {
        return typeof string === "string" ? document.getElementById(string) : string;
    };
    /*
        className: "a" or "a b"
     */
    var getByClassName = function () {
        if (document.querySelector) { //IE8+ 、chrome、 firefox
            return  function (elem, className) {
                arguments.length === 1 && (className = elem, elem = document);
                return elem.querySelectorAll(className.replace(/\b(\w+)\b/g, ".$1").replace(/\s+/g, ""));
            };
        } else if (document.getElementsByClassName) {
            return function (elem, className) {
                    arguments.length === 1 && (className = elem, elem = document);
                  return elem.getElementsByClassName(className);
            };
        } else {
            return function (elem, className) {
                arguments.length === 1 && (className = elem, elem = document);
                var nodes = elem.getElementsByTagName("*"),
                    node, i = 0, l = nodes.length,
                    results = [];
                var re,
                    names = className.split(/\s+/), some = true;
                for (; i < l; i++) {
                    node = nodes[i];
                    for (var j = 0, c = names.length; j < c; j++) {
                        re = new RegExp("\\b" + names[j] + "\\b");
                        if (!re.test(node.className)) {
                            some =  false;
                            break;
                        }
                    }
                    some ? results.push(node) : (some = true);
                }
                return results;
            }
        }
    }();
    var getByTagName = function () {
       if (document.querySelector) {
           return function (elem, string) {
               arguments.length === 1 && (string = elem, elem = document);
               return elem.querySelectorAll(string);
           };
       } else {
           return function (elem, string) {
               arguments.length === 1 && (string = elem, elem = document);
               return elem.getElementsByTagName(string);
           };
       }
    }();

    var getSelector = function (selector, context) {
        context = context || document.documentElement;
        if (context.querySelectorAll) {
            return context.querySelectorAll(selector);
        } else {
            var tmp,
                id = (tmp = selector.match(/#([\w-]+)/)) && tmp[1],
                className = (tmp = selector.match(/\.[\w-]+/g)) && tmp.join("").replace(/\./g, " ").replace(/^\s/, ""),
                tag = (tmp = selector.match(/^([a-zA-Z]+)/)) && tmp[1];
            var selArray = [];
            id && selArray.push(getById(id));
            className && selArray.push(getByClassName(context, className));
            tag && selArray.push(getByTagName(context, tag));
            return $.getDuplicateOfArray.apply(null, selArray);
        }
    };
    /* selector: tag#id.class1.class2, no parent > child */
    var matchesSelector = function (elem, selector) {
        var html = document.documentElement,
            matches = html.matchesSelector || html.webkitMatchesSelector || html.mozMatchesSelector || html.msMatchesSelector;
        if (matches) {
            return matches.call(elem, selector);
        } else {
            var inArray = function (array, item) {
                var i = 0, l = array.length, pos = -1;
                for (; i < l; i++) {
                    if (item === array[i]) {
                        pos = i;
                        break;
                    }
                }
                return pos > -1;
            };
            return inArray(getSelector(selector), elem);
        }
    };

    //document.documentElement.ownerDocument === document
    //document.ownerDocument => null
    var getClosestParent = function (cur, selector, context) {
        while (cur && cur.ownerDocument && cur !== context) { //include self
            if (matchesSelector(cur, selector)) {
                return cur;
            }
            cur = cur.parentNode;
        }
        return null;
    };

    var css = function (elem) {
        var style = elem.style;
        if (arguments.length === 3) {
            //css(elem, key, value)
            var key = arguments[1],
                value = arguments[2];
            if (key === "opacity" && !("opacity" in document.documentElement.style)) {
                key = "filter"; //覆盖了其它的filter样式
                value = "alpha(opacity=" + value * 100 + ")"; //(value > 1 ? value : value * 100
            }
            style[key] = value;
        }
        if (arguments.length == 2) {
            if (typeof arguments[1] === "object") {
                //css(elem, {key: value})
                var pairs = arguments[1];
                for (key in pairs) {
                    if (pairs.hasOwnProperty(key)) {
                        css(elem, key, pairs[key]);
                    }
                }
            } else if (typeof arguments[1] === "string") {
                //css(elem, key)
                key = arguments[1];
                if (key === "opacity" && !("opacity" in document.documentElement.style)) {
                    key = "filter";
                    //elem.currentStyle.filter || (elem.style.filter = "alpha(opacity=100)");
                    return elem.currentStyle.filter ?
                        elem.currentStyle.filter.match(/alpha\(opacity=(.+)\)/)[1] / 100 :
                        1;
                }
                return elem.currentStyle ?
                    (elem.currentStyle[key] !== "auto" ? elem.currentStyle[key] : elem["offset" + key.replace(/^\w/, function(m){return m.toUpperCase();})] + "") :
                    parseInt(window.getComputedStyle(elem, null)[key]); //默认是px?
            }
        }
    };

    
    
    /**
     * Event
     *
     * var html = document.documentElement;
     * Event.bind(html, "click.c2", function () {alert("click.c2")});
     * Event.bind(html, "click.c1", function () {alert("click.c1")});
     * Event.bind(html, "click", function () {alert("html, click")});
     * Event.trigger(html, "click");
     * Event.unbind(html, "click.c1");
     */
    var Event = {
        _addEvent: function () {
            if (window.addEventListener) {
                return function (elem, type, fn) {
                    type = type.split(/\s+/);
                    for (var i = 0, l = type.length; i < l; i++) {
                        elem.addEventListener(type[i], fn, false);
                    }
                };
            } else if (window.attachEvent) {
                return function (elem, type, fn) {
                    type = type.split(/\s+/);
                    for (var i = 0, l = type.length; i < l; i++) {
                        elem.attachEvent("on" + type[i], function () {
                            fn.apply(elem, arguments); //change this point
                        });
                    }
                }
            }
        }(),
        _removeEvent: function () {
            if (window.addEventListener) {
                return function (elem, type, fn) {
                    elem.removeEventListener(type, fn, false);
                };
            } else if (window.attachEvent) {
                return function  (elem, type, fn) {
                    elem.detachEvent("on" + type, fn);
                }
            }
        }(),
        bind: function (ele, type, func) { //func中第一个参数仍是Event对象
            var type = type.split(/\s+/);
            if (type.length === 1) {
                var type = type[0].indexOf(".") > -1 ? type : type + ".",
                    _type = type.split("."),
                    type = _type[0],
                    namespace = _type[1] || "otherNS";
                ele.Y_event || (ele.Y_event = {});
                ele.Y_event[type] || (ele.Y_event[type] = {});
                ele.Y_event[type][namespace] || (ele.Y_event[type][namespace] = []);
                var namespaceArray = ele.Y_event[type][namespace];
                namespaceArray.push(func);

                this._addEvent(ele, type, namespaceArray[namespaceArray.length -1]);

            } else { //bind multiple type
                while(type[0]) {
                    this.bind(ele, type.shift(), func);
                }
            }
        },
        trigger: function (ele, type, data) {  // data作为除一个参数Event外的数组参数传入
            if (Object.prototype.toString.call(data) !== "[object Array]") throw new Error("trigger function arguments[2] should be a array.");
            var type = type.split(/\s+/);
            if (type.length === 1) {
                    type = type.indexOf(".") > -1 ? type : type + ".",
                    _type = type.split("."),
                    type = _type[0],
                    namespace = _type[1] || "";
                var namespaceArray;
                if (!ele.Y_event[type]) return;
                if (!namespace) {
                    for (var ns in ele.Y_event[type]) {
                        this.trigger(ele, type + "." + ns, data);
                    }
                } else if (namespaceArray = ele.Y_event[type][namespace]) {
                    var length = namespaceArray.length;
                    for (var i = 0; i < length; i++) {
                        data = data || [];
                        data.unshift(this.utils.createEventObj(ele, type));
                        namespaceArray[i].apply(ele, data);  // !important
                    }
                }
            } else {
                while (type[0]) {
                    this.trigger(ele, type.shift());
                }
            }
        },
        //
        unbind: function (ele, type) {
            var type = type.split(/\s+/);
            if (type.length === 1) {
                var type = type.indexOf(".") > -1 ? type : type + ".",
                    _type = type.split("."),
                    type = _type[0],
                    namespace = _type[1] || "";
                var namespaceArray;
                if (!ele.Y_event[type]) return;
                if (!namespace) {
                    for (var ns in ele.Y_event[type]) {
                        this.unbind(ele, type + "." + ns);
                    }
                } else if (namespaceArray = ele.Y_event[type][namespace]) {
                    for (var i = 0, l = namespaceArray.length; i < l; i++) {
                        this._removeEvent(ele, type, namespaceArray[i]); // !important
                    }
                    delete ele.Y_event[type][namespace];
                }

            } else {
                while (type[0]) {
                    this.unbind(ele, type.shift());
                }
            }
        },
        //Event.on(document, "click scroll", ".T-em, .T-div", func);
        //不支持blur,change,submit等事件的冒泡
        on: function (ele, type, childSelector, func) {
            if (arguments.length < 4) { throw new SyntaxError("arguments length be less"); }
            type = str_trim(type).split(/\s+/);
            var length = type.length;
            while (length--) {
                //console.log("outer loop", length, type[length], childSelector);
                _on(ele, type[length], childSelector, func);
            }
            function _on (ele, type, childSelector, func) {
                childSelector = str_trim(childSelector).split(/,\s+/);
                var length = childSelector.length;
                while (length--) {
                    //console.log("inner loop", length, type[length], childSelector);
                    __on (ele, type, childSelector[length], func);
                }

                function __on (ele, type, childSelector, func) {
                    Event.bind(ele, type, function (e) {
                        if (matchesSelector(e.target, childSelector)) {
                            func.apply(e.target, arguments);
                        }
                    });
                }
            }

            function str_trim (string) {
                return string.replace(/^\s+/, "").replace(/\s+$/, "");
            }
        }
    };
    Event.utils = {};
    Event.utils.createEventObj = function (ele, type) { //模拟Event对象
        var eventObj = {};
        eventObj.timeStamp = (new Date()).getTime();
        eventObj.type = type;
        eventObj.target = ele;

        return eventObj;
    };

    /* animate */
    var anim = function (elem, props, duration, callback) {
        if (arguments.length < 3) { throw new Error("arguments length less."); }
        var i = 0,
            timer,
            times = Math.floor(duration * 1000 / 30); //循环次数
        var propData = {}, prop;
        for (prop in props) {
            var p = propData[prop] = {};
            //prop === "filter" && (props[prop] *= 100);
            if (props.hasOwnProperty(prop)) {
                p.originValue = css(elem, prop);
                p.pureValue = retProp2Num(p.originValue);
                //p.delta = retProp2Num((prop === "opactiy" && !(prop in document.documentElement)) ? props[prop] * 100 : props[prop]) - p.pureValue;
                p.delta = retProp2Num(props[prop]) - p.pureValue;
                p.step = p.delta / times; //每次加的值
                p.unit = p.originValue.match(/[a-zA-Z]+$/) ?
                    p.originValue.match(/[a-zA-Z]+$/)[0] : 0; //单位
            }
        }
        timer = setInterval(function () {
            for(prop in props) {
                var value = retProp2Num(elem.style[prop] || css(elem, prop)) + propData[prop].step;
                value < 0 && (value = 0); //IE8 elem.style.width = "-4px" will be wrong
                css(elem, prop, value + propData[prop].unit);
            }
            if (++i >= times) {
                clearTimeout(timer);
                /* 如果动画是在变大属性值，那在i = times时，属性值可能会超过或小于设定值 */
                for(prop in props) {
                    elem.style[prop] = props[prop] + propData[prop].unit;
                }
                callback && callback();
            }
        }, 30);

        return timer;

        function retProp2Num (prop) { // "2px" -> 2 | -0.023 -> -0.023
            return typeof prop === "number" ?
                    prop :
                    Number(prop.replace(/[a-zA-Z]+$/, ""));
        }
    };

    //-------------------------------------ajax
    var ajax = function (options) {
        var type = options.type.toLowerCase(),
             url = options.url,
            data = handleData(options.data),
            successCallback = options.success || function () {},
            dataType = options.dataType.toLowerCase();
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) { //status, not state
                var data = null;
                if (dataType === "text") {
                    data = xhr.responseText;
                } else if (dataType === "xml") {
                    data = xhr.responseXML;
                } else if (dataType === "json") {
                    data = eval("(" + xhr.responseText + ")");
                }
                successCallback(data);
            }
        };
        xhr.open(type, handleURL(url), true);
        type === "post" && xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(type === "get" ? null : data);

        function handleData (data) {
            if (typeof data === "object") {
                var string = [], key;
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        string.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                    }
                }
                return string.join("&");
            } else if (typeof data === "string") {
                return data;
            }
            return "";
        }
        function handleURL (url) {
            if (type === "get") {
                return url +  "? " + data;
            }
        }
    };
//}(this);