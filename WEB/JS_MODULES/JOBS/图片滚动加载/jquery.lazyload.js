/**
 *1.判断图片是否在可视区采用Element.getBoundingClientRect()方法
 * use: $(document).lazyload({})
 */
define(function (require, exports, module) {

    $.fn.lazyload = function (options) {
        var defaults = {
            threshold: 50, //离屏幕可视区还有多远时就加载
            alterAttr: "_src",
            loadCallback: $.noop, //每个图片加载完后的回调
            selector: "img",
            uriPlaceholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC" //默认图片地址
        };
        $.extend(true, defaults, options);

        var $window = $(window),
            html = document.documentElement,
            $elements = this.find(defaults.selector);

        var mainFunc = {
            init: function () {
                $elements.each(function () {
                    //this.isLoaded || (this.src = defaults.uriPlaceholder);
                    this.src = this.src || defaults.uriPlaceholder; //有图片已加载好了
                });
            },
            loadImg: function () {
                var that = this;
                $elements.each(function () {
                    if (this.isLoaded) return;
                    if (that._inView(this)) {
                        that._loadCallback(this);
                        this.isLoaded = true;
                    }
                });
                $elements = $($.grep($elements, function (ele) {
                    return !ele.isLoaded;
                }));
            },
            _inView: function (imgObj) {
                var windowHeight = window.innerHeight || html.clientHeight,
                    windowWidth = window.innerWidth || html.clientWidth,
                    threshold = defaults.threshold;
                var clientRect = imgObj.getBoundingClientRect();
                return clientRect.bottom > (-threshold) && clientRect.top < (windowHeight + threshold) &&
                    clientRect.left > (-threshold) && clientRect.right < (windowWidth + threshold);
            },
            _loadCallback: function (ele) {
                var uri = ele.getAttribute(defaults.alterAttr);
                $("<img />").load(function () {
                    ele.nodeName === "IMG" ?
                        ele.src = uri :
                        ele.style.backgroundImage = "url(" + uri + ")";
                    defaults.loadCallback.call(ele);
                })
                    .prop("src", uri);
            }
        };

        mainFunc.init();

        $window.bind({
            "scroll load": $.proxy(mainFunc.loadImg, mainFunc)
        });

        return this;
    };

    return $;
});