//pseudo code
var Model = function () {
	this.types= ["hezhi", "3tdx", "3bt"];
	this.store = {
		"hezhi": Model.prototype.data[this.type].calc(value),
		"3tdx": ,
		"3bt": 
	};
	this.result = [this.store.modelData{Array}]; //需要打散数组
};
Model.prototype = {
	data: {
		"hezhi": {
			name: "和值",
			type: "hezhi",
			//@param array {Array[length: 1 | 2]}
			//@return {Object}
			calc: function (array) {
				return {
					viewData: {
						num: {Number[0, ]},
						price: {Number},
						gain: {Number | {start: Number, end: Number}}
						award: {Number | {start: Number, end: Number}}
					},
					modelData: [{ // {Array}
						name: this.name,
						type: this.type,
						value: {String},
						price: {Number},
						num: {Number}
					}]
				}
			}
		}
	},
	random: function (type, n) {
		return [{   // this.model.store[type].modelData
			type: {String},
			name: {String},
			value: {String},
			num: 1,
			price: 2,
			random: true
		}];
	}
};

var View = function () {


};
View.prototype = {

};

var Controller = function () {

};
Controller.prototype = {
	//选号
	chooseNum: function () {
		var value = [] or [[], []];
		this.store[this.type] = Model.prototype.data[type].calc(value);
	},
	//确认选号
	confirmNum: function () {
		var data = this.store[this.type];
		this.result.concat(data.modelData);
		data = [] or [[], []];
	}
};