/**
 * 客户端检测是否支持Webp图片，重置懒惰加载图片地址
 * @检测结果用localStorage保存
 * 依赖jQuery
 *
 * 待优化：
 *  1、客户端不支持JS时，由服务器端根据UA判断
 *  2、不支持用户本地保存Wepb图片时，图片的png/jpg转化
 *
 *  代码参考：http://zmx.im/blog?bname=webp
 */


define('modules/webp/1.0.0/webp', function (require, exports, module) {

    'use strict';

    var Webp = function () {
        this.initialize();
    };

    Webp.supportClass = '.js-webp';    // 待加载webp的选择器
    Webp.storageName = '__webpa__';      // localStorage保存webp结果的key
    Webp.webpEnableName = 'available'; // 支持webp时，localStorage储存的值
    Webp.webpDisableName = 'disable';  // 不支持webp时，localStorage储存的值
    Webp.enableFlag = '__webp_enabled__'; // webp后的标记，防止多次重置src
    Webp.webpBase64Src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA=='; // webp data协议

    Webp.prototype = {
        constructor: Webp,
        /**
         * 在本地储存webp的支持结果
         */
        initialize: function () {
            if (!window.localStorage || typeof localStorage !== 'object') return;

            var name = Webp.storageName;
            if (!localStorage.getItem(name) || (localStorage.getItem(name) !== Webp.webpEnableName && localStorage.getItem(name) !== Webp.webpDisableName)) {

                var img = document.createElement('img');

                img.onload = function () {
                    try {
                        localStorage.setItem(name, Webp.webpEnableName);
                    } catch (ex) {
                    }
                };

                img.onerror = function () {
                    try {
                        localStorage.setItem(name, Webp.webpDisableName);
                    } catch (ex) {
                    }
                };
                img.src = Webp.webpBase64Src;
            }
        },
        /**
         * 判断是否支持webp
         * @returns {boolean}
         * @private
         */
        _detectWebp: function () {
            if (window.localStorage && typeof localStorage === 'object') {
                return localStorage.getItem(Webp.storageName) === Webp.webpEnableName;
            }
            return false;
        },
        /**
         * 批量替换懒惰加载的图片的src
         * @p.s. 懒惰加载的标记为[data-original]，业务上的懒惰加载需使用$.data()取，不能用attr()
         */
        enableLazyLoadImg: function () {
            var is_support_webp = this._detectWebp(),
                support_class = Webp.supportClass;

            if (is_support_webp) {
                var images  = $(support_class + '[data-original]').not(function () {
                    return !!this[Webp.enableFlag];
                });
                images.each(function () {
                    var raw_src = $(this).data('original'),
                        final_src;

                    final_src = !/\.webp$/.test(raw_src) ? (raw_src + '.webp') : raw_src;

                    $(this).data('original', final_src);

                    this[Webp.enableFlag] = true;
                });
            }
        }
    };

    module.exports = Webp;
});

