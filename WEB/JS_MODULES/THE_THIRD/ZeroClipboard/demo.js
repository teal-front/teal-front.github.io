!function () {
        ZeroClipboard.setDefaults({
            moviePath:   "/gm86_fahaozhongxin%202013.12.24/js/ZeroClipboard.swf",
            hoverClass:  "sprite-copy-hover",
            activeClass: "sprite-copy-active"
        });
        var clip = new ZeroClipboard($(".sprite-copy"));
        clip.on( 'complete', function () {
            alert("¸´ÖÆ³É¹¦£¡" );
        });
}();
/*CSS:
.sprite-copy {}
.sprite-copy-hover{}
.sprite-copy-active {}
*/
/*HTML:
*<em class="sprite-main sprite-numArea " id='copy2'>the copy text</em>
                <a class="sprite-copy" href='javascript:;' data-clipboard-target='copy2'>click me to copy</a>
*/