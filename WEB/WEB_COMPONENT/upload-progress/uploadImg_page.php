<!doctype html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <title>Upload File</title>
    <style>
        .ui-progress {width:200px;height:20px;border:1px solid #008855;}
        .ui-progress-bar {float:left;height:20px;background:#0099FF;}
        .hidden-file {}
        .triggerBtn {
            position: absolute;width:120px;height:20px;background:#FF8080;text-align:center;line-height:20px;
            color:#008855;
        }
        .upload-wrap {
            position: relative;width:120px;height:20px;overflow:hidden;
        }
        .form-file {
            position: absolute;z-index:1;
            top:0;left:0;padding:0;margin:0;
            width:100%;height:100%;
            opacity:0;filter:alpha(opacity=0);
        }
        .file {
            position:absolute;
            top:0;left:0;padding:0;margin:0;
            width:100%;height:100%;
            opacity:0;
            font-size:100px;
        }
    </style>
</head>
<body>

<div class="ui-progress">
    <div class="ui-progress-bar" id="progress-bar"></div>
</div>

<img src="" id="show" style="display:none;" class="hidden-file"/>

<a href="javascript:;" id="imgView" class="triggerBtn">头像预览</a>


<script src="singleFileUpload.js"></script>

<script>
    var SESSION_UPLOAD_PROGRESS_NAME = '<?php print ini_get("session.upload_progress.name"); ?>';
    var view = new RealTimeView(getById("imgView"), getById("show"), getById("progress-bar"), "uploadHandler.php");
</script>

</body>
</html>


