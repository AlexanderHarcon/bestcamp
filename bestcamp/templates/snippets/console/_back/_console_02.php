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
	// Пропускаем если планета уже обработана
	//if (paramInArray($chains, $key)) continue;

	// Создаем Цепочку из массива планет (первая, она же последняя обрабатываемая)
	$output = [$key];
	$cycle = true;
	while ($cycle)
	{
		// Если в цикле текущая планета является диспозитором самой себф - останавливаем и выходим
		if ($output[0] === $input[$output[0]])
		{
			$cycle = false;
			continue;
		} // Если появившаяся Планета уже есть в итоговом массиве - записываем её и останавливаем цепочку
		else if ($res = paramInArray($chains, $input[$output[0]]))
		{
			$cycle = false;
		}

		// Добавляем Диспозитор перед текущей планетой в Цепочку
		array_unshift($output, $input[$output[0]]);
	}

	/*// Если в текущей Цепочке последняя Планета уже есть итоговом массиве
	// Это значит, что у неё есть ещё одна цепочка
	if ($chains[$output[0]])
	{
		if (!is_array($chains[$output[0]][0]))
		{
			// Ранее полученные данные сохраняем в переменную
			$out = $chains[$output[0]];
			// Перезаписываем её Добавляя ей массив цепочек
			unset($chains[$output[0]]);
			//unset($out[0]);
			array_splice($out, 0, 1);
			$chains[$output[0]][] = $out;
		}

		//array_splice($output, 0, 1);
		//unset($output[0]);
		$chains[$output[0]][] = $output;
	}
	else
		$chains[$output[0]] = $output;
		//$chains[$key] = $output;*/
	//$output_invers = array_reverse($output);
	//array_splice($output, 0, 1);
	//$chains[$key] = $output_invers;
	$chains[$key] = $output;
}


//exit('ggggggggg');
//----------------------------------------------------------
echo '<!DOCTYPE html><head><meta charset="UTF-8"></head>';
echo '<h1>Test</h1>';
//Pre::print($areas);
echo '<pre>' . print_r($chains, 1) . '</pre>';
//echo '<h1>Test1</h1>';
//echo '<pre>' . print_r($test, 1) . '</pre>';
//echo '<h1>Test2</h1>';
//echo '<pre>' . print_r($output, 1) . '</pre>';
//echo $output;
exit;