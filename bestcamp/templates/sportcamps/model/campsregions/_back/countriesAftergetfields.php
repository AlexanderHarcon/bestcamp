<?php
/**
 * Проба
 */
$modx->addPackage('campsregions',MODX_CORE_PATH.'components/campsregions/model/');

if ($object)
{
	$record_fields = $object->get('record_fields');
	$country_id = $record_fields['object_id'];
	$properties = json_decode($record_fields['properties'], true);

	$record_fields['properties'] = $properties['imgPrev'];

	$object->set('record_fields', $record_fields);
}
return '';