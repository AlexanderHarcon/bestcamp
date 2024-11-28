<?php
/**
 * sportAftergetfields
 * Getting data from related tables about Service, Inventory
 * Получение данных из связанных таблиц с Сервисами, Инвентаря
 */
$modx->addPackage('campservices',MODX_CORE_PATH.'components/campservices/model/');
$modx->addPackage('campsports',MODX_CORE_PATH.'components/campsports/model/');
if (!$object) return '';
//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftergetfields] $object: ' . print_r($object->toArray(), 1));
$record_fields = $object->get('record_fields');
$object_id = $record_fields['object_id'];

// Services
$datalinktabells = $modx->getCollection('cmpSportService', [
	'sport_id' => $object_id
]);
$link_ids = [];
foreach ($datalinktabells as $value)
{
	$link_ids[] = $value->get('service_id');
}
$record_fields['service_ids'] = implode('||', $link_ids);

// Inventory
$datalinktabells = $modx->getCollection('cmpInventorySport', [
	'sport_id' => $object_id
]);
$link_ids = [];
foreach ($datalinktabells as $value)
{
	$link_ids[] = $value->get('inventory_id');
}
$record_fields['inventory_ids'] = implode('||', $link_ids);


$object->set('record_fields', $record_fields);
return '';