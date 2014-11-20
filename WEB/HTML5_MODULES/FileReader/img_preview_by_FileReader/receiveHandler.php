<?php
	$dataURL = $_POST["dataURL"];
	
	base64Array = dataURL2base64($dataURL);
	
	$filepath = time() . "." . base64Array["type"];
    file_put_contents($filepath, base64Array["base64"]);
	
	print $filepath;
	
	function dataURL2base64 ($dataURL) {
		list($type, $data) = explode(";", $dataURL);
		list(, $data) = explode(",", $data);
		
		$data = str_replace(" ", "+", $data); // !important
		
		preg_match("/.+\/(\w+)/", $type, $matches);
		return array(
			"base64" => base64_decode($data),
			"type" => $matches[1]
			);
	}