define(function (require, exports, module) {
    /**
     * 倒计时
     * <tag data-remainTime="234"><em></em>天<em></em>时<em></em>分<em></em>秒</tag>
     * em中的个数可选，可以不要天，或不要时分，里面会自动判断
     * @param: element: tag元素，原生DOM对象
     * @param: callback: 时间为0时的回调
     */
    var countDown = function () {
        var padTime = function (num) {
            num = num.toString();
            return num.replace(/^(\d)$/, "0$1");
        };
        var timeStampFormat = function (stamp, length) {
            var formatArray = [24 * 60 * 60, 60 * 60, 60, 1];
            length = formatArray.length - length;
            while (length--) {
                formatArray.shift();
            }
            return array_map(formatArray, function (unit) {
                var ret = Math.floor(stamp / unit);
                stamp = stamp % unit;
                return padTime(ret);
            });
        };
        var initTime = function (remainTime) {
            var i = 0, eles = this.getElementsByTagName("em"),
                l = eles.length, ele;
            var timeObj = timeStampFormat(remainTime, l);
            for (; i < l; i++) {
                ele = eles[i];
                ele.innerHTML = timeObj[i];
            }
        };

        return function (element, callback) {
            var that = element;
            var loop = function () {
                var remainTime = that.getAttribute("data-remainTime");
                if (remainTime > 0) {
                    that.setAttribute("data-remainTime", String(remainTime -1));
                    initTime.call(that, remainTime - 1);
                } else {
                    clearInterval(timer);
                    callback && callback.call(that);
                }
            };
            loop();
            var timer = setInterval(loop, 1000);
        }
    }();

    return countDown;


    //--------------------helpers
    function array_map (array, iterator) {
        var length = array.length, i = 0;
        var ret = [];
        for (; i < length; i++) {
            ret.push(iterator(array[i]));
        }
        return ret;
    }
});