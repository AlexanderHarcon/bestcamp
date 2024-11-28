<?php
/**
 * objectSportAftersave
 *
 */
//$modx->addPackage('campsportcamps',MODX_CORE_PATH.'components/campsportcamps/model/');

//$object = &$modx->getOption('object', $scriptProperties, null);
//$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
//$properties = $modx->getOption('scriptProperties',$scriptProperties, array());

//$modx->log(modX::LOG_LEVEL_ERROR,'[objectSportAftersave] $object: ' . print_r($object->toArray(), 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[objectSportAftersave] $properties: ' . print_r($properties, 1));
return '';
if ($object)
{
	$object->save();
}

return '';