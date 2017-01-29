/**
 * @param ele: 移动的元素
 * @param direction: 移动的方向,e.g. left/right/top/bottom
 * @param offset: 移动的距离
 * @param duration: 移动的时间，秒
 */
function animate(ele, direction, offset, duration) {
    var count = duration * 1000 / 50,
        step = offset / count,
        i = 0,
        timer;
    setTimeout(function () {
        ele.style[direction] = parseInt(ele.style[direction]) + step + "px";
        timer = setTimeout(arguments.callee, 50);
        if (++i >= count) {
            clearTimeout(timer);
        }
    }, 50);
}
// var oT = $(".list4").find("li:first")[0];
// animate(oT, "left", 200, 1);