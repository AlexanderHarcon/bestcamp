<?php
/**
 * inventoryAftergetfields
 * Getting data from related tables about Sports
 * Получение данных из связанных таблиц о Видах спорта
 */
$modx->addPackage('campsports',MODX_CORE_PATH.'components/campsports/model/');
if (!$object) return '';
//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftergetfields] $object: ' . print_r($object->toArray(), 1));
$record_fields = $object->get('record_fields');
$object_id = $record_fields['object_id'];

// Sports
$datalinktabells = $modx->getCollection('cmpInventorySport', [
	'inventory_id' => $object_id
]);
$link_ids = [];
foreach ($datalinktabells as $value)
{
	$link_ids[] = $value->get('sport_id');
}
$record_fields['sport_ids'] = implode('||', $link_ids);
$object->set('record_fields', $record_fields);

return '';