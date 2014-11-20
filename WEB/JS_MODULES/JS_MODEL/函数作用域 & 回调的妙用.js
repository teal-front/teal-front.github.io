//参见于jQuery1.5+的Deferred.then的实现
var deferred = function (func) {
	var dfd = {};
	
	var promise = {
		then: function () {
			var fns = arguments;
			//newDfd是调用then之后产生的新dfd对象
			return deferred(function (newDfd) {
				//这里的dfd因为作用域指向当前dfd，也就是老的dfd对象。
				//可以看出返回的两次expando不一样
				console.log("old ", dfd.expando);
				console.log("new ", newDfd.expando);
				
				//dfd.dosomething();
			});
		
		}
	};
	
	dfd.expando = Math.random();
    console.log(dfd.expando); //输出dfd的expando
	dfd.then = promise.then;
	
  if (func) {
    func.call(dfd, dfd);
  }
	
	return dfd;
};

deferred().then();



/**
 * 串联执行异步回调
 * from: 《Node.js高级编程》,19章,控制回调流程, P181
 * node.js package async
 */
var async = function (callbacks, callback) {
  //
  var funcs = callbacks.slice(0);
  
  var processNext = function (param) {
	//对于所有的回调函数共有的部分，可集中在这里处理
	//callback(param);
  
    var fn = funcs.shift(),
        args = Array.prototype.slice.call(arguments, 0);
    if (fn) {
      args.push(processNext); //核心代码：把processNext传递给下一个回调。思想同jQuery的queue
      fn.apply(null, args);
    } else {
      callback.apply(null, args);
    }
  };
  
  processNext.call(this);
  
};

async([
  function (next) {
    setTimeout(function () {
      console.log("fn1");
      next();
    }, 1000);
  }, 
  function (next) {
    setTimeout(function () {
      console.log("fn2");
      next();
    }, 1000);
  }
], done);

function done () {
  console.log("done");
}