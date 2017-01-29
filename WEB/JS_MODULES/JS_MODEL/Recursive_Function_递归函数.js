/**
 * 每个递归函数都有一个终止条件
 * 循环和递归的方法可以互相转换
 */
function factorial_recursive (num){
    if(num<=1)
        return 1;
    return num*factorial(num-1);
}
function factorial_loop (num) {
	var ret = 1;
	while (num > 0) {
		ret = ret * num;
		num--;
	}
	return ret;
}


 
var resolve = function (ids) {
	var toString = Object.prototype.toString;
	if (toString.call(ids) === '[object Number]') {  //return的流程判断
		return ids + 1;  //函数中真正执行的部分
	}
	return Array.map(ids, function (id) {  //将数组中的值输入到自身解决，只起调配的作用
		return resolve(id);
	});
};

var obj= { a: 1, b: {c: {e:3} }, d:3 };
var stringify = function (obj) {
    var arr = [];
    for (var key in obj) {
        var value = typeof obj[key] === "object" ? stringify(obj[key]) : obj[key]; //!important
        arr.push("\"" + key + "\"" + ":" + value);
    }
    
    return "{" + arr.join(",") + "}";
};
stringify(obj);
//=> {"a":1, "b": {"c": 1, "d": 3}}