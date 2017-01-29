//构造函数模仿的是jQuery的构造器
var queue = function () {
  var queue = function (elem) {
	//内部使用new构造，在外部调用queue就可以不用New操作了
    return new queue.fn.init(elem);
  };
  
  queue.fn = queue.prototype = {
    constructor: queue,
    init: function (elem) {
	  this[0] = elem; //模仿jQuery，holder elem as object's zero
      return this;
    },
    queue: function () {
		return this;
    },
    dequeue: function () {
      return this;
    }
  };
  
  //使queque返回的对象继承了queue.fn，包括constructor
  queue.fn.init.prototype = queue.fn;
  
  //定义queue的静态方法
  queue.staticFunc = function () {
    
  };
  
  return queue;
  
}();

//链式调用
queue({}).queue(fn1).queue(fn2).dequeue();

//调用queue的静态方法
qeuee.staticFunc();