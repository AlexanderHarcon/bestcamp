<?php
/**
 * countryAftergetfields
 */
if (
	!$object ||
	!$object->get('id')
) return '';
//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftergetfields] $object: ' . print_r($object->toArray(), 1));
$record_fields = $object->get('record_fields');
$object_id = $record_fields['object_id'];

/**
 * Continents
 */
if ($object->get('published'))
{
	$datalinktabells = $modx->getCollection('cmpCountryContinent', [
		'country_id' => $object_id
	]);
	$link_ids = [];
	foreach ($datalinktabells as $value)
	{
		$link_ids[] = $value->get('continent_id');
	}
	$record_fields['continent_ids'] = implode('||', $link_ids);
}

$object->set('record_fields', $record_fields);
return '';