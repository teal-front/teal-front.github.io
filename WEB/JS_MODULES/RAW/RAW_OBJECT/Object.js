//继承对象原型
var o=[1,2,4];
Object.create=function(o){
	var F=function(){};
	F.prototype=o;
	return new F();
};
b=Object.create(o);
b.a=5;
b.b=2;
for(var i in b) {
	console.log(b[i]);	
}