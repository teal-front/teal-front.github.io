/*
*form: 《JavaScript设计模式》
*/
/*享元模式 | flyweight*/
function addEvent (el, type, fn) {
    el.addEventListener(type, fn, false);
}
/**
 * flyweight
 */
var flyweight = (function () {
	//这也是一个享元部分吧？
	var tooltip = function () {
		var delay = 500,
			delayTimeout = null;
		var element = document.createElement("div");
		element.style.cssText = "position:absolute;top:0;left:0;font-size:14px;color:red;";
		console.log("run tooltip");
		document.body.appendChild(element);
		
		return {
		  show: function (e, text) {
			//console.log("tooltip.show");
			element.innerHTML = text;
			element.style.display = "block";
			element.style.left = e.clientX + "px";
			element.style.top = e.clientY + "px";
		  },
		  hide: function () {
			//console.log("tooltip.hide");
			element.style.display = "none";
		  }
		};    
	}();
    
	//用storeTooltip充当享元
    var storeTooltip = null; 
	//Tooltip里的Tooltip不传入参数，而让它的startDelay方法接收参数
    var Tooltip = function () {
        this.delayTimeout = null;
        this.delay = 500;
        this.element = document.createElement('div');
		this.element.style.display = 'none';  
		this.element.style.position = 'absolute';
		this.element.className = 'tooltip';
		document.getElementsByTagName('body')[0].appendChild(this.element);        
    };
    Tooltip.prototype = {
          startDelay: function(e, text) {  //text是在方法里面调用的，这样才使得shareHTML具有复用性
            if(this.delayTimeout == null) {
              var that = this;
              var x = e.clientX;
              var y = e.clientY;
              this.delayTimeout = setTimeout(function() { 
                that.show(x, y, text); 
              }, this.delay);
            }
          },
          show: function(x, y, text) {
            clearTimeout(this.delayTimeout);
            this.delayTimeout = null;
            this.element.innerHTML = text;
            this.element.style.left = (x) + 'px';    
            this.element.style.top = (y + 20) + 'px';
            this.element.style.display = 'block';    
          },
          hide: function() {
            clearTimeout(this.delayTimeout);
            this.delayTimeout = null;
            this.element.style.display = 'none';
          }        
    };
    
    return {
        addTooltip: function (element, text) {
            var t = this._getTooltip();
			var t = storeTooltip || (storeTooltip = new Tooltip());
            
            addEvent(element, "mouseover", function (e) { t.startDelay(e, text); });
            addEvent(element, "mouseout", function (e) { t.hide(); });
        },
        _getTooltip: function () {
            if (!shareHTML) { //享元单元
                shareHTML = new Tooltip();
            }
            return shareHTML;
        }
    };
}());
flyweight.addTooltip(document.querySelector(""), "Lorem SVN");