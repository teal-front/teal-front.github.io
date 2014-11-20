<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>waterfall</title>
    <link rel="stylesheet" href="Public/css/base.css"/>
    <script src="Public/js/jquery-1.10.2.min.js"></script>
    <script src="Public/js/waterfall.js"></script>
</head>
<body>
<?php
require_once("getData.php");
?>
<script>
    var waterfall_init_data = <?php print Waterfall::output(0, 12); ?>;
</script>
<div class="container">
    <div class="col">
    </div>
    <div class="col"></div>
    <div class="col"></div>
</div>
<script type="text/x-template" id="item-template">
    <div class="item" id="${id}">
        <!-- 标题 -->
        <div class="title"><a href="${href}" target="_blank"></a></div>
        <!-- /标题 -->
        <!-- 图片 -->
        <a  class="img" href="${href}" target="_blank"><img src="${imgURI}"></a>
        <!-- /图片 -->
        <!-- 简介 -->
        <div class="intro">${intro}</div>
        <!-- /简介 -->

        <!-- 浏览及评论数量 -->
        <div class="opt-info">
            <span><em>${viewNum}</em>浏览</span>
            <span><em>${commentNum}</em>评论</span>
        </div>
        <!-- /浏览及评论数量 -->
    </div>
</script>

<script>
    var case1 = new Waterfall({

    });
</script>
</body>
</html>