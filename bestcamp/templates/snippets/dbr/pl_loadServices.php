<?php
/** pl_loadServices
 * Загрузка данных из таблицы сервисов
 */
switch ($modx->event->name) {
    case 'OnDocFormSave':
		return;
		//if ($mode != 'new') return;
		$templates = [7,8];

		//- Если не наш ресурс
		if (
			!in_array($resource->get('template'), $templates)
		) return;

		//- Загружаем сервис
		if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');
		$services_obj_arr = [];
		$modx->addPackage('campsportcamps',MODX_CORE_PATH.'components/campsportcamps/model/');
		$modx->addPackage('campservices',MODX_CORE_PATH.'components/campservices/model/');

		if ($mode != 'new')
		{
			//- Загружаем данные по Сервисам на Объекте
			//$param['select'] = 'id,service_id,evaluation_migx,service_migx';
			$services_obj_arr = $pdoFetch->getCollection('cmpObjectServices', array(
				'resource_id' => $id
			));

			$services_obj = [];
			foreach ($services_obj_arr as $item)
			{
				$services_obj[$item['service_id']] = $item;
			}
		}

		//$modx->log(MODX_LOG_LEVEL_ERROR, '[pl_loadServices] $services_obj - ' . print_r($services_obj,true));

		//- Загружаем данные по Сервисам
		$param['select'] = 'id,title_en,evaluation_migx,service_ids,evaluation_ids';
		$services_arr = $pdoFetch->getCollection('cmpObjServices', array(
			'sport' => 0
		), $param);

		$services = [];
		foreach ($services_arr as $item)
		{
			$services[$item['id']] = $item;
		}

		$modx->log(MODX_LOG_LEVEL_ERROR, '[pl_loadServices] $services - ' . print_r($services,true));

		foreach ($services_arr as $item)
		{
			if ($item['service_ids'][0])
			{
				$service_migx = [];
				foreach ($item['service_ids'] as $k => $service_add)
				{
					$service_migx[$k]['service_id'] = $service_add;
					$service_migx[$k]['service_title'] = $services[$service_add]['title_en'];
					$service_migx[$k]['evaluation_migx'] = $services[$service_add]['evaluation_migx'];
					$service_migx[$k]['active'] = 1;
				}
			}

			//- Если нет сервиса
			if (!$services_obj[$item['id']])
			{
				$object = $modx->newObject('cmpObjectServices');
				$object->set('resource_id', $id);
				$object->set('service_id', $item['id']);
				$object->set('service_title', $item['title_en']);
				$object->set('evaluation_migx', $item['evaluation_migx']);
				$object->set('service_migx', json_encode($service_migx));
				$object->save();
				//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftersave] $object: ' . print_r($object->toArray(), 1));
			}
		}

        break;
}