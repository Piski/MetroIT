<?php
	
    if (isset($_GET["year"]) && isset($_GET["month"]) && isset($_GET["date"]) && isset($_GET["hours"]) && isset($_GET["minutes"])) {
      $year = $_GET["year"];
      $month = $_GET["month"];
      $date = $_GET["date"];
      $hours = $_GET["hours"];
      $minutes = $_GET["minutes"];
    }

/*
    $year = 2014;
    $month = 12;
    $date = 3;
    $hours = 08;
    $minutes = 00;*/
    

    $url = 'https://opendata.metropolia.fi/r1/reservation/search -d';
	$apiKey='plETuc0IEnakfjZIf8n0:';
	$query= "{
	        \"rangeStart\":\"$year-$month-$date\T$hours:$minutes\",
	        \"rangeEnd\":\"$year-$month-$date\T21:00\",
	        \"building\":[\"ETY\"]
	}";

	$session = curl_init($url);
	curl_setopt($session,
	CURLOPT_USERPWD, $apiKey);
	curl_setopt ($session, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt ($session, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($session, CURLOPT_POSTFIELDS, $query);
	$response = curl_exec($session);

	if(!$response) {
		echo curl_error($session);
	}

	curl_close($session);
?>