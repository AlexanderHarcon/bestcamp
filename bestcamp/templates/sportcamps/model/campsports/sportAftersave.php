<?php
/**
 * sportAftersave
 * Passing Data to Related Tables about Service, Inventory
 * Передача данных в связанные таблицы с Сервисами, Инвентаря
 * We generate data [inventory_migx] depending on the choice [inventory_ids]
 * Формируем данные [inventory_migx] в зависимости от выбора [inventory_ids]
 */
$modx->addPackage('campservices',MODX_CORE_PATH.'components/campservices/model/');
$modx->addPackage('campsports',MODX_CORE_PATH.'components/campsports/model/');

$object = &$modx->getOption('object', $scriptProperties, null);
$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties',$scriptProperties,array());

// Services
$config = [];
$config['link_classname'] = 'cmpSportService';
$config['link_alias'] = 'SportService';
$config['postfield'] = 'service_ids';
$config['id_field'] = 'sport_id';
$config['link_field'] = 'service_id';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

//- Записываем массив данных в поле
//- We write an array of data into a field
if (!is_array($properties['service_ids']))
{
	$properties['service_ids'] = [$properties['service_ids']];
}

// Inventory
$config = [];
$config['link_classname'] = 'cmpInventorySport';
$config['link_alias'] = 'SportInventory';
$config['postfield'] = 'inventory_ids';
$config['id_field'] = 'sport_id';
$config['link_field'] = 'inventory_id';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

//- Принимаем и формируем массив для сравнения
//- We accept and form an array for comparison
$migx_in = [];
if ($postvalues['inventory_migx'])
{
	$migx_field = json_decode($postvalues['inventory_migx'], true);
	if (count($migx_field))
	{
		foreach ($migx_field as $value)
		{
			$migx_in[$value['inventory_id']] = $value;
		}
	}
}

if (!is_array($properties['inventory_ids']))
{
	$properties['inventory_ids'] = [$properties['inventory_ids']];
}

//- We form a new array taking into account the changed data
//- Формируем новый массив с учётом изменённых данных
$migx = [];
if ($properties['inventory_ids'][0])
{
	if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');
	$param['select'] = 'title_en';

	foreach ($properties['inventory_ids'] as $k => $value)
	{
		$data = $pdoFetch->getArray('cmpInventory', $value, $param);
		//$modx->log(modX::LOG_LEVEL_ERROR,'[sportAftersave] $data: ' . print_r($data, 1));

		/*if (is_array($migx_in[$value]['evaluation_ids']))
		{
			$migx_in[$value]['evaluation_ids'] = implode('||', $migx_in[$value]['evaluation_ids']);
		}*/

		$migx[$k]['id'] = $value;
		$migx[$k]['inventory_id'] = $value;
		$migx[$k]['inventory'] = $data['title_en'];
		$migx[$k]['evaluation_ids'] = $migx_in[$value]['evaluation_ids'] ?: '';
		$migx[$k]['price'] = $migx_in[$value]['price'] ?: '';
		$migx[$k]['active'] = $migx_in[$value]['active'] ?: '';
	}
}

if ($object)
{
	$object->set('service_ids',$properties['service_ids']);
	$object->set('inventory_migx',json_encode($migx));
	$object->save();
}
return '';
//$modx->log(modX::LOG_LEVEL_ERROR,'[sportAftersave] $properties: ' . print_r($properties['service_ids'], 1));