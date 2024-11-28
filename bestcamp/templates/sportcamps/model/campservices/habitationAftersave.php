<?php
/**
 * habitationAftersave
 * Saving data in JSON for multiple lists
 * Сохранение данных в JSON для множественных списков
 */
$modx->addPackage('campservices',MODX_CORE_PATH.'components/campservices/model/');

$object = &$modx->getOption('object', $scriptProperties, null);
$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties',$scriptProperties,array());

// TODO Удаление фото через плагин

/**
 * gallery_migx
 */
$field = 'images';
require_once $modx->getOption('assets_path') . 'templates/sportcamps/model/galleryMigx.php';

/*$productfile = $pdoFetch->getCollection('msProductFile', array('product_id' => $properties['resource_id']));*/

//$modx->log(modX::LOG_LEVEL_ERROR,'[habitationAftersave] $object: ' . print_r($object->toArray(), 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[habitationAftersave] $postvalues: ' . print_r($postvalues, 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[habitationAftersave] $properties: ' . print_r($properties, 1));

//- Опции Проживания
//- Accommodation Options
if (!is_array($properties['habitation']))
{
	$properties['habitation'] = [$properties['habitation']];
}

if ($object)
{
	$object->set($field,json_encode($migx));
	$object->set('habitation',$properties['habitation']);
	$object->save();
}

return '';