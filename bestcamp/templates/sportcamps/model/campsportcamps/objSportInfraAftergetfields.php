<?php
/**
 * objSportInfraAftergetfields
 *
 */
if (
	!$object ||
	!$object->get('id')
) return '';
//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftergetfields] $object: ' . print_r($object->toArray(), 1));
$record_fields = $object->get('record_fields');
$infrastr_id = $record_fields['infrastr_id'];
$object_id = $record_fields['object_id'];
$pdoFetch = $modx->getService('pdoFetch');
//return '';

/**
 * rent_migx
 */
$migx = [];
$datalinktabells = $pdoFetch->getCollection('cmpInfrastrFcRental', [
	'infrastr_id' => $infrastr_id
]);

if (count($datalinktabells))
{
	$migx_in = [];
	if ($record_fields['rent_migx'])
	{
		$migx_arr = json_decode($record_fields['rent_migx'], true);

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
		$arr = $pdoFetch->getArray('cmpEvaluation', $item['rental_id']);

		$migx[$k]['evaluation'] = $arr['title_en'];
		$migx[$k]['evaluation_id'] = $item['rental_id'];
		$migx[$k]['parent_id'] = $infrastr_id;
		$migx[$k]['price'] = $migx_in[$item['rental_id']]['price'] ?: 0;
		$migx[$k]['active'] = is_array($migx_in[$item['rental_id']]) ? $migx_in[$item['rental_id']]['active'] : 1;
	}
}

$record_fields['rent_migx'] = json_encode($migx);

/**
 * Options
 */
if ($object->get('published'))
{
	$datalinktabells = $modx->getCollection('cmpObjSportInfraOption', [
		'objsportinfra_id' => $object_id
	]);
	$link_ids = [];
	foreach ($datalinktabells as $value)
	{
		$link_ids[] = $value->get('option_id');
	}
	$record_fields['option_ids'] = implode('||', $link_ids);
}

/**
 * inventory_migx
 */
/*
 * Формируем массив видов спорта для этой инфраструктуры
 */
$sports = [];
$datalinktabells = $pdoFetch->getCollection('cmpInfrastrSport', [
	'infrastr_id' => $infrastr_id
]);
if (count($datalinktabells))
{
	foreach ($datalinktabells as $k => $item)
	{
		$sports[] = $item['sport_id'];
	}
}

/*
 * Достаём данные по Инвентарю для каждого вида спорта
 */
$inventory_migx = [];
$select['select'] = 'id,inventory_migx';
$sports_arr = $pdoFetch->getCollection('cmpSports', [
	'id:IN' => $sports
], $select);
if (count($sports_arr))
{
	foreach ($sports_arr as $k => $item)
	{
		foreach ($item['inventory_migx'] as $k1 => $item1)
		{
			//Если для Мнвентаря нет опции аренды - пропускаем
			if (!$item1['evaluation_ids']) continue;

			//Если для Мнвентаря только одна опция аренды - создаём массив
			if (!is_array($item1['evaluation_ids']))
			{
				$item1['evaluation_ids'] = [$item1['evaluation_ids']];
			}

			//Если один и тот же инвентарь уже имеет массив опций аренды - сливаем массивы
			if (is_array($inventory_migx[$item1['inventory_id']]))
			{
				$inventory_migx[$item1['inventory_id']] = array_replace($inventory_migx[$item1['inventory_id']], $item1['evaluation_ids']);
			}
			else
			{
				$inventory_migx[$item1['inventory_id']] = $item1['evaluation_ids'];
			}
		}
	}
}
//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftergetfields] $inventory_migx: ' . print_r($inventory_migx, 1));

/*
 * Формируем MIGX из таблицы связей
 * с учётом имеющихся изменений в текущем объекте
 */
