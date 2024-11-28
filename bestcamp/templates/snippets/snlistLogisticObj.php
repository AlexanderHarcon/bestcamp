<?php
/** @var modX $modx
 * Вывод списка объектов логистики в Объекты проживания в зависимости от выбранного города
 * TODO Рефактор
 */

//- Загружаем сервис
if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

//- Загружаем массив данных по Городу
if (!$res_arr = $pdoFetch->getArray('msProductData', $id))
{
	$modx->log(MODX_LOG_LEVEL_ERROR,'[snlistLogisticObj] $res_arr: Нет Объекта с таким ID: ' . $id);
	return '- not data -==0';
}

if (!$res_arr['city'])
{
	$modx->log(MODX_LOG_LEVEL_ERROR,'[snlistLogisticObj] $res_arr[city]: Нет данных по городу у объекта с ID: ' . $id);
	return '- not data -==0';
}

//- Загружаем массив данных по Городу
if (!$city_arr = $pdoFetch->getArray('cmpCities', $res_arr['city']))
{
	$modx->log(MODX_LOG_LEVEL_ERROR,'[snlistLogisticObj] $city_arr: there is no such city in the database ID: ' . $res_arr['city']);
	return '- not data -==0';
}

//- Если нет данных по Логистике или эти данные не соответствуют формату
if (!$city_arr['logistics'] || !is_array($city_arr['logistics']))
{
	$modx->log(MODX_LOG_LEVEL_ERROR,'[snlistLogisticObj] $city_arr[logistics]: There is no data on the logistics of this City ID: ' . $res_arr['city']);
	return '- not data -==0';
}

//- Загружаем данные по Объектам логистики
$param['select'] = 'name,key';
$logistic_arr = $pdoFetch->getCollection('MsfmStorageMember', array(
	'storage_id' => 3,
	'enable' => 1
), $param);

//- Проходим по имеющейся логистике Города
$output = [];
foreach ($city_arr['logistics'] as $k => $logistics)
{
	foreach ($logistic_arr as $logistic)
	{
		if ($logistic['key'] == $logistics['object'])
		{
			//- Записываем данные по объекту логистики
			$output[$k] = $logistic['name'];
			break;
		}
	}
	$output[$k] .= ': ' . $logistics['title'];
}

//-$modx->log(MODX_LOG_LEVEL_ERROR, print_r($output,true) );

return implode('||', $output);