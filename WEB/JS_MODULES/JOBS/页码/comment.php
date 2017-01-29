<?php
    extract($_GET, EXTR_OVERWRITE);
    extract($_POST, EXTR_OVERWRITE);
    switch($action) {
        case "comment":
            $segment = array(
                "userIcon" => "images/sc.png",
                "userId" => "yw",
                "stats" => range(0, 2), //亮色星星数
                "unstats" => range(0, 1), //暗色星星数
                "commentContent" => "page: " . $curPage,
                "commentTime" => "1990/07/39 23:00",
                "usefulNum" => 3
            );
            break;
        case "consult":
            $segment = array(
                "member_image" => "images/sc.png",
                "gacontent" => "not bad",
                "member_name" => "yw",
                "gaaddtime" => "1990.03.34 30:00",
                "gaadmincontent" => "page: " . $curPage,
                "gaadminaddtime" => "2008.08.08 11:11"
            );
            break;
    }
    $result = array("contentData" => []);
    for ($i = 0; $i < $type; $i++) {
        $result["contentData"][] = $segment;
    }
    $result["pagiData"] = [(int)$curPage, 50];
    print json_encode($result);