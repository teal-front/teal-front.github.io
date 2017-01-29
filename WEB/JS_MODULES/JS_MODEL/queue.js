var obj = {};
$("body").queue("test", function (){
  console.log("queue1");
}).queue("test", function () {
  console.log("queue2");
});


var fn1 = function (next) {
  console.log("fn1");
  if (confirm("continue?")) {
    next();
  }
}, fn2 = function (next) {
   console.log("fn2");
  return ;
  next();
};

//$("body").queue(fn1).queue(fn2);
$("body").dequeue();


var queue = function () {
  var queue = function (elem) {
    return new queue.fn.init(elem);
  };
  
  queue.fn = queue.prototype = {
    constructor: queue,
    init: function (elem) {
      this[0] = elem;
      return this;
    },
    queue: function (callback) {
      //set callback in stack elem._callbacks
      var elem = this[0];
      var callbacks = (elem._callbacks || (elem._callbacks = []));
      if (callback) {
        callbacks.push(callback);
        return this;
      } else {
        return callbacks;
      }
    },
    dequeue: function (elem) {
      //get first callback in stack, and excudce it , if return true, run next callback, other wise stop callback
      elem = elem || this[0];
      var callback, that = this,
          next = function () {
              that.dequeue(elem);
          };
      if (elem._callbacks) {
        callback = elem._callbacks.shift();
        if (callback) {
          callback.call(elem, next);
        }
      }
//         while (true) {
//           callback = elem._callbacks.shift();
//           if (callback.call(this, elem._callbacks[0])
//         }
     // }
      return this;
    },
    delay: function (time) {
      return this.queue(function (next) {
        setTimeout(function () {
          next();
        }, time);
      });
    }
  };
  
  queue.fn.init.prototype = queue.fn;
  
  queue.staticFunc = function () {
    
  };
  
  return queue;
}();

queue({}).queue(fn1).delay(4000).queue(fn2).dequeue();
