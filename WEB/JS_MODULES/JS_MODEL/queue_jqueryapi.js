var queue = function () {
	//构造函数模仿的是jQuery的构造器
  var queue = function (elem) {
    return new queue.fn.init(elem);
  };
  
  queue.fn = queue.prototype = {
    constructor: queue,
    init: function (elem) {
      this[0] = elem;
      return this;
    },
	//getter & setter
    queue: function (callback) {
      //set callback in stack elem._callbacks
      var elem = this[0];
      var callbacks = (elem._callbacks || (elem._callbacks = []));
      if (callback) {
        
        //为解决callback内部的next调用问题上自己想的办法。结果不行
        // var oldCallback = callback;
        // callback = function () {
          // oldCallback.apply(this, arguments);
          // return true;
        // };        
        
        callbacks.push(callback);
        return this;
      } else {
        return callbacks;
      }
    },
	//执行队列(FIFO: first in first out)
    dequeue: function (elem) {
      //get first callback in stack, and excudce it , if return true, run next callback, other wise stop callback
      elem = elem || this[0];
      var callback, that = this,
          next = function () {  // !important， 核心步骤。传给下一个函数只是一个解决办法而已，还不是具体的callback。与jQuery的Deferred.promise.then方法有相似之处
              that.dequeue(elem);
          };
      if (elem._callbacks) {
        callback = elem._callbacks.shift();
        if (callback) {
          callback.call(elem, next);
        }
      }
      return this;
    },
	//延时
    delay: function (time) {
      return this.queue(function (next) {
        setTimeout(function () {
          next();
        }, time);
      });
    }
  };
  
  queue.fn.init.prototype = queue.fn;
  
  return queue;
}();

//test unit
var fn1 = function (next) {
	console.log("fn1");
	if (confirm("continue?")) {
		next();
	}
};
var fn2 = function (next) {
	console.log("fn2");
	next();
};
queue({}).queue(fn1).queue(fn2).dequeue();