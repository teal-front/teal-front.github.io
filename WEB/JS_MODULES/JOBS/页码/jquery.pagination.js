define(function (require, exports, module) {
    /*
     * description: 不带省略号，只显示固定页码数，不显示页首与页尾
     */
    var renderPagination1 = function (pagingCurrent, pagingSum) {
        var pagingHTML = "", linkSum = 8;
        var start = Math.max(1, pagingCurrent - parseInt(linkSum/2));
        var end = Math.min(pagingSum, start + linkSum - 1);
        start = Math.max(1, end - linkSum + 1);

        if (pagingCurrent != 1) {
            pagingHTML += '<a href="javascript:;" class="btn btn-24 btn-theme6" data-page ="' + (pagingCurrent - 1) + '">上一页</a>';
        }
        for (var i = start, l = end + 1; i < l; i++) {
            if (i == pagingCurrent) {
                pagingHTML += '<a href="javascript:;" class="paging-item paging-current" data-page ="' + pagingCurrent + '">'+pagingCurrent+'</a>';
            } else {
                pagingHTML += '<a href="javascript:;" class="paging-item" data-page ="' + i + '">' + i + '</a>';
            }
        }
        if (pagingCurrent != pagingSum) {
            pagingHTML += '<a href="javascript:;" class="btn btn-24 btn-theme6" data-page ="' + (pagingCurrent + 1) + '">下一页</a>';
        }

        return pagingHTML;
    };

    /*
     * description: 带省略号的分页，总显示页首与页尾
     * good parts from: http://flaviusmatis.github.io/simplePagination.js/#page-15
     * @param edges: 两侧总显示的页码数
     * @param displayedPages: 中间显示的页码数
     */
    var renderPagination2 = function (currentPage, pages) {
        var o = {displayedPages : 5, edges : 2, ellipseText: "..."};
        o.currentPage = currentPage;
        o.pages = pages;
        o.halfDisplayed = o.displayedPages /2;

        var _getInterval = function(o) {
            return {
                start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) : 0),
                end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
            };
        };
        var _appendItem = function (pageNum, o) {
            pageNum++;
            var plus = pageNum == o.currentPage ? "paging-current" : "";
            return '<a href="javascript:;" class="paging-item '+ plus +'" data-page ="' + pageNum + '">' + pageNum + '</a>'
        };
        var draw = function (o) {
            var pagingHTML = "", interval = _getInterval(o);

            // Generate Prev link
            if (o.currentPage != 1) {
                pagingHTML += '<a href="javascript:;" class="btn btn-24 btn-theme6" data-page ="' + (o.currentPage - 1) + '">上一页</a>';
            }
            // Generate start edges
            if (interval.start > 0 && o.edges > 0) {
                var end = Math.min(o.edges, interval.start);
                for (i = 0; i < end; i++) {
                    pagingHTML += _appendItem(i, o);
                }
                if (o.edges < interval.start && (interval.start - o.edges != 1)) {
                    pagingHTML += '<a href="javascript:;" class="paging-item ellipse">' + o.ellipseText + '</a>';
                } else if (interval.start - o.edges == 1) {
                    pagingHTML += _appendItem(o.edges, o);
                }
            }
            // Generate interval links
            for (i = interval.start; i < interval.end; i++) {
                pagingHTML += _appendItem(i, o);
            }
            // Generate end edges
            if (interval.end < o.pages && o.edges > 0) {
                if (o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)) {
                    pagingHTML += '<a href="javascript:;" class="paging-item ellipse">' + o.ellipseText + '</a>';
                } else if (o.pages - o.edges - interval.end == 1) {
                    pagingHTML += _appendItem(interval.end++, o);
                }
                var begin = Math.max(o.pages - o.edges, interval.end);
                for (i = begin; i < o.pages; i++) {
                    pagingHTML += _appendItem(i, o);
                }
            }
            // Generate Next link
            if (o.currentPage != o.pages) {
                pagingHTML += '<a href="javascript:;" class="btn btn-24 btn-theme6" data-page ="' + (o.currentPage + 1) + '">下一页</a>';
            }

            return pagingHTML;
        };

        return draw(o);
    };

    module.exports = {
        "pagination1": renderPagination1,
        "pagination2": renderPagination2
    };

});