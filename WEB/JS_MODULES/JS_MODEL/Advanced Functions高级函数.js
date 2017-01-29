/*
*@func name: funciton currying | 函数柯里化
*@form: 《JavaScript高级程序设计》(en) #741
*/
function curry (fn) {
	var slice = Array.prototype.slice;
	var args = slice.call(arguments, 1);
	return function () {
		var innerArgs = slice.call(arguments);
		return fn.apply(null, args.concat(innerArgs));
	};
}
function bind (fn, context) { //衍生
	var slice = Array.prototype.slice;
	var args = slice.call(arguments, 1);
	return function () {
		var innerArgs = slice.call(arguments);
		return fn.apply(context, args.concat(innerArgs));
	};
}
/*
*@func name: throttle(节气阀) | 惰性函数
*@form: 《JavaScript高级程序设计》(en) #753
*/
function throttle (fn, context, tTime) {
	clearTimeout(fn.tId); //fn.tId为全局性，而不是定义一个局部变化
	fn.tId = setTimeout(function () {
		fn.call(context);
	}, tTime);
}
/*
*@func name: lazy loading | 函数初始化
*@form:《JavaScript高级程序设计》(en) #736
*/
function runOnce () { //
	if () {
		runOnce = function () {	//函数重写
			
		}
	} else {
		runOnce = function () {
			
		}
	}
	return runOnce(); //第一次运行时需要，
}
var runOnce = (function () {
	if () {
		return function () {
			
		}
	} else {
		return function () {
			
		}
	}
}());



