(function($){
    var random = 0;

    $.expr[':'].random = function(a, i, m, r) {
        if (i == 0) {
            random = Math.floor(Math.random() * r.length);
        }
        return i == random;
    };

})(jQuery);

/*<a href="">1</a>
<a href="">2</a>
<a href="">3</a>
<a href="">4</a>
<script type="text/javascript">
function write(){
	console.log($("a:random").text());
}
window.setInterval(write,1000);*/