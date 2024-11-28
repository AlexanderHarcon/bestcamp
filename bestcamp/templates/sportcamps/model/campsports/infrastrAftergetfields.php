<?php
/**
 * Getting data from related tables
 * Получение данных из связанных таблиц
 */
$modx->addPackage('campsports',MODX_CORE_PATH.'components/campsports/model/');
if (!$object) return '';
//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftergetfields] $object: ' . print_r($object->toArray(), 1));
$record_fields = $object->get('record_fields');
$object_id = $record_fields['object_id'];

// Sports
$datalinktabells = $modx->getCollection('cmpInfrastrSport', [
	'infrastr_id' => $object_id
]);
$link_ids = [];
foreach ($datalinktabells as $value)
{
	$link_ids[] = $value->get('sport_id');
}
$record_fields['sport_ids'] = implode('||', $link_ids);

// Coverings
$datalinktabells = $modx->getCollection('cmpInfrastrCoverings', [
	'infrastr_id' => $object_id
]);
$link_ids = [];
foreach ($datalinktabells as $value)
{
	$link_ids[] = $value->get('covering_id');
}
$record_fields['сovering_ids'] = implode('||', $link_ids);

// Marking
$datalinktabells = $modx->getCollection('cmpInfrastrMarking', [
	'infrastr_id' => $object_id
]);
$link_ids = [];
foreach ($datalinktabells as $value)
{
	$link_ids[] = $value->get('marking_id');
}
$record_fields['marking_ids'] = implode('||', $link_ids);

// Options
$datalinktabells = $modx->getCollection('cmpInfrastrFcOptions', [
	'infrastr_id' => $object_id
]);
$link_ids = [];
foreach ($datalinktabells as $value)
{
	$link_ids[] = $value->get('option_id');
}
$record_fields['option_ids'] = implode('||', $link_ids);

// Rentals
$datalinktabells = $modx->getCollection('cmpInfrastrFcRental', [
	'infrastr_id' => $object_id
]);
$link_ids = [];
foreach ($datalinktabells as $value)
{
	$link_ids[] = $value->get('rental_id');
}
$record_fields['rent_ids'] = implode('||', $link_ids);

$object->set('record_fields', $record_fields);
return '';