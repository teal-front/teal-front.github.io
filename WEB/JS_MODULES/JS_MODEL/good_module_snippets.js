/**
 * "或(||)"语句的for循环方式 
 */
// ||写法
window.requestAnimFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.msRequestAnimationFrame ||
						function (callback) {
							window.setTimeout(callback, 1000 / 60);
						};
//for写法
var vendors = ["webkit", "ms", "moz"];
for (var i = 0, l = vendors.length; 
		i < l && !window.requestAnimFrame; // !important
		i++) {
	window.requestAnimation = window[vendors[i] + "RequestAnimationFrame"];
}
if (!window.requestAnimFrame) {
	window.requestAnimFrame = function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
}

/**
 * 模式的return方式解耦
 * p.s. 借用上面的requestAnimFrame
 */
var obj = {
	elm: document.body,
	length: 0
};
function render (obj) {
	obj.elm.style.width = obj.length + "px";
	obj.length++;
	if (obj.length > 300) {
		// do stuff
		return false;   // !important
	}
	return true;    // !important
}

!function loop() { //有名函数
	if (!render()) {
		return false;
	}
	window.requestAnmiFrame(loop);
}();


/**
 * value > const && (value = const)的取最大（小）值法
 */
value = Math.min(value, const); //=>等价于下面的
value > const && (value = const);

value = Math.max(value, const); //=>等价于下面的
value < const && (value = const);

/**
 * 函数回调
 */
var resolve = function (ids) {
    if (toString.call(ids) === '[object Number]') {  //return的流程判断
        return ids + 1;  //函数中真正执行的部分
    }
    return Array.map(ids, function (id) {  //将数组中的值输入到自身解决，只起调配的作用
        return resolve(id);
    });
};

/**
 * key in obj VS obj.key
 */
window.pageXOffset;  // equal(0) => false
"pageXOffset" in window; // => true

/**
 * a.b && a.b.c && a.b.c.d的替代
 */
if ((window.JSON || {}).parse) ;
if (window.JSON && window.JSON.parse) ;

if (((window.JSON || {}).parse || {}).stringify
if (window.JSON && window.JSON.parse && window.JSON.parse.stringify) ;

/**
 * 支持Class初始化不带new
 */
var Event = function (src, props) {
	if (!(this instanceof Event)) {
		return new Event(src, props);
	}
	//initiational work
};