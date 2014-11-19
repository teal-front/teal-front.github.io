!function ($) {
    var Core = {
        //@return {String}
        random: function (array, num) { //include min and max
            array = [].slice.call(array);  //!important 下面会有splice方法会改变array的值
            var ret = "", index;
            while (num--) {
                index = Math.floor(Math.random() * array.length);
                ret += array.splice(index, 1)[0];
            }
            return ret;
        },
        /* 对数字排序, 从小到大
            @return {String}
         */
        numSort: function (num) {
            num = String(num).split("");
            num.sort();
            return num.join("");
        },
        indexOf: function (array, item) {
            for (var i = 0, l = array.length; i < l; i++) {
                if (array[i] === item) return i;
            }
            return -1;
        },
        //去掉数组中指定的值, 默认数值中没重复的
        without: function (array, value) {
            var index = this.indexOf(array, value);
            array.splice(index, 1);
            return array;
        },
        blankspaceFormat: function (string) {
            return String(string).split("").join(" ");
        },
        commaFormat: function (string) {
            return string.split("").join(",");
        },
        factorial: function (n) {
            if (n < 1) return new Error("n must after one");
            var ret = 1;
            while (n) {
                ret *= n;
                n--;
            }
            return ret;
        },
        //计算排列, Ank
        math_rank: function (n, k) {
            return this.factorial(n) / this.factorial(n - k);
        },
        //计算组合, Cnk
        math_combine: function (n, k) {
            return this.math_rank(n, k) / this.factorial(k);
        }
    };

    window.Core = Core;
}(jQuery);