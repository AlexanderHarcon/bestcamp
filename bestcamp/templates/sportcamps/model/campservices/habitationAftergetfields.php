<?php
/**
 * habitationAftergetfields
 */
if (
	!$object ||
	!$object->get('id')
) return '';
$record_fields = $object->get('record_fields');
//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftergetfields] $object: ' . print_r($object->toArray(), 1));
//return '';
/**
 * images
 */
$field = 'images';
$postvalues = & $record_fields;
$properties = & $record_fields;
require_once $modx->getOption('assets_path') . 'templates/sportcamps/model/galleryMigx.php';
$record_fields[$field] = json_encode($migx);

$object->set('record_fields', $record_fields);

//$modx->log(modX::LOG_LEVEL_ERROR,'[habitationAftersave] $object: ' . print_r($object->toArray(), 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[habitationAftersave] $postvalues: ' . print_r($postvalues, 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[habitationAftersave] $properties: ' . print_r($properties, 1));
return '';