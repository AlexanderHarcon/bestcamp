<?php
/**
 * objectServicesAftergetfields
 * Получение данных из связанных таблиц из таблицы связей cmpServiceEvaluation
 */
if (!$object) return '';
//$modx->log(modX::LOG_LEVEL_ERROR,'[objectServicesAftergetfields] $object: ' . print_r($object->toArray(), 1));
$record_fields = $object->get('record_fields');
$service_id = $record_fields['service_id'];
$pdoFetch = $modx->getService('pdoFetch');
//return '';

/**
 * evaluation_migx
 */
$migx = [];
$datalinktabells = $pdoFetch->getCollection('cmpServiceEvaluation', [
	'service_id' => $service_id
]);

if (count($datalinktabells))
{
	$migx_in = [];
	if ($record_fields['evaluation_migx'])
	{
		$migx_arr = json_decode($record_fields['evaluation_migx'], true);

		if (count($migx_arr))
		{
			foreach ($migx_arr as $item)
			{
				$migx_in[$item['evaluation_id']] = $item;
			}
		}
	}

	foreach ($datalinktabells as $k => $item)
	{
		$arr = $pdoFetch->getArray('cmpEvaluation', $item['evaluation_id']);

		$migx[$k]['evaluation_id'] = $item['evaluation_id'];
		$migx[$k]['service_id'] = $service_id;
		$migx[$k]['price'] = $item['price'];
		$migx[$k]['price_new'] = $migx_in[$item['evaluation_id']]['price_new'] ?: 0;
		$migx[$k]['active'] = is_array($migx_in[$item['evaluation_id']]) ? $migx_in[$item['evaluation_id']]['active'] : 1;
		$migx[$k]['title'] = $arr['title_en'];
	}
}

//$modx->log(modX::LOG_LEVEL_ERROR,'[objectServicesAftergetfields] $migx: ' . print_r($migx, 1));

$record_fields['evaluation_migx'] = json_encode($migx);

/**
 * service_migx
 */
$migx = [];
$datalinktabells = $pdoFetch->getCollection('cmpServiceLink', [
	'master' => $service_id
]);

if (count($datalinktabells))
{
	$migx_in = [];
	if ($record_fields['service_migx'])
	{
		$migx_arr = json_decode($record_fields['service_migx'], true);

		if (count($migx_arr))
		{
			foreach ($migx_arr as $item)
			{
				$migx_in[$item['service_id']] = $item;
			}
		}
	}

	foreach ($datalinktabells as $k => $item)
	{
		//- массив данных Подчиненного сервиса
		$arr = $pdoFetch->getArray('cmpObjServices', $item['slave']);

		//- массив данных Подчиненного сервиса в текущей таблице
		$migx_in_current = $migx_in[$item['slave']];
		$migx_in_status = false;
		//- проверяем наличие массива данных Подчиненного сервиса в текущей таблице
		if (is_array($migx_in_current)) $migx_in_status = true;

		/**
		 * service_migx - evaluation_migx
		 */
		//- Формируем новые данные по Evaluation для Подчиненного сервиса
		$evaluation_migx = [];
		$datalinktabells_in = $pdoFetch->getCollection('cmpServiceEvaluation', [
			'service_id' => $item['slave']
		]);

		if (count($datalinktabells_in))
		{
			//- Формируем удобные данные по Evaluation для Подчиненного сервиса в текущей таблице
			$evaluation_migx_in = [];
			if (
				$migx_in_status
				&& $migx_in_current['evaluation_migx']
			)
			{
				//- Если есть выгребаем данные по Evaluation для Подчиненного сервиса в текущей таблице
				$evaluation_migx_arr = json_decode($migx_in_current['evaluation_migx'], true);

				if (count($evaluation_migx_arr))
				{
					foreach ($evaluation_migx_arr as $item_in)
					{
						$evaluation_migx_in[$item_in['evaluation_id']] = $item_in;
					}
				}
			}

			//- Ппоходим по миеющимся связям
			foreach ($datalinktabells_in as $kin => $item_in)
			{
				//- массив данных Evaluation
				$arr_Evaluation = $pdoFetch->getArray('cmpEvaluation', $item_in['evaluation_id']);

				//- массив данных Подчиненного сервиса в текущей таблице
				$evaluation_migx_in_current = $evaluation_migx_in[$item_in['evaluation_id']];
				$evaluation_migx_in_status = false;
				//- проверяем наличие массива данных Подчиненного сервиса в текущей таблице
				if (is_array($evaluation_migx_in_current)) $evaluation_migx_in_status = true;

				$evaluation_migx[$kin] = [
					'evaluation_id' => $item_in['evaluation_id'],
					'service_id' => $item_in['service_id'],
					'price' =>  $item_in['price'],
					'price_new' => $evaluation_migx_in_status ? $evaluation_migx_in_current['price_new'] : 0,
					'title' => $arr_Evaluation['title_en'],
					'active' => $evaluation_migx_in_status ? $evaluation_migx_in_current['active'] : 1
				];
			}
		}

		//$modx->log(modX::LOG_LEVEL_ERROR,'[objectServicesAftergetfields] $evaluation_migx: ' . print_r($evaluation_migx, 1));

		$migx[$k] = [
			'service_id' => $item['slave'],
			'service_title' => $arr['title_en'],
			'activeplanet' => $migx_in_status ? $migx_in_current['activeplanet'] : 0,
			'contacts' => $migx_in_status ? $migx_in_current['contacts'] : '',
			'desc_en' => $migx_in_status ? $migx_in_current['desc_en'] : '',
			'desc_de' => $migx_in_status ? $migx_in_current['desc_de'] : '',
			'comment' => $migx_in_status ? $migx_in_current['comment'] : '',
			'evaluation_migx' => json_encode($evaluation_migx),
			'active' => $migx_in_status ? $migx_in_current['active'] : 1
		];
	}
}
//$modx->log(modX::LOG_LEVEL_ERROR,'[objectServicesAftergetfields] $migx: ' . print_r($migx, 1));
$record_fields['service_migx'] = json_encode($migx);

$object->set('record_fields', $record_fields);

return '';