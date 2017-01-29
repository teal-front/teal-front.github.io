/*
*@pattern name: 迭代器模式
*@form: 《JavaScript模式》#151
*/
//单体模式(函数闭包)
var agg = (function () { 
	var data = [2, 3, 5],
		index = 0,
		length = data.length;
	return {
		hasNext: function () {
			return index < length;
		},
		next: function () {
			if (!this.hasNext()) {
				return null;
			}
			return data[index++];
		},
		rewind: function () {
			index = 0;
		},
		current: function () {
			return data[index];
		}
	};
})();
//单对象模式
var agg = {
	data: [2, 3, 5],
	index: 0,
	getLength: function () {
		return this.data.length;
	},
	hasNext: function () {
		return this.index < this.getLength();
	},
	next: function () {
		if (!this.hasNext()) {
			return null;
		}
		return this.data[this.index++];
	},
	rewind: function () {
		this.index = 0;
	},
	current: function () {
		return this.data[this.index];
	}
};

//原型模式
var Agg = function (data) {  
	this.data = data;
	this.index = 0;
	this.length = this.data.length;
};
Agg.prototype = {
	constructor: Agg,
	hasNext: function () {
		return this.index < this.length;
	},
	next: function () {
		if (!this.hasNext()) {
			return null;
		}
		return this.data[this.index++];
	},
	rewind: function () {
		index = 0;
	},
	current: function () {
		return this.data[this.index];
	}
};
var agg_instance = new Agg([1, 3, 4, 6]);
