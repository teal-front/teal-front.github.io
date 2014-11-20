/**
 *1.来自gm86，WebZhan的版本。
 *2.多了failure_limit这一参数，还没看懂
 *3.判断位置采取的是$(ele).offset().top 跟 $(window).offsetTop() + $(window).height()的方式
 */
 
 
/**
     * lazyLoad
     */
    (function($, window, document, undefined) {
        var $window = $(window);

        $.fn.lazyload = function(options) {
            var elements = this;//元素集合
            var $container;
            var settings = {
                threshold       : 0,//加载范围阈值
                failure_limit   : 0,//故障允许限制的次数
                event           : "scroll",//事件
                container       : window,//容器
                effect          : "show",//显示效果
                data_attribute  : "original",//真实图片地址存放的属性名
                skip_invisible  : true,//该值用户设定是否跳过不可见的元素
                appear          : null,//图片显示之前的回调函数
                load            : null,//图片显示之后的回调函数
                placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"//默认图片地址
            };


            /**
             * 检测元素所在位置并触发可是区域内元素的appear事件
             */
            function update() {
                var counter = 0;

                elements.each(function() {
                    var $this = $(this);
                    if (settings.skip_invisible && !$this.is(":visible")) {
                        return;
                    }
                    if ($.abovethetop(this, settings) ||
                        $.leftofbegin(this, settings)) {
                        /* Nothing. 元素在可是区域上方或者左侧*/
                    } else if (!$.belowthefold(this, settings) &&
                        !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter  元素在可视区域内，触发对应元素的appear事件*/
                        counter = 0;
                    } else {
                        /* 元素在可视区域下方或者右侧 */
                        if (++counter > settings.failure_limit) {//通过设定的故障限制数量，继续向后遍历元素。以免该元素后面的元素在可见区域内却没有显示。
                            return false;
                        }
                    }
                });

            }

            /**
             * 初始化配置信息
             */
            if(options) {
                /* Maintain BC for a couple of versions. */
                if (undefined !== options.failurelimit) {
                    options.failure_limit = options.failurelimit;
                    delete options.failurelimit;
                }
                if (undefined !== options.effectspeed) {
                    options.effect_speed = options.effectspeed;
                    delete options.effectspeed;
                }

                $.extend(settings, options);
            }

            /* Cache container as jQuery as object. */
            /* 根据配置信息设置并缓存容器 */
            $container = (settings.container === undefined ||
                settings.container === window) ? $window : $(settings.container);

            /* Fire one scroll event per scroll. Not one scroll event per image. */
            /* 如果事件为scroll。则先绑定到容器上 */
            if (0 === settings.event.indexOf("scroll")) {
                $container.bind(settings.event, function() {
                    return update();
                });
            }

            this.each(function() {
                var self = this;
                var $self = $(self);

                self.loaded = false;//初始设定元素loaded属性为false，标识该图片尚未被加载

                /* If no src attribute given use data:uri. */
                /* 如果图片src属性未指定，则根据配置信息设定默认图片地址 */
                if ($self.attr("src") === undefined || $self.attr("src") === false) {
                    $self.attr("src", settings.placeholder);
                }

                /* When appear is triggered load original image. */
                /* 绑为元素绑定appear事件，为避免重复触发，使用one方法进行绑定 */
                $self.one("appear", function() {
                    if (!this.loaded) {//如果没有加载
                        if (settings.appear) {//如果设定了图片显示之前的回调函数，则执行
                            var elements_left = elements.length;
                            settings.appear.call(self, elements_left, settings);
                        }
                        $("<img />")
                            .bind("load", function() {//创建一个img元素并绑定load事件
                                var original = $self.attr(settings.data_attribute);//获取图片真实地址
                                $self.hide();//隐藏图片
                                if ($self.is("img")) {//如果元素是图片则修改src，否则设置元素的background-image为图片地址
                                    $self.attr("src", original);
                                } else {
                                    $self.css("background-image", "url('" + original + "')");
                                }
                                $self[settings.effect](settings.effect_speed);//显示图片

                                self.loaded = true;//将元素的loaded重置为true，标识加载完毕

                                /* Remove image from array so it is not looped next time. */
                                /* 过滤掉所有已经加载过的图片，以节省下一次执行的循环次数 */
                                var temp = $.grep(elements, function(element) {
                                    return !element.loaded;
                                });
                                elements = $(temp);

                                /* 如果设定了图片显示之后的回调函数，则执行 */
                                if (settings.load) {
                                    var elements_left = elements.length;
                                    settings.load.call(self, elements_left, settings);
                                }
                            })
                            .attr("src", $self.attr(settings.data_attribute));//设置创建的img元素的src为真实图片地址，启动加载
                    }
                });

                /* When wanted event is triggered load original image */
                /* by triggering appear.                              */
                /* 如果设定的事件类型不是scroll ，则为元素本身绑定该事件*/
                if (0 !== settings.event.indexOf("scroll")) {
                    $self.bind(settings.event, function() {
                        if (!self.loaded) {
                            $self.trigger("appear");
                        }
                    });
                }
            });

            /* Check if something appears when window is resized. */
            /* 如果容器尺寸发生变化，则执行update重新检测元素 */
            $window.bind("resize", function() {
                update();
            });

            /* With IOS5 force loading images when navigating with back button. */
            /* Non optimal workaround. */
            /* 苹果移动设备兼容 */
            if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
                $window.bind("pageshow", function(event) {
                    if (event.originalEvent && event.originalEvent.persisted) {
                        elements.each(function() {
                            $(this).trigger("appear");
                        });
                    }
                });
            }

            /* Force initial check if images should appear. */
            /* 页面DOM装载完毕之后执行update检测 */
            $(document).ready(function() {
                update();
            });

            return this;
        };

        /* Convenience methods in jQuery namespace.           */
        /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

        /**
         * 判断元素是否在可视区域下方
         * @param element
         * @param settings
         * @returns {boolean}
         */
        $.belowthefold = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
            } else {
                fold = $(settings.container).offset().top + $(settings.container).height();
            }

            return fold <= $(element).offset().top - settings.threshold;
        };

        /**
         * 判断元素是否在可是区域右侧
         * @param element
         * @param settings
         * @returns {boolean}
         */
        $.rightoffold = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = $window.width() + $window.scrollLeft();
            } else {
                fold = $(settings.container).offset().left + $(settings.container).width();
            }

            return fold <= $(element).offset().left - settings.threshold;
        };

        /**
         * 判断元素是否在可视区域上方
         * @param element
         * @param settings
         * @returns {boolean}
         */
        $.abovethetop = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollTop();
            } else {
                fold = $(settings.container).offset().top;
            }

            return fold >= $(element).offset().top + settings.threshold  + $(element).height();
        };

        /**
         * 判断元素是否在可视区域左侧
         * @param element
         * @param settings
         * @returns {boolean}
         */
        $.leftofbegin = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollLeft();
            } else {
                fold = $(settings.container).offset().left;
            }

            return fold >= $(element).offset().left + settings.threshold + $(element).width();
        };

        /**
         * 判断元素是否在可是区域内（是否需要装载图片）
         * @param element
         * @param settings
         * @returns {boolean}
         */
        $.inviewport = function(element, settings) {
            return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
        };

        /* Custom selectors for your convenience.   */
        /* Use as $("img:below-the-fold").something() or */
        /* $("img").filter(":below-the-fold").something() which is faster */
        /* 工具附带的自定义伪类，方便使用。 */
        $.extend($.expr[":"], {
            "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
            "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
            "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
            "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
            "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
            /* Maintain BC for couple of versions. */
            "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
            "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
            "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
        });

    })(jQuery, window, document);