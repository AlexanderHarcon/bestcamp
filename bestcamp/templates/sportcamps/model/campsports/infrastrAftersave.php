<?php
/**
 * Passing Data to Related Tables
 * Передача данных в связанные таблицы
 */
$modx->addPackage('campsports',MODX_CORE_PATH.'components/campsports/model/');

$object = &$modx->getOption('object', $scriptProperties, null);
$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties',$scriptProperties,array());

// Sports
$config = [];
$config['link_classname'] = 'cmpInfrastrSport';
$config['link_alias'] = 'InfrastrSport';
$config['postfield'] = 'sport_ids';
$config['id_field'] = 'infrastr_id';
$config['link_field'] = 'sport_id';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

//- Записываем массив данных в поле
//- We write an array of data into a field
if (!is_array($properties['sport_ids']))
{
	$properties['sport_ids'] = [$properties['sport_ids']];
}

// Coverings
$config = [];
$config['link_classname'] = 'cmpInfrastrCoverings';
$config['link_alias'] = 'InfrastrCoverings';
$config['postfield'] = 'cover_ids';
$config['id_field'] = 'infrastr_id';
$config['link_field'] = 'covering_id';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

//- Записываем массив данных в поле
//- We write an array of data into a field
if (!is_array($properties['cover_ids']))
{
	$properties['cover_ids'] = [$properties['cover_ids']];
}

// Marking
$config = [];
$config['link_classname'] = 'cmpInfrastrMarking';
$config['link_alias'] = 'InfrastrMarking';
$config['postfield'] = 'marking_ids';
$config['id_field'] = 'infrastr_id';
$config['link_field'] = 'marking_id';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

//- Записываем массив данных в поле
//- We write an array of data into a field
if (!is_array($properties['marking_ids']))
{
	$properties['marking_ids'] = [$properties['marking_ids']];
}

// Options
$config = [];
$config['link_classname'] = 'cmpInfrastrFcOptions';
$config['link_alias'] = 'InfrastrFcOptions';
$config['postfield'] = 'option_ids';
$config['id_field'] = 'infrastr_id';
$config['link_field'] = 'option_id';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

//- Записываем массив данных в поле
//- We write an array of data into a field
if (!is_array($properties['option_ids']))
{
	$properties['option_ids'] = [$properties['option_ids']];
}

// Rentals
$config = [];
$config['link_classname'] = 'cmpInfrastrFcRental';
$config['link_alias'] = 'InfrastrFcRental';
$config['postfield'] = 'rent_ids';
$config['id_field'] = 'infrastr_id';
$config['link_field'] = 'rental_id';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

//- Записываем массив данных в поле
//- We write an array of data into a field
if (!is_array($properties['rent_ids']))
{
	$properties['rent_ids'] = [$properties['rent_ids']];
}

if ($object)
{
	$object->set('sport_ids',$properties['sport_ids']);
	$object->set('cover_ids',$properties['cover_ids']);
	$object->set('marking_ids',$properties['marking_ids']);
	$object->set('option_ids',$properties['option_ids']);
	$object->set('rent_ids',$properties['rent_ids']);
	$object->save();
}
//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftersave] $properties: ' . print_r($properties, 1));
return '';