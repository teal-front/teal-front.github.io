/**
 * arguments与实参之间的引用
 */
var obj = {
    fn1: function (ele) {
        this.fn2.apply(this, arguments);
        this.fn3.apply(this, arguments);
    },
    fn2:function (ele) {
        ele.foo = "bar";
    },
    fn3: function (ele) {
        console.log(ele.foo);
    }
    
};
obj.fn1(document.body);
// =>  result:   "bar"