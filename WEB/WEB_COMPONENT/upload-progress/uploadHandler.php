<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    /**
     * 处理上传文件
     */
    header('Content-Type:text/html;charset=utf-8'); //页面输出格式，防止IE中文件名出现中文乱码

    if (isset($_FILES["uploadfile"]["tmp_name"]) && is_uploaded_file($_FILES["uploadfile"]["tmp_name"])) {

        //获得base64编码
        $fileType = $_FILES["uploadfile"]["type"];
        $fileContent = file_get_contents($_FILES['uploadfile']['tmp_name']);
        $dataUrl = 'data:' . $fileType . ';base64,' . base64_encode($fileContent);

        //iconv("UTF-8", "gb2312", "")用于在window系统中把文件名转为中文字符，因为window系统中字符编码默认为gb2312
        $result = move_uploaded_file($_FILES["uploadfile"]["tmp_name"],
            __DIR__ . DIRECTORY_SEPARATOR . iconv("UTF-8","gb2312", $_FILES["uploadfile"]["name"]));
        if ($result) {
            $url = dirname($_SERVER["PHP_SELF"]) . "/" . $_FILES["uploadfile"]["name"];
        } else {
            $url = null;
        }

    }

    if (isset($_GET["callback"])) {
        /*
         * submit by form
         */
        print '<script>' .
            'parent.' . $_GET["callback"] . "('" .$url . "')" .
            '</script>';
    } else if ($_POST["type"] == "formData") {
        /*
         * submit by ajax & FormData
         */
        print $dataUrl;
    }

} else if ($_SERVER["REQUEST_METHOD"] == "GET") {
    /*
     * 返回上传进度（只有上面是submit by form时才需要从服务器返回，不然就用xhr.upload.onprogerss事件）
     */
    //session_start(); //if not auto_start session

    $key = ini_get("session.upload_progress.name");
    $value = ini_get("session.upload_progress.prefix") . $_GET[$key];

    //取消上传
    if (isset($_SESSION[$value], $_GET["action"]) && $_GET["action"] == "cancelUpload") {
        $_SESSION[$key]['cancel_upload'] = true;
        exit(json_encode(array("status" => 1)));
    }

    //返回进度百分比
    if (isset($_SESSION[$value])) {
        $current = $_SESSION[$value]["bytes_processed"];
        $total = $_SESSION[$value]["content_length"];
        $ret = $current < $total ? ceil($current / $total * 100) : 100;
        print $ret;
    } else {
        print 100;
    }
}

