/**
  author: yaowang
  time: 2014-10-25
  reference: http://www.html-js.com/article/TJ-idiotic-fly-front-three-simple-realization-of-the-MVVM
  思路：1.遍历指定元素及子元素的属性节点与文本节点，用初始的Model代替，并缓存相应元素及元素上的原始模块（{{tmpl}}）;
    2.绑定事件，使UI界面改变时相应的Model值跟着改变；
    3.监视Model的变化（定时器或Object.defineProperty），使UI同步改变。
*/
var Mvvm = function (dom, model) {
  var that = this;
  this.start = "{{";
  this.end = "}}";
  this.dom = dom;
   //Object.defineProperty
  //this.model = this.getProxyModel(model);
  //定时器
  this.model = model; //定时器 ,store changing data
  this.proxyModel = {}; //定时器Model,store original data
  this.watch();

  this.model2sync = {}; //储存Node的节点及原始模块
  Object.keys(this.model).map(function (key) {
    that.proxyModel[key] = that.model[key];
  });

  //view -> model: bind event
  document.querySelector("#text").onkeyup = function (e) {
      var name = this.name;
      that.model[name] = this.value;
  };
  //model -> view
  this.renderDom(this.dom);
  console.dir(this.model2sync);
};
Mvvm.fn = Mvvm.prototype;

Mvvm.fn.watch = function () {
  var that = this;
  window.setInterval(function () {
    each(that.model, function (key) {
      if (that.model[key] !== that.proxyModel[key]) {
        that.model2sync[key].forEach(function (obj) {
            obj.node.textContent = that.renderStr(obj.raw);
          });
      }
    });
    Object.keys(that.model).map(function (key) {
      that.proxyModel[key] = that.model[key];
    });
  }, 50);
};
//设置代理数据对象
Mvvm.fn.getProxyModel = function (model) {
  var obj = {}, that = this;
  each(model, function (key) {
    !function (key) {
      Object.defineProperty(obj, key, {
        set: function (value) {
          model[key] = value;
          that.model2sync[key].forEach(function (obj) {
            obj.node.textContent = that.renderStr(obj.raw);
          });
        },
        get: function () {
          return model[key];
        }
      });
    }(key);    
  });
  return obj;
};
//操作元素的属性节点与文本节点，及子元素的
Mvvm.fn.renderDom = function (dom) {
  var that = this;
  var attributes = [].slice.call(dom.attributes),
      childNodes = [].slice.call(dom.childNodes);
  attributes.forEach(function (elem) {
    that._template(elem);
  });
  childNodes.forEach(function (elem) {
    if (elem.nodeType === 1) {
      that.renderDom(elem);
    }
    that._template(elem);
  });
};
//替换模版中的占位符
Mvvm.fn._template = function (node) {
  var text = (node.textContent || node.value).split(this.start);
  if (!text.length) return "";
  var ret = "";
  for (var i = 0, l = text.length, t; i < l; i++) {
      t = text[i].split(this.end);
      if (t.length === 1) {
        ret += t[0];
      } else {
        ret += this.model[t[0]] + t[1];
        (this.model2sync[t[0]] || (this.model2sync[t[0]] = [])).push({
          node: node,
          raw: node.textContent
        });
        console.log("raw: ", node.textContent);
      }
    }
  node.textContent = ret;
};
//
Mvvm.fn.renderStr = function (string) {
  var text = string.split(this.start);
  if (!text.length) return "";
  var ret = "";
  for (var i = 0, l = text.length, t; i < l; i++) {
      t = text[i].split(this.end);
      if (t.length === 1) {
        ret += t[0];
      } else {
        ret += this.model[t[0]] + t[1];
      }
    }
    return ret;
};

//----------------------helpers
function each (obj, fn) {
  for (var key in obj) {
    fn.call(obj, key);
  }
}