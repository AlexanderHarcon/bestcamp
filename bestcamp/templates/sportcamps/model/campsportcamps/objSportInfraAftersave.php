<?php
/**
 * objSportInfraAftersave
 * > templates/sportcamps/model/galleryMigx.php
 */
//$modx->addPackage('campsportcamps',MODX_CORE_PATH.'components/campsportcamps/model/');

$object = &$modx->getOption('object', $scriptProperties, null);
$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties',$scriptProperties, array());

//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $object: ' . print_r($object->toArray(), 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $postvalues: ' . print_r($postvalues, 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $properties: ' . print_r($properties, 1));
if (
	$object &&
	!isset($properties['task'])
)
{
/**
 * title_en
 */
if (!$properties['title_en'])
{
	if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

	$param['select'] = 'title_en';
	$arr = $pdoFetch->getArray('cmpSportInfrastr', $properties['infrastr_id'], $param);

	$properties['title_en'] = $arr['title_en'];
}

/**
 * ico
 */
if (!$properties['ico'])
{
	if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

	$param['select'] = 'ico';
	$arr = $pdoFetch->getArray('cmpSportInfrastr', $properties['infrastr_id'], $param);

	$properties['ico'] = $arr['ico'];
}

//- Записываем массив данных в поле
//- We write an array of data into a field
if (!is_array($properties['option_ids']))
{
	$properties['option_ids'] = [$properties['option_ids']];
}

/**
 * gallery_migx
 * Загрузка данных из Галереи
 * Сравнение с текущими данными Галереи
 */
$field = 'gallery_migx';
require_once $modx->getOption('assets_path') . 'templates/sportcamps/model/galleryMigx.php';
//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $object: ' . print_r($object->toArray(), 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $properties: ' . print_r($properties, 1));

	/**
	 * options
	 */
	if ($object->get('published'))
	{
		$config = [];
		$config['link_classname'] = 'cmpObjSportInfraOption';
		$config['link_alias'] = 'ObjSportInfraOption';
		$config['postfield'] = 'option_ids';
		$config['id_field'] = 'objsportinfra_id';
		$config['link_field'] = 'option_id';
		$modx->migx->handleRelatedLinks($object, $postvalues, $config);
	}

	$object->set($field,json_encode($migx));
	$object->set('title_en',$properties['title_en']);
	$object->set('ico',$properties['ico']);
	$object->set('option_ids',$properties['option_ids']);
	$object->save();
}
//return '';
/**
 * inventory_migx
 * cmpObjectSport
 */
if (
	$object->get('published') ||
	$properties['task'] == 'publish'
)
{
	/**
	 * inventory_migx
	 */
	if ($object->get('inventory_migx'))
	{
		$migx_arr = json_decode($object->get('inventory_migx'), true);
		if (count($migx_arr))
		{
			foreach ($migx_arr as $item)
			{
				if (!$objlinks = $modx->getObject('cmpObjSportInfraInventory', array(
					'objsportinfra_id' => $object->get('id'),
					'inventory_id' => $item['inventory_id']
				)))
				{
					if (!$item['active']) continue;

					$objectnew = $modx->newObject('cmpObjSportInfraInventory');
					$objectnew->set('objsportinfra_id', $object->get('id'));
					$objectnew->set('inventory_id', $item['inventory_id']);
					$objectnew->save();
				}
				else
				{
					if ($item['active']) continue;

					if ($objlinks->remove() == false)
					{
						$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] Error deleting Class Objects cmpObjSportInfraInventory: objservice_id =  ' . $object->get('id'));
					}
				}
			}
		}

	}

	/**
	 * options
	 */
	if (
		$object->get('option_ids') &&
		is_array($object->get('option_ids')) &&
		count($object->get('option_ids'))
	)
	{
		foreach ($object->get('option_ids') as $item)
		{
			if (!$objlinks = $modx->getObject('cmpObjSportInfraOption', array(
				'objsportinfra_id' => $object->get('id'),
				'option_id' => $item
			)))
			{
				$objectnew = $modx->newObject('cmpObjSportInfraOption');
				$objectnew->set('objsportinfra_id', $object->get('id'));
				$objectnew->set('option_id', $item);
				$objectnew->save();
			}
		}
	}


}
else if ($properties['task'] == 'unpublish')
{
	/**
	 * inventory_migx
	 */
	$modx->removeCollection('cmpObjSportInfraInventory', array(
		'objsportinfra_id' => $object->get('id')
	));

	/**
	 * options
	 */
	$modx->removeCollection('cmpObjSportInfraOption', array(
		'objsportinfra_id' => $object->get('id')
	));
}

/**
 * cmpObjectSport
 */
if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');
//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $object: ' . print_r($object->toArray(), 1));
//- Достаем список Видов спорта соответствующие Спортивной инфраструктуре на текущем Объекте
$select['select'] = 'sport_id';
if ($resources = $pdoFetch->getCollection('cmpInfrastrSport', array(
	'infrastr_id' => $object->get('infrastr_id')
), $select))
{
	//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $resources: ' . print_r($resources, 1));
	foreach ($resources as $resource)
	{
		//- занесён ли этот спорт на объект
		if ($data = $modx->getObject('cmpObjectSport', array(
			'sport_id' => $resource['sport_id'],
			'resource_id' => $object->get('resource_id')
		)))
		{
			$data_arr = $data->toArray();
			$data_arr['published'] = 1;

			if (
				$object->get('published') ||
				$properties['task'] == 'publish'
			)
			{
				//- Если добавлена Инфраструктура в этот Спорт на объекте ничего не делаем
				if (in_array($object->get('id'), $data_arr['infraobj_ids'])) continue;

				//- Добавляем инфраструктуру в Спорт
				$data_arr['infraobj_ids'][] = $object->get('id');
			}
			else
			{
				//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $properties: ' . print_r($object->get('id'), 1));
				//- Если Инфраструктуры нет в этом Спорте не делаем
				if (!in_array($object->get('id'), $data_arr['infraobj_ids'])) continue;

				foreach ($data_arr['infraobj_ids'] as $k => $item)
				{
					if($item == $object->get('id'))
					{
						unset($data_arr['infraobj_ids'][$k]);
					}
				}

				//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $data_arr: ' . print_r($data_arr, 1));

				if(!count($data_arr['infraobj_ids']))
				{
					//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $data_arrvvvv: ' . print_r($data_arr['infraobj_ids'], 1));
					$data_arr['published'] = 0;
				}
			}
			//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $data_arr: ' . print_r($data_arr, 1));
		}
		else
		{
			/**
			 * service_migx
			 * in_ObjectServices
			 */
			//- Обращаемся к объекту Вида спорта
			$select['select'] = 'sport_en,ico';
			if (!$sport = $pdoFetch->getArray('cmpSports', $resource['sport_id'], $select))
			{
				$sport = [
					'sport_en' => '',
					'ico' => ''
				];
			}

			$infraobj_ids = [];
			$published = 0;
			if (
				$object->get('published') ||
				$properties['task'] == 'publish'
			)
			{
				$infraobj_ids = [$object->get('id')];
				$published = 1;
			}

			$data = $modx->newObject('cmpObjectSport');
			$data_arr['sport_id'] = $resource['sport_id'];
			$data_arr['ico'] = $sport['ico'];
			$data_arr['resource_id'] = $object->get('resource_id');
			$data_arr['infraobj_ids'] = $infraobj_ids;
			$data_arr['published'] = $published;
		}

		//- Сохраняем обновлённые данные
		$data->fromArray($data_arr);
		$data->save();
	}
}

return '';