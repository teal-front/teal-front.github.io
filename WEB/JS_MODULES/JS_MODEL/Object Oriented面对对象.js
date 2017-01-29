/**
 *  JS中类的多态性
 */
//重载： JS中并没有重载这一说，不过可以在函数内部通过判断参数类型来执行不同的脚本
   //同一个名字的函数（注意这里包括函数）或方法可以有多个实现，他们依靠参数的类型和（或）参数的个数来区分识别。

//继承： 继承中的方法覆盖，并有访问基类方法的接口 
var SupClass = function () {
	this.type = function () {
		console.log("print from sup.");
	};
};
var SubClass = function () {
	var type = this.type; //用内部的变量引用基类的方法，是引用关系
	this.type = function () {
		type.call(this);
		console.log("print from sub.");
	};
};
SubClass.prototype = new SupClass();
SubClass.prototype.constructor = SubClass;
(new SubClass()).type();


/*
*@form: 《JavaScript高级程序设计》(en) #173
*/
/*normal use*/
var Controller = function (Model, View) {
	this.model = new Model();
	this.view = new View();
	
	this.variable = "controller";
};
Controller.prototype = {
	bind: function () {
		return this.variable;
	}
};

/*prototype的意外改写*/ // 在原型链里面应避免出现 #197
Person.prototype = {
	colors: ["red", "yellow"]
};
(new Person).colors.push("teal");
(new Person).colors; //=> ["red", "yellow", "teal"]

/*=======inherit prototype原型链继承======*/ // #201
/*直接继承*/ // SubType的原型继承了SuperType的属性，如superType，如果superType是引用类型的，则会被实例个体所修改
var SuperType = function () {
	this.superType = "super";
};
SuperType.prototype.getSuperValue = function () {
	return this.type;
};
var SubType = function () {
	this.subType = "sub";
}
SubType.prototype = new SuperType(); //此外SubType的原型继承SupType的原型，也就是SupType的一个实例
SubType.prototype.getSubValue = function () {
	return this.type;
};
var subInstance = new SubType();
console.log("subInstance: ", subInstance); //=> ["subType", "super"]
console.log("subInstance: ", Object.getOwnPropertyNames(subInstance)); //=> ["subType"]
SubType; //=> { superType="super",  getSubValue=function(),  getSuperValue=function()}
console.log("subInstance's constructor: ", subInstance.constructor.toString()); //=>function(){this.supType = "super";}
console.log("subInstance's __proto__: ", JSON.stringify(subInstance.__proto__));

/*不直接继承(Constructor Stealing)*/
var SuperType = function () {
	this.colors = ["red", "yellow"];
};
var SubType = function () {
	//init SubType self
	this.type = "sub";
	//stealing from SuperType
	SuperType.call(this); //stealing
}
(new Subtype).colors.unshift("teal");
(new Subtype).colors; //=> ["red", "yellow"]

/*混合继承*/ //最优方案
var SuperType = function (name) {
	this.name = name;
	this.colors = ["red", "yellow"];
};
SuperType.prototype.sayHi = function () {
	return this.colors;
};
var SubType = function () {
	//init SubType self
	this.type = "sub";
	//stealing from SuperType
	SuperType.call(this); //stealing
}
//method one 
SubType.prototype = new SuperType(name); //SubType.prototype继承了｛name: ,colors｝,还有原型的方法。不过属性值实例上已有，不从SubType的原型上继承了。
SubType.prototype.constructor = SubType;
//method two
inheritPrototype(SubType, SuperType); //这样就使subType.prototype中不再有属性值了,如{name, colors}
function inheritPrototype(subType, superType) {
	//var p = superType.prototype; wrong  //这里是继承关系，而不是引用
	var p = Object.create(superType.prototype);
	p.constructor = subType;
	subType.prototype = p;
}
(new Subtype).colors.unshift("teal");
(new Subtype).colors; //=> ["red", "yellow"]


/*=========other prototype creation========*/
/*Dynamic Prototype Pattern动态原型*/
function Person (name, age) {
	this.name = name;
	this.age = age;
	
	if (typeof this.sayHi !== "function") {
		Person.prototype.sayHi = function () {
			return this.name;
		}
	}
}


/*Parasitic Constructor Pattern寄生构造函数*/
function Person (name, age) {
	var obj = {};
	obj.name = name;
	obj.age = age;
	obj.sayHi = function () {
		return this.name;
	};
	return obj;
}
var sasa = new Person("sasa", 16);
/*Durabel(永久的) Constructor Pattern*/
function Person (name, age) { /*形成闭包，name只能obj.sayHi访问*/
	var obj = {};
	obj.sayHi = function () {
		return name;
	};
	return obj;
}
var sasa = new Person("sasa", 116);
sasa.sayHi();






/*
*@from: 《JavaScript语言精粹》 #51
*/
/*函数化*/ //保护私有数据
var Mamal = function (spec) {
	var that = {};
	that.get_name = function () {
		return spec.name;
	};
	return that;
};
var Cat = function (spec) {
	var that = mamal(spec);
	that.purr = function () {
		
	};
	return that;
};



