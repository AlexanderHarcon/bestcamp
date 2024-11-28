<?php
/**
 * sportCampsAftersave
 */
//$modx->addPackage('campsportcamps',MODX_CORE_PATH.'components/campsportcamps/model/');
//$object->get('object_id') == new
//$properties['object_id'] == new

$object = &$modx->getOption('object', $scriptProperties, null);
//$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties',$scriptProperties, array());

//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftersave] $object: ' . print_r($object->toArray(), 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[objSportInfraAftersave] $postvalues: ' . print_r($postvalues, 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftersave] $properties: ' . print_r($properties, 1));

if (
	$object &&
	!isset($properties['task'])
)
{
	//- habitation_ids
	//- We write an array of data into a field habitation_ids
	if (!is_array($properties['habitation_ids']))
	{
		$properties['habitation_ids'] = [$properties['habitation_ids']];
	}

	//- infrahabitation_ids
	//- We write an array of data into a field infrahabitation_ids
	if (!is_array($properties['infrahabitation_ids']))
	{
		$properties['infrahabitation_ids'] = [$properties['infrahabitation_ids']];
	}

	//- nutrition_ids
	//- We write an array of data into a field nutrition_ids
	if (!is_array($properties['nutrition_ids']))
	{
		$properties['nutrition_ids'] = [$properties['nutrition_ids']];
	}

	//- features_ids
	//- We write an array of data into a field features_ids
	if (!is_array($properties['features_ids']))
	{
		$properties['features_ids'] = [$properties['features_ids']];
	}



	if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

	/**
	 * sport_en
	 * ico
	 */
	$sport_name = $object->get('sport_id');
	$select['select'] = 'sport_en,ico';
	if ($sport = $pdoFetch->getArray('cmpSports', $object->get('sport_id'), $select))
	{
		$sport_name = $sport['sport_en'];
	}

	$article = $object->get('resource_id') . '-' .  $modx->filterPathSegment($sport_name) . '-' . $object->get('id');

	//- properties
	//- We write an array of data into a field properties
	$select['select'] = 'uri';
	if ($res = $pdoFetch->getArray('modResource', $object->get('resource_id'), $select))
	{
		$properties['properties']['alias'] = $res['uri'] . '/' . $article;
	}

	//$modx->log(modX::LOG_LEVEL_ERROR,'[sportCampsAftersave] $object: ' . print_r($object->toArray(), 1));

	$object->set('article', $article);
	$object->set('habitation_ids', $properties['habitation_ids']);
	$object->set('infrahabitation_ids', $properties['infrahabitation_ids']);
	$object->set('nutrition_ids', $properties['nutrition_ids']);
	$object->set('features_ids', $properties['features_ids']);
	$object->set('properties', $properties['properties']);
	$object->save();
}

return '';