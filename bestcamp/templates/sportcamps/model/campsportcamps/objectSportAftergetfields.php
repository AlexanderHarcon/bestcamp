<?php
/**
 * objectSportAftergetfields
 *
 */
if (
	!$object ||
	!$object->get('id')
) return '';
//$modx->log(modX::LOG_LEVEL_ERROR,'[objectSportAftergetfields] $object: ' . print_r($object->toArray(), 1));
$record_fields = $object->get('record_fields');
$object_id = $record_fields['object_id'];
$pdoFetch = $modx->getService('pdoFetch');
//return '';

/**
 * sport_en
 * ico
 */
$select['select'] = 'sport_en,ico';
if ($arr = $pdoFetch->getArray('cmpSports', $record_fields['sport_id'], $select))
{
	$record_fields['sport_en'] = $arr['sport_en'];
	$record_fields['ico'] = $arr['ico'] ? $arr['ico'] : $arr['ico'];
}

/**
 * infraobj_text
 */
$infraobj_text = [];
$select['select'] = 'title_en';
if ($arr = $pdoFetch->getCollection('cmpObjSportInfra', array(
	'id:IN' => $record_fields['infraobj_ids']
), $select))
{
	foreach ($arr as $value)
	{
		$infraobj_text[] = $value['title_en'];
	}
}
$record_fields['infraobj_text'] = implode("\r\n", $infraobj_text);

/**
 * service_migx
 * MIGX config - in_ObjectServices
 */
//- Данные по Сервисам в Спорте
$service_migx = [];
//- Находим связанные Сервисы
$select['select'] = 'service_id';
if ($SportService = $pdoFetch->getCollection('cmpSportService', array(
	'sport_id' => $record_fields['sport_id']
), $select))
{
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
}
$record_fields['service_migx'] = json_encode($service_migx);

$object->set('record_fields', $record_fields);
return '';