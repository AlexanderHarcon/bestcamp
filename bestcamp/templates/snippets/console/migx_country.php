<?php
/**
 * https://sportcampsbooking.com/assets/templates/snippets/console/migx_country.php
 */
//exit('NON');
require_once 'idx.php';
//-------------------------------------------------------------------------------------------------------
$migx_countris = file_get_contents("migx_country.json");

$countries = json_decode($migx_countris, true);

$output = [];
foreach ($countries as $key => $country)
{
	$output[$key]['title_en'] = $country['english'];
	$output[$key]['id2'] = $country['alpha2'];
	$output[$key]['id3'] = $country['alpha3'];
	$output[$key]['iso'] = $country['iso'];
}
$output = json_encode($output, JSON_UNESCAPED_UNICODE);
//exit('ggggggggg');
//----------------------------------------------------------
echo '<!DOCTYPE html><head><meta charset="UTF-8"></head>';
echo '<h1>Test</h1>';
//Pre::print($areas);
//echo '<pre>' . print_r($output, 1) . '</pre>';
echo $output;
exit;