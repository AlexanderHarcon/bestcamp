<?php
/**
 * countryAftersave
 * Saving Default Country Flag Paths
 * Сохранение Путей к Флагам стран по умолчанию
 */
//-$modx->addPackage('campservices',MODX_CORE_PATH.'components/campsregions/model/');

$object = &$modx->getOption('object', $scriptProperties, null);
$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties',$scriptProperties,array());
if (!$object) return '';
//$modx->log(modX::LOG_LEVEL_ERROR,'[countryAftersave] $properties: ' . print_r($properties, 1));

if (!$postvalues['flag'])
{
	$country = str_replace(' ', '-', $postvalues['country_en']);
	$object->set('flag', 'ico/country/flags-32/' .$country. '.png');
}

if (!isset($properties['task']))
{
	//- features_ids
	//- We write an array of data into a field features_ids
	if (!is_array($properties['features_ids']))
	{
		$properties['features_ids'] = [$properties['features_ids']];
	}

	//- continent_ids
	//- We write an array of data into a field
	if (!is_array($properties['continent_ids']))
	{
		$properties['continent_ids'] = [$properties['continent_ids']];
	}

	/**
	 * Continents
	 */
	if ($object->get('published'))
	{
		$config = [];
		$config['link_classname'] = 'cmpCountryContinent';
		$config['link_alias'] = 'CountryContinent';
		$config['postfield'] = 'continent_ids';
		$config['id_field'] = 'country_id';
		$config['link_field'] = 'continent_id';
		$modx->migx->handleRelatedLinks($object, $postvalues, $config);
	}

	//$modx->log(modX::LOG_LEVEL_ERROR,'[countryAftersave] $properties[features_ids]: ' . $properties['features_ids']);

	$object->set('features_ids', $properties['features_ids']);
	$object->set('continent_ids',$properties['continent_ids']);
	$object->save();
}

return '';