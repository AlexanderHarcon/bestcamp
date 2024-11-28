<?php
/**
 * cityAftersave
 * Saving filds
 */

$object = &$modx->getOption('object', $scriptProperties, null);
$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties',$scriptProperties,array());
if (!$object) return '';

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