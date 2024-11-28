<?php
/**
 * pl_loadServices
 * Loading data from the services table and creating connections with a New object (Hotel, Base) - cmpObjectServices
 * Загрузка данных из таблицы сервисов и создание связей с Новым объектом (Отелем, Базой) — cmpObjectServices
 */
switch ($modx->event->name)
{
    case 'OnDocFormSave':

		$templates = [7,8];
		$parents = [14,301];

		//- If not our resource
		//- Если не наш ресурс
		if (
			!in_array($resource->get('template'), $templates) ||
			!in_array($resource->get('parent'), $parents) ||
			$resource->get('class_key') != 'msProduct'
		) return;

		if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

		//- We check the availability of services, if there are already linked ones, we exit
		//- Проверяем наличие сервисов если уже есть привязанные выходим
		if ($mode != 'new')
		{
			$param['select'] = 'id';
			$cmpObjectServices = $pdoFetch->getCollection('cmpObjectServices', array(
				'resource_id' => $id
			), $param);

			if (count($cmpObjectServices)) return;
		}

		/**
		 * Loading data on the Services
		 * Загружаем данные по Сервисам
		 * Forming a more convenient presentation
		 * Формируем более удобное представление
		 */
		$param['select'] = 'id,title_en,evaluation_migx,service_ids,evaluation_ids';
		$services_arr = $pdoFetch->getCollection('cmpObjServices', array(
			'sport' => 0
		), $param);

		$services = [];
		foreach ($services_arr as $item)
		{
			$services[$item['id']] = $item;
		}

		foreach ($services_arr as $item)
		{
			//- We form a more convenient representation of Subordinate services
			//- Формируем более удобное представление по Подчинённым сервиасм
			$service_migx = [];
			if ($item['service_ids'][0])
			{
				foreach ($item['service_ids'] as $k => $service_add)
				{
					$service_migx[$k]['service_id'] = $service_add;
					$service_migx[$k]['service_title'] = $services[$service_add]['title_en'];
					$service_migx[$k]['evaluation_migx'] = json_encode($services[$service_add]['evaluation_migx']);
					$service_migx[$k]['active'] = 1;
				}
			}

			$object_new = $modx->newObject('cmpObjectServices');
			$object_new->set('resource_id', $id);
			$object_new->set('service_id', $item['id']);
			$object_new->set('service_title', $item['title_en']);
			$object_new->set('evaluation_migx', json_encode($item['evaluation_migx']));
			$object_new->set('service_migx', json_encode($service_migx));
			$object_new->set('published', 1);
			$object_new->set('publishedon', time());
			$object_new->set('publishedby', $modx->getUser());
			$object_new->set('createdby', $modx->getUser());
			$object_new->set('createdon', time());
			$object_new->save();

			//- Adding an entry to the cmp Obj Service Evaluation communication table
			//- Добавляем запись в таблицк связи cmpObjServiceEvaluation
			if ($item['evaluation_ids'][0])
			{
				foreach ($item['evaluation_ids'] as $evaluation_id)
				{
					$object_new2 = $modx->newObject('cmpObjServiceEvaluation');
					$object_new2->set('evaluation_id', $evaluation_id);
					$object_new2->set('objservice_id', $object_new->get('id'));
					$object_new2->save();
				}
			}
		}

        break;
}
return;
//$modx->log(modX::LOG_LEVEL_ERROR,'[pl_loadServices] $object_new: ' . print_r($object_new->toArray(), 1));