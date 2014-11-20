/*
 * http://nuysoft.iteye.com/blog/1217884
 * 作者：nuysoft/JS攻城师/高云　QQ：47214707　EMail：nuysoft@gmail.com
 * 前记：本文收集了jQuery中出现的各种遍历技巧和场景  
 */


// 这个没看懂：什么情况下某些数组元素遍历不到？
// 遍历动态数组（事件），不能缓存length属性，j++之前先执行j--，保证不会因为数组下标的错误导致某些数组元素遍历不到
for ( j = 0; j < eventType.length; j++ ) {  
eventType.splice( j--, 1 );  
}  
for ( var i = 1; i < results.length; i++ ) {  
    if ( results[i] === results[ i - 1 ] ) {  
        results.splice( i--, 1 );  
    }  
}  

// while遍历动态数组（异步队列），总是获取第一个元素，直到数组为空，或遇到值为undefined的元素  
while( callbacks[ 0 ] ) {  
    callbacks.shift().apply( context, args );  
}  

// 迭代过程中尽可能减少遍历次数（事件），如果你能知道从哪里开始遍历的话，这里是pos  
for ( j = pos || 0; j < eventType.length; j++ ) {  
  
}  

//倒序遍历（事件），减少了几个字符：循环条件判断，合并i自减和i取值
//，倒序遍历会有浏览器优化，稍微提升遍历速度  
for ( var i = this.props.length, prop; i; ) {  
    prop = this.props[ --i ];  
    event[ prop ] = originalEvent[ prop ];  
}  


// 遍历DOM子元素  
for ( node = parent.firstChild; node; node = node.nextSibling ) {  
    if ( node.nodeType === 1 ) {  
        node.nodeIndex = ++count;  
    }  
} 