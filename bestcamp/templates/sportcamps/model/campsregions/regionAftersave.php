<?php
/**
 * regionAftersave
 * Saving Default Country Flag Paths
 * Сохранение Путей к Флагам стран по умолчанию
 */
//-$modx->addPackage('campservices',MODX_CORE_PATH.'components/campsregions/model/');

$object = &$modx->getOption('object', $scriptProperties, null);
$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties',$scriptProperties,array());
if (!$object) return '';

if (!$postvalues['flag'])
{
	if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

	$param['select'] = 'country_en';
	if ($country = $pdoFetch->getArray('cmpCountries', array(
		'id' => $properties['country_id']
	), $param)
	)
	{
		$country = str_replace(' ', '-', $country['country_en']);
		$object->set('flag', 'ico/country/flags-32/' .$country. '.png');
	}
}

if (!isset($properties['task']))
{
	//- features_ids
	//- We write an array of data into a field features_ids
	if (!is_array($properties['features_ids']))
	{
		$properties['features_ids'] = [$properties['features_ids']];
	}

	$object->set('features_ids', $properties['features_ids']);
	$object->save();
}

return '';