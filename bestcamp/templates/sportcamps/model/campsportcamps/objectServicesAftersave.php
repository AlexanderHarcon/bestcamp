<?php
/**
 * objectServicesAftersave
 *
 */
//$modx->addPackage('campsportcamps',MODX_CORE_PATH.'components/campsportcamps/model/');

$object = &$modx->getOption('object', $scriptProperties, null);
//$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties',$scriptProperties,array());

/**
 * Evaluation
 * Работаем с таблицей связей cmpObjServiceEvaluation при смене Статуса
 * Working with the cmpObjServiceEvaluation table of connections when changing Status
 */
if ($properties['task'])
{
	switch ($properties['task'])
	{
		case 'publish':

			if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

			//- Загружаем массив данных текущего Объекта
			//- Loading the data array of the current Object
			$objectServices_arr = $pdoFetch->getArray('cmpObjectServices', $properties['object_id']);

			//$modx->log(modX::LOG_LEVEL_ERROR,'[objectServicesAftersave] $objectServices_arr: ' . print_r($objectServices_arr, 1));

			//- Загружаем массив данных из табдицы связей
			//- Load a data array from a link table
			$service_evaluation_arr = $pdoFetch->getCollection('cmpServiceEvaluation', array(
				'service_id' => $objectServices_arr['service_id']
			));

			//$modx->log(modX::LOG_LEVEL_ERROR,'[objectServicesAftersave] $service_evaluation_arr: ' . print_r($service_evaluation_arr, 1));

			//- Формируем массив данных для сохранения в таблице связей Нового прайса
			//- We create an array of data to save in the New Price Links table
			$migx_in = [];
			if (
				is_array($objectServices_arr['evaluation_migx'])
				&& is_array($objectServices_arr['evaluation_migx'][0])
			)
			{
				foreach ($objectServices_arr['evaluation_migx'] as $item)
				{
					$migx_in[$item['evaluation_id']] = $item;
				}
			}

			foreach ($service_evaluation_arr as $item)
			{
				$object = $modx->newObject('cmpObjServiceEvaluation');
				$object->set('objservice_id', $properties['object_id']);
				$object->set('evaluation_id', $item['evaluation_id']);
				$object->set('price', $migx_in[$item['evaluation_id']] ? $migx_in[$item['evaluation_id']]['price_new'] : 0);
				$object->save();

				//$modx->log(modX::LOG_LEVEL_ERROR,'[objectServicesAftersave] $object: ' . print_r($object->toArray(), 1));
			}

			break;

		case 'unpublish':

			//- Удаляем данные из таблицы связей
			//- Removing data from the relationship table
			if ($modx->removeCollection('cmpObjServiceEvaluation', array(
					'objservice_id' => $properties['object_id']
				)) == false)
			{
				$modx->log(modX::LOG_LEVEL_ERROR,'[objectServicesAftersave] Error deleting Class Objects cmpObjServiceEvaluation: object_id =  ' . $properties['object_id']);
			}

			break;
	}
}

/**
 * Evaluation
 * Сохраняем новый прайс в таблицу связей cmpObjServiceEvaluation
 * Save the new price list to the connections table cmpObjServiceEvaluation
 */
if ($properties['evaluation_migx'] && $properties['published'])
{
	$migx_arr = json_decode($properties['evaluation_migx'], true);
	if (count($migx_arr))
	{
		foreach ($migx_arr as $item)
		{
			//- Если есть Прайс загружаем Объект из таблицы связей
			//- If there is a Price, load the Object from the links table
			if (!$objlinks = $modx->getObject('cmpObjServiceEvaluation', array(
				'objservice_id' => $object->get('id'),
				'evaluation_id' => $item['evaluation_id']
			)))
			{
				$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftersave] $objlinks: object getting error');
				continue;
			}

			$objlinks->set('price', $item['price_new'] ?: 0);
			$objlinks->save();
		}
	}
}

//$modx->log(modX::LOG_LEVEL_ERROR,'[objectServicesAftersave] $properties: ' . print_r($properties, 1));
return '';