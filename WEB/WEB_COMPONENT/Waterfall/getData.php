<?php

    class Waterfall
    {
        final static function output ($lastId = 0, $payloadNum = 3)
        {
            $mysqli = mysqli_connect("localhost", "root", "", "waterfall");
            $query = $mysqli->query("select * from qy_product order by id limit " . ($lastId) * $payloadNum . ",$payloadNum");

            $result = [];
            while ($rows = mysqli_fetch_assoc($query)) {
                $result[] = $rows;
            }
            print json_encode($result);

            mysqli_close($mysqli);
        }
    }

    if (isset($_GET["payloadNum"])) { //get请求
        $payloadNum = $_GET["payloadNum"];
        $lastId = $_GET["lastId"];
        Waterfall::output($lastId, $payloadNum);
    }