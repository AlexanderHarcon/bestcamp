<?php
/** @var modX $modx
 * Формирует поле для внесения стоимости трансфера (Объект прибытия - Отель / База)
 * TODO Настроить валидацию поля Object и Name
 */
switch ($modx->event->name) {
    case 'OnDocFormSave':

    	$templates = [7];

    	//- Если не наш ресурс или не определён Город
    	if (
    		!in_array($resource->get('template'), $templates)
    		|| !$resource->get('city')
		) return;

    	//- Загружаем сервис
		if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

		//- Загружаем массив данных по Городу
		if (!$city_arr = $pdoFetch->getArray('cmpCities', $resource->get('city')))
		{
			$modx->log(MODX_LOG_LEVEL_ERROR,'[pl_tvmodification] $city_arr: there is no such city in the database ID: ' . $resource->get('city'));
			return;
		}

		//- Если нет данных по Логистике или эти данные не соответствуют формату
		if (!$city_arr['logistics'] || !is_array($city_arr['logistics']))
		{
			$modx->log(MODX_LOG_LEVEL_ERROR,'[pl_tvmodification] $city_arr[logistics]: There is no data on the logistics of this City ID: ' . $resource->get('city'));

			//- На всякий случай очищаем поле данных по транчыеру
			if(!$resource->setTVValue(65, ''))
			{
				$modx->log(MODX_LOG_LEVEL_ERROR, '[pl_tvmodification] Having problems setting the TV value. ID: 65' );
			}
			return;
		}

		//- Получаем данные по Трансферу
		$tv65 = '';
		if ($resource->get('tv65'))
		{
			$tv65 = json_decode($resource->get('tv65'), true);

			if (is_array($tv65))
			{
				foreach ($tv65 as $tv)
				{
					//- Если Город соответствует - ничего не меняем
					if ($tv['city'] == $resource->get('city'))
					{
						return;
					}
				}
			}
		}

		//- Загружаем данные по Объектам логистики
		$param['select'] = 'name,key';
		$logistic_arr = $pdoFetch->getCollection('MsfmStorageMember', array(
			'storage_id' => 3,
			'enable' => 1
		), $param);

		//- Проходим по имеющейся логистике Города
		$tv65 = [];
		foreach ($city_arr['logistics'] as $k => $logistics)
		{
			foreach ($logistic_arr as $logistic)
			{
				if ($logistic['key'] == $logistics['object'])
				{
					//- Записываем данные по объекту логистики
					$tv65[$k]['object'] = $logistic['name'];
					break;
				}
			}

			//- Формируем поля для занесения стоимости трансфера
			$tv65[$k]['name'] = $logistics['title'];
			$tv65[$k]['distance'] = '';
			$tv65[$k]['transport'] = '';
			$tv65[$k]['price'] = '';
			$tv65[$k]['active'] = '';
			$tv65[$k]['city'] = $resource->get('city');
		}

		if(!$resource->setTVValue(65, json_encode($tv65)))
		{
			$modx->log(MODX_LOG_LEVEL_ERROR, '[pl_tvmodification] Having problems setting the TV value. ID: 65' );
		}

		//-$modx->log(MODX_LOG_LEVEL_ERROR, print_r($resource->toArray(),true) );

        break;
}