$migx = [];
$datalinktabells = $pdoFetch->getCollection('cmpInventorySport', [
	'sport_id:IN' => $sports
]);
if (count($datalinktabells))
{
	// Вытягиваем сохранённые данные inventory_migx
	$migx_in = [];
	if ($record_fields['inventory_migx'])
	{
		$migx_arr = json_decode($record_fields['inventory_migx'], true);

		if (count($migx_arr))
		{
			foreach ($migx_arr as $item)
			{
				$evaluation_migx = json_decode($item['evaluation_migx'], true);

				// Вытягиваем сохранённые данные evaluation_migx
				$migxEvaluation_in = [];
				if (count($evaluation_migx))
				{
					foreach ($evaluation_migx as $item1)
					{
						$migxEvaluation_in[$item1['evaluation_id']] = $item1;
					}
				}

				$item['evaluation_migx'] = $migxEvaluation_in;

				$migx_in[$item['inventory_id']] = $item;
			}
		}
	}

	$k = 0;
	foreach ($datalinktabells as $item)
	{
		// Исключаем одинаковый Инвентарь
		$iter = true;
		if (count($migx))
		{
			foreach ($migx as $item_migx)
			{
				if ($item_migx['inventory_id'] == $item['inventory_id'])
				{
					$iter = false;
					break;
				}
			}
		}
		if (!$iter) continue;

		$arr = $pdoFetch->getArray('cmpInventory', $item['inventory_id']);

		// Собираем новый inventory_migx
		$evaluation_migx = [];
		foreach ($inventory_migx[$item['inventory_id']] as $k1 => $item1)
		{
			$arrEvaluation = $pdoFetch->getArray('cmpEvaluation', $item1);

			$evaluation_migx[$k1]['evaluation'] = $arrEvaluation['title_en'];
			$evaluation_migx[$k1]['evaluation_id'] = $item1;
			$evaluation_migx[$k1]['parent_id'] = $item['inventory_id'];
			$evaluation_migx[$k1]['price'] = $migx_in[$item['inventory_id']]['evaluation_migx'][$item1]['price'] ?: 0;
			$evaluation_migx[$k1]['active'] = is_array($migx_in[$item['inventory_id']]['evaluation_migx'][$item1]) ? $migx_in[$item['inventory_id']]['evaluation_migx'][$item1]['active'] : 1;
		}

		$migx[$k]['inventory_id'] = $item['inventory_id'];
		$migx[$k]['inventory'] = $arr['title_en'];
		$migx[$k]['evaluation_migx'] = json_encode($evaluation_migx);
		$migx[$k]['active'] = is_array($migx_in[$item['inventory_id']]) ? $migx_in[$item['inventory_id']]['active'] : 1;

		$k++;
	}

	//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftergetfields] $migx: ' . print_r($migx, 1));
}
$record_fields['inventory_migx'] = json_encode($migx);

/**
 * service_migx
 * MIGX config - in_ObjectServices
 */
