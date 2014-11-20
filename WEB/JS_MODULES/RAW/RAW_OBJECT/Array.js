//判断是否是数组
var is_array = function (value) {
	/*return value&&
		typeof value === "object"&&
		value.constructor === Array;*/ //得value所在的window对象跟当前的window是同一个。不同的页面框架(frames)有不同的Window对象
	return Object.prototype.toString.call(value) === "[object Array]";	
};
//数组的初始化构造
new Array(num);

Array.dim = function (dimention, initial) {
		var a = [], i;
		for (i = 0; i<dimention; i+=1) {
			a[i] = initial;	
		}
		return a;
};
var a5 = Array.dim(5, 0);

//If compareFunction is not supplied, elements are sorted by converting them to strings and comparing strings in lexicographic ("dictionary" or "telephone book," not numerical) order. For example, "80" comes before "9" in lexicographic order, but in a numeric sort 9 comes before 80.
Array.prototype.sort(compareFunction = funciton (a, b) {
	if (a is less than b by some ordering criterion)
		return -1;
	if (a is greater than b by the ordering criterion)
		return 1;
	 // a must be equal to b
	return 0;
});

//Array.prototype.reduce && Array.prototype.reduceRight
var dupArray = [[1, 3], [2, 4], [5, 7]];
var ret2 = dupArray.reduce(function (memory, value) {
  return memory.concat(value);
}, [9]);
console.log("ret2: " , ret2);
//=> [9, 1, 3, 2, 4, 5, 7]

//数组去重
//from Sizzle.uniqueSort
function uniqueSort (array) {
	var hasDuplicate = false;
	array.sort(function (a, b) { //judge is has duplicate in array
		if (a === b) {
			hasDuplicate = true;
			return 0;
		}
		return a > b ? 1 : -1;
	});
	if (hasDuplicate) {
		for (var i = 1; i < array.length; i++) {  //begin on 1
			if (array[i - 1] === array[i]) {
				array.splice(i--, 1); //i--
			}
		}
	}
	return array;
};
