/**
 *1.判断图片是否在可视区采用Element.getBoundingClientRect()方法
 */
$.fn.lazyload = function (options) {
        var defaults = {
            threshold: 50, //离屏幕可视区还有多远时就加载
            alterAttr: "_src",
            loadCallback: $.noop, //每个图片加载完后的回调
            selector: "img"
        };
        defaults = $.extend(defaults, options);

        var $this = $(this),
            $window = $(window),
            $elements = $this.find(defaults.selector);

        var mainFunc = {
            loadImg: function () {
                var that = this;
                $elements.each(function () {
                    if (this.isLoaded) return;
                    if (that._inView(this)) {
                        that._loadCallback(this);
                        this.isLoaded = true;
                        //console.log(this.id);
                        //document.title += this.id;
                    }
                });
                $elements = $($.grep($elements, function (ele) {
                    return !ele.isLoaded;
                }));
            },
            _inView: function (imgObj) {
                var windowHeight = window.innerHeight || document.documentElement.clientHeight,
                    windowWidth = window.innerWidth || document.documentElement.clientWidth,
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

        $window.bind({
            "scroll load": $.proxy(mainFunc.loadImg, mainFunc)
        });
    };