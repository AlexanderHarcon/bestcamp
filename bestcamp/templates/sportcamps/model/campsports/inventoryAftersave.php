<?php
/**
 * inventoryAftersave
 * Passing Data to Related Tables about Sports
 * Передача данных в связанные таблицы о Видах спорта
 */
$modx->addPackage('campsports',MODX_CORE_PATH.'components/campsports/model/');

$object = &$modx->getOption('object', $scriptProperties, null);
$postvalues = $modx->getOption('postvalues', $scriptProperties, null);

// Sports
$config = [];
$config['link_classname'] = 'cmpInventorySport';
$config['link_alias'] = 'InventorySport';
$config['postfield'] = 'sport_ids';
$config['id_field'] = 'inventory_id';
$config['link_field'] = 'sport_id';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

if (!is_array($properties['sport_ids']))
{
	$properties['sport_ids'] = [$properties['sport_ids']];
}

if ($object)
{
	$object->set('sport_ids',$properties['sport_ids']);
	$object->save();
}
//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftersave] $properties: ' . print_r($properties, 1));
return '';