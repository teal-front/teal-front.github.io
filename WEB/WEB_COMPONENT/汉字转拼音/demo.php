<?php

include 'ChinesePinyin.class.php';

$Pinyin = new ChinesePinyin();
$words = ["我在", "这里", "呢", "桌子","九大"];
$excludeWords = ["呢", "桌子"];
$result = [];
$mails = "";

$words = array_filter($words, function ($word) {
    global $excludeWords;
    if (in_array($word, $excludeWords)) {
        return false;
    }
    return true;
});
foreach($words as $word) {
    $result[] = $Pinyin -> TransformWithoutTone($word, "");
}
foreach($result as $name) {
    $name = $name . "@qq.cn; "; //todo
    $mails = $mails . $name;
}
echo("result: \n" . $mails);
