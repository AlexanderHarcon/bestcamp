<?php
/**
 * sportCampsAftergetfields
 *
 */
if (
	!$object ||
	!$object->get('id')
) return '';

//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftergetfields] $object: ' . print_r($object->toArray(), 1));
$record_fields = $object->get('record_fields');
$pdoFetch = $modx->getService('pdoFetch');

/**
 * services_migx
 * MIGX config - in_ObjectServices
 */
//- Данные по Сервисам в Спорте
$services_migx = [];

//- Находим связанные Сервисы
$select['select'] = 'service_id';
if ($SportService = $pdoFetch->getCollection('cmpSportService', array(
	'sport_id' => $record_fields['sport_id']
), $select))
{
	//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftergetfields] $SportService: ' . print_r($SportService, 1));

	//- Получаем текущие данные из спорта на Объекте
	$service_migx_insport = [];
	$select['select'] = 'service_migx';
	if ($arr = $pdoFetch->getArray('cmpObjectSport', array(
		'resource_id' => $record_fields['resource_id'],
		'sport_id' => $record_fields['sport_id']
	), $select))
	{
		if (is_array($arr['service_migx']))
		{
			foreach ($arr['service_migx'] as $item)
			{
				//if(!$item['active']) continue;

				$item['evaluation_migx'] = json_decode($item['evaluation_migx'], true);
				$item['service_migx'] = json_decode($item['service_migx'], true);

				$service_migx_insport[$item['service_id']] = $item;
			}
		}
	}

	//- Получаем текущие данные services_migx на самом Кемпе
	$services_migx_in = [];
	if ($record_fields['services_migx'])
	{
		$migx_arr = json_decode($record_fields['services_migx'], true);

		if (count($migx_arr))
		{
			foreach ($migx_arr as $item)
			{
				$services_migx_in[$item['service_id']] = $item;
			}
		}
	}

	foreach ($SportService as $item_ss)
	{
		//- Пропускаем не активные Сервисы в Спорте Объекта
		if(
			$service_migx_insport[$item_ss['service_id']] &&
			!$service_migx_insport[$item_ss['service_id']]['active']
		) continue;

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
			//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftergetfields] $ServiceEvaluation: ' . print_r($ServiceEvaluation, 1));

			//- Получаем данные evaluation_migx из Спорта на Объекте
			//$evaluation_insport = json_decode($service_migx_insport[$item_ss['service_id']]['evaluation_migx'], true);
			$evaluation_insport = $service_migx_insport[$item_ss['service_id']]['evaluation_migx'];
			$evaluation_migx_insport = [];
			if (
				$evaluation_insport &&
				is_array($evaluation_insport)
			)
			{
				foreach ($evaluation_insport as $item_es)
				{
					$evaluation_migx_insport[$item_es['evaluation_id']] = $item_es;
				}
			}

			//- Получаем текущие данные evaluation_migx
			$evaluation_in = json_decode($services_migx_in[$item_ss['service_id']]['evaluation_migx'], true);
			//$evaluation_in = $services_migx_in[$item_ss['service_id']]['evaluation_migx'];
			$evaluation_migx_in = [];
			if (
				$evaluation_in &&
				is_array($evaluation_in)
			)
			{
				foreach ($evaluation_in as $item_em)
				{
					$evaluation_migx_in[$item_em['evaluation_id']] = $item_em;
				}
			}

			foreach ($ServiceEvaluation as $value_se)
			{
				//- Пропускаем не активные Методы оценок в Спорте Объекта
				if(
					$evaluation_migx_insport[$value_se['evaluation_id']] &&
					!$evaluation_migx_insport[$value_se['evaluation_id']]['active']
				) continue;

				//- Обращаемся к объекту Метода оценок
				$select['select'] = 'title_en';
				if (!$Evaluation = $pdoFetch->getArray('cmpEvaluation', $value_se['evaluation_id'], $select)) continue;

				//- Если данные в текущем Кемпе
				$indata = $evaluation_migx_in[$value_se['evaluation_id']];
				$in = is_array($indata);
				$inprice_new = $in && (!empty($indata['price_new']) || $indata['price_new'] === '0');

				//- Если данные в Спорте на Объекте
				$indatasport = $evaluation_migx_insport[$value_se['evaluation_id']];
				$insport = is_array($indatasport);
				$price_new = $insport ? $indatasport['price_new'] : 0;

				//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftergetfields] $indata[price_new]: ' . print_r($indata['price_new'], 1));
				//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftergetfields] $indata[price_new]: ' . print_r($inprice_new, 1));
				//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftergetfields] $inprice_new: ' . print_r($inprice_new, 1));

				$evaluation_migx[] = [
					'title' => $Evaluation['title_en'],
					'price' => $value_se['price'],
					'price_new' => $inprice_new ? $indata['price_new'] : $price_new,
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
			//- Получаем данные service_migx из Спорта на Объекте
			$serviceSlave_insport = $service_migx_insport[$item_ss['service_id']]['service_migx'];
			$serviceSlave_migx_insport = [];
			if (
				$serviceSlave_insport &&
				is_array($serviceSlave_insport)
			)
			{
				foreach ($serviceSlave_insport as $item_ssi)
				{
					$serviceSlave_migx_insport[$item_ssi['service_id']] = $item_ssi;
				}
			}

			//- Получаем текущие данные service_migx Кемпа
			//$serviceSlave_in = $services_migx_in[$item_ss['service_id']]['service_migx'];
			$serviceSlave_in = json_decode($services_migx_in[$item_ss['service_id']]['service_migx'], true);
			$serviceSlave_migx_in = [];
			if (
				$serviceSlave_in &&
				is_array($serviceSlave_in)
			)
			{
				foreach ($serviceSlave_in as $item_sc)
				{
					$serviceSlave_migx_in[$item_sc['service_id']] = $item_sc;
				}
			}

			//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftergetfields] $serviceSlave_insport: ' . print_r($serviceSlave_insport, 1));

			foreach ($ServiceLink as $value_sl)
			{
				//- Пропускаем не активные Связанные Сервисы в Спорте Объекта
				if(
					$serviceSlave_migx_insport[$value_sl['slave']] &&
					!$serviceSlave_migx_insport[$value_sl['slave']]['active']
				) continue;

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
					//- Получаем данные evaluation_migx из Спорта на Объекте
					$evaluationSlave_insport = $service_migx_insport[$value_sl['slave']]['evaluation_migx'];
					//$evaluationSlave_insport = json_decode($service_migx_insport[$value_sl['slave']]['evaluation_migx'], true);
					$evaluationSlave_migx_insport = [];
					if (
						$evaluationSlave_insport &&
						is_array($evaluationSlave_insport)
					)
					{
						foreach ($evaluationSlave_insport as $item_ess)
						{
							$evaluationSlave_migx_insport[$item_ess['evaluation_id']] = $item_ess;
						}
					}

					//- Получаем текущие данные evaluation_migx из Кемпа
					//$evaluationSlave_in = $serviceSlave_migx_in[$value_sl['slave']]['evaluation_migx'];
					$evaluationSlave_in = json_decode($serviceSlave_migx_in[$value_sl['slave']]['evaluation_migx'], true);
					$evaluationSlave_migx_in = [];
					if (
						$evaluationSlave_in &&
						is_array($evaluationSlave_in)
					)
					{
						foreach ($evaluationSlave_in as $item_esi)
						{
							$evaluationSlave_migx_in[$item_esi['evaluation_id']] = $item_esi;
						}
					}

					//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftergetfields] $evaluationSlave_migx_in: ' . print_r($evaluationSlave_migx_in, 1));

					foreach ($ServiceEvaluation as $value_se)
					{
						//- Пропускаем не активные Методы оценок в Спорте Объекта
						if(
							$evaluationSlave_migx_insport[$value_se['evaluation_id']] &&
							!$evaluationSlave_migx_insport[$value_se['evaluation_id']]['active']
						) continue;

						//- Обращаемся к объекту Метода оценок
						$select['select'] = 'title_en';
						if (!$Evaluation = $pdoFetch->getArray('cmpEvaluation', $value_se['evaluation_id'], $select)) continue;

						//- Если данные в текущем Кемпе
						$indata = $evaluationSlave_migx_in[$value_se['evaluation_id']];
						$in = is_array($indata);
						$inprice_new = $in && (!empty($indata['price_new']) || $indata['price_new'] === '0');

						//- Если данные в Спорте на Объекте
						$indatasport = $evaluationSlave_migx_insport[$value_se['evaluation_id']];
						$insport = is_array($indatasport);
						$price_new = $insport ? $indatasport['price_new'] : 0;

						$evaluationSlave_migx[] = [
							'title' => $Evaluation['title_en'],
							'price' => $value_se['price'],
							'price_new' => $inprice_new ? $indata['price_new'] : $price_new,
							'evaluation_id' => $value_se['evaluation_id'],
							'service_id' => $value_sl['slave'],
							'active' => $in ? $indata['active'] : 1
						];
					}
				}

				$indata = $serviceSlave_migx_in[$value_sl['slave']];
				$in = is_array($indata);

				//- Если данные в Спорте на Объекте
				$indatasport = $serviceSlave_migx_insport[$value_sl['slave']];
				$insport = is_array($indatasport);
				$activeplanet = $insport ? $indatasport['activeplanet'] : 0;
				$contacts = $insport ? $indatasport['contacts'] : '';
				$desc_en = $insport ? $indatasport['desc_en'] : '';
				$desc_de = $insport ? $indatasport['desc_de'] : '';
				$comment = $insport ? $indatasport['comment'] : '';

				$serviceSlave_migx[] = [
					'service_id' => $value_sl['slave'],
					'service_title' => $service_slave['title_en'],
					'activeplanet' => $in ? $indata['activeplanet'] : $activeplanet,
					'evaluation_migx' => json_encode($evaluationSlave_migx),
					'contacts' => $in ? $indata['contacts'] : $contacts,
					'desc_en' => $in ? $indata['desc_en'] : $desc_en,
					'desc_de' => $in ? $indata['desc_de'] : $desc_de,
					'comment' => $in ? $indata['comment'] : $comment,
					'active' => $in ? $indata['active'] : 1
				];
			}
		}

		//- Если данные в текущем Кемпе
		$indata = $services_migx_in[$item_ss['service_id']];
		$in = is_array($indata);

		//- Если данные в Спорте на Объекте
		$indatasport = $service_migx_insport[$item_ss['service_id']];
		$insport = is_array($indatasport);
		$activeplanet = $insport ? $indatasport['activeplanet'] : 0;
		$contacts = $insport ? $indatasport['contacts'] : '';
		$desc_en = $insport ? $indatasport['desc_en'] : '';
		$desc_de = $insport ? $indatasport['desc_de'] : '';
		$comment = $insport ? $indatasport['comment'] : '';

		//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftergetfields] $serviceSlave_migx: ' . print_r($serviceSlave_migx, 1));

		$services_migx[] = [
			'service_id' => $item_ss['service_id'],
			'service_title' => $service['title_en'],
			'activeplanet' => $in ? $indata['activeplanet'] : $activeplanet,
			'inprice' => $in ? $indata['inprice'] : 1,
			'evaluation_migx' => json_encode($evaluation_migx),
			'service_migx' => json_encode($serviceSlave_migx),
			'contacts' => $in ? $indata['contacts'] : $contacts,
			'desc_en' => $in ? $indata['desc_en'] : $desc_en,
			'desc_de' => $in ? $indata['desc_de'] : $desc_de,
			'comment' => $in ? $indata['comment'] : $comment,
			'active' => $in ? $indata['active'] : 1
		];
	}
}
//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftergetfields] $services_migx: ' . print_r($services_migx, 1));
$record_fields['services_migx'] = json_encode($services_migx);
//return '';
$object->set('record_fields', $record_fields);

return '';