$service_migx = [];
//- Находим связанные Сервисы
$select['select'] = 'service_id';
if ($SportService = $pdoFetch->getCollection('cmpSportService', array(
	'sport_id:IN' => $sports
), $select))
{
	//TODO Загрузить Инклюд
	//- Получаем текущие данные service_migx
	$service_migx_in = [];
	if ($record_fields['service_migx'])
	{
		$migx_arr = json_decode($record_fields['service_migx'], true);

		if (count($migx_arr))
		{
			foreach ($migx_arr as $item)
			{
				$service_migx_in[$item['service_id']] = $item;
			}
		}
	}

	foreach ($SportService as $item_ss)
	{
		//- Обращаемся к объекту самого Cервиса
		$select['select'] = 'title_en';
		if (!$service = $pdoFetch->getArray('cmpObjServices', $item_ss['service_id'], $select)) continue;

		/**
		 * evaluation_migx
		 * MIGX config - in_evaluationsObj
		 */
		$evaluation_migx = [];
		//- Находим связанные Методы оценок
		$select['select'] = 'evaluation_id,price';
		if ($ServiceEvaluation = $pdoFetch->getCollection('cmpServiceEvaluation', array(
			'service_id' => $item_ss['service_id']
		), $select))
		{
			//- Получаем текущие данные evaluation_migx
			$indataprev = json_decode($service_migx_in[$item_ss['service_id']]['evaluation_migx'], true);
			$evaluation_migx_in = [];
			if (
				$indataprev &&
				is_array($indataprev)
			)
			{
				foreach ($indataprev as $item_em)
				{
					$evaluation_migx_in[$item_em['evaluation_id']] = $item_em;
				}
			}

			foreach ($ServiceEvaluation as $value_se)
			{
				//- Обращаемся к объекту Метода оценок
				$select['select'] = 'title_en';
				if (!$Evaluation = $pdoFetch->getArray('cmpEvaluation', $value_se['evaluation_id'], $select)) continue;

				$indata = $evaluation_migx_in[$value_se['evaluation_id']];
				$in = is_array($indata);

				$evaluation_migx[] = [
					'title' => $Evaluation['title_en'],
					'price' => $value_se['price'],
					'price_new' => $in ? $indata['price_new'] : 0,
					'evaluation_id' => $value_se['evaluation_id'],
					'service_id' => $item_ss['service_id'],
					'active' => $in ? $indata['active'] : 1
				];
			}
		}

		/**
		 * service_migx
		 * MIGX config - in_servicesSlave
		 */
		$serviceSlave_migx = [];
		//- Находим связанные Сервисы
		$select['select'] = 'slave';
		if ($ServiceLink = $pdoFetch->getCollection('cmpServiceLink', array(
			'master' => $item_ss['service_id']
		), $select))
		{
			//- Получаем текущие данные service_migx
			$indataprev = json_decode($service_migx_in[$item_ss['service_id']]['service_migx'], true);
			$serviceSlave_migx_in = [];
			if (
				$indataprev &&
				is_array($indataprev)
			)
			{
				foreach ($indataprev as $item_ssm)
				{
					$serviceSlave_migx_in[$item_ssm['service_id']] = $item_ssm;
				}
			}

			foreach ($ServiceLink as $value_sl)
			{
				//- Обращаемся к объекту связанного Сервиса
				$select['select'] = 'title_en';
				if (!$service_slave = $pdoFetch->getArray('cmpObjServices', $value_sl['slave'], $select)) continue;

				/**
				 * evaluation_migx
				 * MIGX config - in_evaluationsObj
				 */
				$evaluationSlave_migx = [];
				//- Находим связанные Методы оценок
				$select['select'] = 'evaluation_id,price';
				if ($ServiceEvaluation = $pdoFetch->getCollection('cmpServiceEvaluation', array(
					'service_id' => $value_sl['slave']
				), $select))
				{
					//- Получаем текущие данные evaluation_migx
					$indataprev = json_decode($serviceSlave_migx_in[$value_sl['slave']]['evaluation_migx'], true);
					$evaluationSlave_migx_in = [];
					if (
						$indataprev &&
						is_array($indataprev)
					)
					{
						foreach ($indataprev as $item_ssem)
						{
							$evaluationSlave_migx_in[$item_ssem['evaluation_id']] = $item_ssem;
						}
					}

					foreach ($ServiceEvaluation as $value_se)
					{
						//- Обращаемся к объекту Метода оценок
						$select['select'] = 'title_en';
						if (!$Evaluation = $pdoFetch->getArray('cmpEvaluation', $value_se['evaluation_id'], $select)) continue;

						$indata = $evaluationSlave_migx_in[$value_se['evaluation_id']];
						$in = is_array($indata);

						$evaluationSlave_migx[] = [
							'title' => $Evaluation['title_en'],
							'price' => $value_se['price'],
							'price_new' => $in ? $indata['price_new'] : 0,
							'evaluation_id' => $value_se['evaluation_id'],
							'service_id' => $value_sl['slave'],
							'active' => $in ? $indata['active'] : 1
						];
					}
				}

				$indata = $serviceSlave_migx_in[$value_sl['slave']];
				$in = is_array($indata);

				$serviceSlave_migx[] = [
					'service_title' => $service_slave['title_en'],
					'activeplanet' => $in ? $indata['activeplanet'] : 0,
					'evaluation_migx' => json_encode($evaluationSlave_migx),
					'contacts' => $in ? $indata['contacts'] : '',
					'service_id' => $value_sl['slave'],
					'desc_en' => $in ? $indata['desc_en'] : '',
					'desc_de' => $in ? $indata['desc_de'] : '',
					'comment' => $in ? $indata['comment'] : '',
					'active' => $in ? $indata['active'] : 1
				];
			}
		}

		$indata = $service_migx_in[$item_ss['service_id']];
		$in = is_array($indata);

		$service_migx[] = [
			'service_id' => $item_ss['service_id'],
			'service_title' => $service['title_en'],
			'activeplanet' => $in ? $indata['activeplanet'] : 0,
			'evaluation_migx' => json_encode($evaluation_migx),
			'service_migx' => json_encode($serviceSlave_migx),
			'contacts' => $in ? $indata['contacts'] : '',
			'desc_en' => $in ? $indata['desc_en'] : '',
			'desc_de' => $in ? $indata['desc_de'] : '',
			'comment' => $in ? $indata['comment'] : '',
			'active' => $in ? $indata['active'] : 1
		];
	}

	//-$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftergetfields] $SportService: ' . print_r($SportService, 1));
}
$record_fields['service_migx'] = json_encode($service_migx);

/**
 * gallery_migx
 * Загрузка данных из Галереи
 * Сравнение с текущими данными Галереи
 */
$field = 'gallery_migx';
$postvalues = & $record_fields;
$properties = & $record_fields;
require_once $modx->getOption('assets_path') . 'templates/sportcamps/model/galleryMigx.php';
$record_fields[$field] = json_encode($migx);

$object->set('record_fields', $record_fields);
return '';