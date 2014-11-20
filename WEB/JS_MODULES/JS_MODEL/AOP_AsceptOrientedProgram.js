//form: http://www.alloyteam.com/2013/08/yong-aop-gai-shan-javascript-dai-ma/
Function.prototype.before = function (func) {
    var _self = this;
    return function () {
        if (func.apply(this, arguments) === false) {
            return false;
        }
        return _self.apply(this, arguments);
    }
};
Function.prototype.after = function (func) {
    var _self = this;
    return function () {
        var _return = _self.apply(this, arguments);
        if (_return === false) {
            return false;
        }
        func.apply(this, arguments);
        return _return;
    }
};

var appendDoms = function () {
    for (var i = 0; i < 10000; i++) {
        var div = document.createElement("div");
        document.body.appendChild(div);
    }
};

var logTime = function (func) {
    //var start;
    return (func = (function () {
        var start;
        return func.before(function () {
            start = Date.now();
            console.log("before");
        }).after(function () {
            console.log(Date.now() - start);
            console.log("after");
        });
    })());
};
logTime(appendDoms);

appendDoms();


/*
window.onload = function () {
    document.body.appendChild(document.createTextNode("this's a text node"));
    console.log(1);
};
window.onload = (window.onload || function () {}).before(function () {
    document.body.style.cssText = "font-size: 20px;";
    console.error(2);
});
window.onload = (window.onload || function () {}).before(function () {
    document.body.style.cssText = "font-size: 20px; color: red;";
    console.error(3);
});*/