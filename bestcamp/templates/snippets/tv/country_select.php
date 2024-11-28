<?php
/** @var modX $modx */
$input = json_decode($input, true);

$months = [];
foreach ($input as $item)
{
	$months[] = $item['param_en'];
}

return $months;