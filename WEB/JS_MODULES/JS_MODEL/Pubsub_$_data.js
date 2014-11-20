/**
 * author: yao wang
 * time: 08/12/2014
 * reference: http://blog.rx836.tw/blog/jquery-data-cache/
 * simulate: jQuery.data，jQuery上用来绑定事件、动画列队、data数据
 * 数据不直接绑在DOM上的好处：1.避免循环引用；2.直接暴露数据，不安全
 * http://www.cnblogs.com/aaronjs/p/3370176.html
 */
var $data = {
	cache: {}, //用来储存HTMLElement相应的数据，非HTMLElement元素直接储存在自身
	guid: 1, //increment type, HTMLElement元素与cache数据相元素的钩子
	expando: "Y_data_" + (Math.random() + "").replace(/\D/g, ""), //symbol
	//from jQuery's data, 待定
	noData: {
		"embed": true,
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},
	hasData: function (ele) {
		if (!(this.expando in ele)) return false;
		for (var i in ele[this.expando]) {
			return true;
		}
		return false;
	},
	//key没有区别大小写，也没处理成CamelCase
	data: function (ele, key, value) {
		if (arguments.length === 2) { //get
			if (ele.nodeType) {
				var guid = ele[this.expando];
				if (!guid) return null;
				return (this.cache[guid] || {})[key];
			} else {
				if (!ele[this.expando]) return;
				return ele[this.expando][key];
			}
		} else { //set
			if (ele.nodeType) { //HTMLElement
				ele[this.expando] || (ele[this.expando] = this.guid++);
				this.cache[ele[this.expando]] || (this.cache[ele[this.expando]] = {});
				this.cache[ele[this.expando]][key] = value;
			} else {
				ele[this.expando] || (ele[this.expando] = {});
				ele[this.expando][key] = value;
			}
		}
	},
	removeData: function (ele, key) {
		var guid = ele[this.expando];
		if (!this.cache[guid]) return;
		if (key === undefined) {
			delete this.cache[guid];
		} else {
			delete this.cache[guid][key];
		}
	}
};