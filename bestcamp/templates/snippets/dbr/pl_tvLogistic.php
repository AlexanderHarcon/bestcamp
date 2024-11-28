<?php
/** @var modX $modx
 * Формирует поле для внесения стоимости трансфера (Объект прибытия - Отель / База)
 * TODO Автоматизировать формирование поля и Рефактор
 */
switch ($modx->event->name) {
    case 'OnDocFormSave':

    	$templates = [7];

		//- Если не наш ресурс или не определён Город
		if (
			!in_array($resource->get('template'), $templates)
			|| !$resource->get('city')
			|| !$resource->get('tv65')
		) return;

		//- Получаем данные по Трансферу
		$tv65 = json_decode($resource->get('tv65'), true);

		if (!count($tv65)) return;

		//- Загружаем сервис
		if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

		//- Загружаем данные по Объектам логистики
		$param['select'] = 'name,key';
		$transport_arr = $pdoFetch->getCollection('MsfmStorageMember', array(
			'storage_id' => 4,
			'enable' => 1
		), $param);

		foreach ($tv65 as $k => $tv)
		{
			if (!$tv['distance']) continue;

			if (
				$tv['transport']
				&& $transports = json_decode($tv['transport'], true)
			)
			{
				if (!count($transports)) continue;

				foreach ($transports as $i => $tv_transport)
				{
					if ($tv_transport['price']) continue;

					foreach ($transport_arr as $ii => $transport)
					{
						if ($transport['key'] == $tv_transport['transport'])
						{
							$transports[$i]['price'] = $transport['key'] * (int) $tv['distance'];
							break;
						}
					}
				}
			}
			else
			{


				$transports = [];
				foreach ($transport_arr as $i => $transport)
				{
					$transports[$i]['transport'] = $transport['key'];
					$transports[$i]['price'] = $transport['key'] * (int) $tv['distance'];
					$transports[$i]['active'] = 1;
					$transports[$i]['_this.value'] = $transport['name'];
					$transports[$i]['transportrender'] = $transport['name'];
				}
			}
			$tv65[$k]['transport'] = json_encode($transports, true);

			//$modx->log(MODX_LOG_LEVEL_ERROR, '---$transports - ' . print_r($transports,true) );
		}

		if(!$resource->setTVValue(65, json_encode($tv65)))
		{
			$modx->log(MODX_LOG_LEVEL_ERROR, '[pl_tvLogistic] Having problems setting the TV value. ID: 65' );
		}

		//$modx->log(MODX_LOG_LEVEL_ERROR, print_r($resource->toArray(),true) );

        break;
}