<?php
/**
 * https://sportcampsbooking.com/assets/templates/snippets/console/console.php
 */
//exit('NON');
require_once 'idx.php';
//-------------------------------------------------------------------------------------------------------
function paramInArray($arr, $param)
{
	return array_filter($arr, function($k) use ($param)
	{
		if (is_array($k))
			return in_array($param, $k);
		else
			return false;
	});
}

$input = [
	'Сонце' => 'Уран',
	'Місяць' => 'Сонце',
	'Північний Вузол' => 'Венера',
	'Південний Вузол' => 'Плутон',
	'Меркурій' => 'Сатурн',
	'Венера' => 'Нептун',
	'Марс' => 'Меркурій',
	'Юпітер' => 'Марс',
	'Сатурн' => 'Уран',
	'Уран' => 'Венера',
	'Нептун' => 'Нептун',
	'Плутон' => 'Сатурн',
	'Хірон' => 'Марс',
	'Селена' => 'Нептун',
	'Ліліт (і)' => 'Сонце',
];

/*$input2 = [];
foreach ($input as $key => $item)
{
	$input2[$key] = $item;
}*/

// Нужен массив цепочек
$chains = [];
//$i = 0;
$test = [];
foreach ($input as $key => $planet)
{
	if (paramInArray($chains, $key)) continue;

	$output = [$key];
	$cycle = true;
	while ($cycle)
	{
		if ($output[0] === $input[$output[0]])
		{
			$cycle = false;
			continue;
		}
		else if ($res = paramInArray($chains, $input[$output[0]]))
		{
			$cycle = false;
		}

		array_unshift($output, $input[$output[0]]);
	}

	if ($chains[$output[0]])
	{
		$out = $chains[$output[0]];
		unset($chains[$output[0]]);
		$chains[$output[0]][] = $out;
		$chains[$output[0]][] = $output;
	}
	else
		$chains[$output[0]] = $output;
}

$output = [];
$test = [];
foreach ($chains as $key => $chain)
{

	if ($res = paramInArray($chains, $key))
	{
		//$test[] = $chain;
		$out = $res[$key];
		unset($res[$key]);
		$resout = [];
		foreach ($res as $res_key => $re)
		{
			$reout = [];
			foreach ($re as $re_key => $r)
			{
				if ($r === $key)
				{
					$reout[$re_key] = $chains[$key];
				}
				else
					$reout[$re_key] = $r;
			}
			$resout[$res_key] = $reout;
		}
	}
	else
	{

		foreach ($chain as $chain_key => $chai)
		{
			//$test[] = $chai;
			if ($res = paramInArray($chain, $key))
			{

				$out = $res[$key];
				unset($res[$key]);
				$resout = [];
				foreach ($res as $res_key => $re)
				{
					$reout = [];
					foreach ($re as $re_key => $r)
					{
						if ($r === $key)
						{
							$reout[$re_key] = $chains[$key];
						}
						else
							$reout[$re_key] = $r;
					}
					$resout[$res_key] = $reout;
				}
				$test[] = $reout;
			}
		}
	}

	$output[$res_key] = $resout[$res_key];
}

//exit('ggggggggg');
//----------------------------------------------------------
echo '<!DOCTYPE html><head><meta charset="UTF-8"></head>';
echo '<h1>Test</h1>';
//Pre::print($areas);
echo '<pre>' . print_r($chains, 1) . '</pre>';
echo '<h1>Test1</h1>';
echo '<pre>' . print_r($test, 1) . '</pre>';
echo '<h1>Test2</h1>';
echo '<pre>' . print_r($output, 1) . '</pre>';
//echo $output;
exit;