/**
 * from: http://www.zhangxinxu.com/study/201203/waterfall-layout.html###
 * @type {{container: *, columnNumber: number, columnWidth: number, rootImage: string, indexImage: number, scrollTop: (*|scrollTop|number|rr.propHooks.scrollTop), detectLeft: number, loadFinish: boolean, getIndex: getIndex, appendDetect: appendDetect, append: append, create: create, refresh: refresh, scroll: scroll, resize: resize, init: init}}
 */
var waterFall = {
    container: document.getElementById("container"),
    columnNumber: 1,
    columnWidth: 210,
    // P_001.jpg ~ P_160.jpg
    rootImage: "http://cued.xunlei.com/demos/publ/img/",
    indexImage: 0,

    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
    detectLeft: 0,

    loadFinish: false,

    // 返回固定格式的图片名
    getIndex: function() {
        var index = this.indexImage;
        if (index < 10) {
            index = "00" + index;
        } else if (index < 100) {
            index = "0" + index;
        }
        return index;
    },

    // 是否滚动载入的检测
    appendDetect: function() {
        var start = 0;
        for (start; start < this.columnNumber; start++) {
            var eleColumn = document.getElementById("waterFallColumn_" + start);
            if (eleColumn && !this.loadFinish) {
                if (eleColumn.offsetTop + eleColumn.clientHeight < this.scrollTop + (window.innerHeight || document.documentElement.clientHeight)) {
                    this.append(eleColumn);
                }
            }
        }

        return this;
    },

    // 滚动载入
    append: function(column) {
        this.indexImage += 1;
        var html = '', index = this.getIndex(), imgUrl = this.rootImage + "P_" + index + ".jpg";

        // 图片尺寸
        var aEle = document.createElement("a");
        aEle.href = "###";
        aEle.className = "pic_a";
        aEle.innerHTML = '<img src="'+ imgUrl +'" /><strong>'+ index +'</strong>';
        column.appendChild(aEle);

        if (index >= 160) {
            //alert("图片加载光光了！");
            this.loadFinish = true;
        }

        return this;
    },

    // 页面加载初始创建
    create: function() {
        this.columnNumber = Math.floor(document.body.clientWidth / this.columnWidth);

        var start = 0, htmlColumn = '', self = this;
        for (start; start < this.columnNumber; start+=1) {
            htmlColumn = htmlColumn + '<span id="waterFallColumn_'+ start +'" class="column" style="width:'+ this.columnWidth +'px;">'+
                function() {
                    var html = '', i = 0;
                    for (i=0; i<5; i+=1) {
                        self.indexImage = start + self.columnNumber * i;
                        var index = self.getIndex();
                        html = html + '<a href="###" class="pic_a"><img src="'+ self.rootImage + "P_" + index +'.jpg" /><strong>'+ index +'</strong></a>';
                    }
                    return html;
                }() +
                '</span> ';
        }
        htmlColumn += '<span id="waterFallDetect" class="column" style="width:'+ this.columnWidth +'px;"></span>';

        this.container.innerHTML = htmlColumn;

        this.detectLeft = document.getElementById("waterFallDetect").offsetLeft;
        return this;
    },

    refresh: function() {
        var arrHtml = [], arrTemp = [], htmlAll = '', start = 0, maxLength = 0;
        for (start; start < this.columnNumber; start+=1) {
            var arrColumn = document.getElementById("waterFallColumn_" + start).innerHTML.match(/<a(?:.|\n|\r|\s)*?a>/gi);
            if (arrColumn) {
                maxLength = Math.max(maxLength, arrColumn.length);
                // arrTemp是一个二维数组
                arrTemp.push(arrColumn);
            }
        }

        // 需要重新排序
        var lengthStart, arrStart;
        for (lengthStart = 0; lengthStart<maxLength; lengthStart++) {
            for (arrStart = 0; arrStart<this.columnNumber; arrStart++) {
                if (arrTemp[arrStart][lengthStart]) {
                    arrHtml.push(arrTemp[arrStart][lengthStart]);
                }
            }
        }


        if (arrHtml && arrHtml.length !== 0) {
            // 新栏个数
            this.columnNumber = Math.floor(document.body.clientWidth / this.columnWidth);

            // 计算每列的行数
            // 向下取整
            var line = Math.floor(arrHtml.length / this.columnNumber);

            // 重新组装HTML
            var newStart = 0, htmlColumn = '', self = this;
            for (newStart; newStart < this.columnNumber; newStart+=1) {
                htmlColumn = htmlColumn + '<span id="waterFallColumn_'+ newStart +'" class="column" style="width:'+ this.columnWidth +'px;">'+
                    function() {
                        var html = '', i = 0;
                        for (i=0; i<line; i+=1) {
                            html += arrHtml[newStart + self.columnNumber * i];
                        }
                        // 是否补足余数
                        html = html + (arrHtml[newStart + self.columnNumber * line] || '');

                        return html;
                    }() +
                    '</span> ';
            }
            htmlColumn += '<span id="waterFallDetect" class="column" style="width:'+ this.columnWidth +'px;"></span>';

            this.container.innerHTML = htmlColumn;

            this.detectLeft = document.getElementById("waterFallDetect").offsetLeft;

            // 检测
            this.appendDetect();
        }
        return this;
    },

    // 滚动加载
    scroll: function() {
        var self = this;
        window.onscroll = function() {
            // 为提高性能，滚动前后距离大于100像素再处理
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (!this.loadFinish && Math.abs(scrollTop - self.scrollTop) > 100) {
                self.scrollTop = scrollTop;
                self.appendDetect();
            }

        };
        return this;
    },

    // 浏览器窗口大小变换
    resize: function() {
        var self = this;
        window.onresize = function() {
            var eleDetect = document.getElementById("waterFallDetect"), detectLeft = eleDetect && eleDetect.offsetLeft;
            if (detectLeft && Math.abs(detectLeft - self.detectLeft) > 50) {
                // 检测标签偏移异常，认为布局要改变
                self.refresh();
            }
        };
        return this;
    },
    init: function() {
        if (this.container) {
            this.create().scroll().resize();
        }
    }
};
waterFall.init();
