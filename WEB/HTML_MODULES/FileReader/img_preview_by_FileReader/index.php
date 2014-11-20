<!doctype html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <title>图片预览BYFileReader</title>
</head>
<body>
<img src="" alt="" id="preview"/>
<input name="file" type="file" id="file"/>

<script>
    if (window.FileReader) {
        document.querySelector("#file").onchange = function () {
            if (this.value== "") return;
            var acceptTypes = /image\/\w+/,
                type = this.files[0].type;
            if (acceptTypes.exec(type)) {
                var fr = new FileReader();
                fr.onload = function (e) {
                    document.querySelector("#preview").src = e.target.result;
                    post("receiveHandler.php", "dataURL=" + encodeURI(e.target.result), function () {
                        //alert("上传成功");
                    });
                };
                fr.readAsDataURL(this.files[0]);
            } else {
                alert("不是图片。");
            }
        };
    }


    function post (url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("post", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.setRequestHeader("yw", "name");
        xhr.onload = callback;
        xhr.send(data);
    }
</script>
</body>
</html>