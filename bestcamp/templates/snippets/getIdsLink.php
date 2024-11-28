<?php
/**
 * getIdsLink
 * Получение IDs объектов выборки, через таблицы связей
 * chank listOptionsInfra
 */
//- Loading the service
$object_id = $modx->getOption('objectId', $scriptProperties, null);
$class = $modx->getOption('class', $scriptProperties, 'modResource');
$class_link = $modx->getOption('classLink', $scriptProperties, null);
$field = $modx->getOption('field', $scriptProperties, 'pagetitle');
$field_link = $modx->getOption('fieldLink', $scriptProperties, null);

$object_id = $object_id ?: $_SESSION['migxWorkingObjectid'];

if ($object_id == 'new') return '0';

If (
	!$object_id ||
	!$class_link ||
	!$field_link
)
{
	$modx->log(MODX_LOG_LEVEL_ERROR,'[getIdsLink]: не заданы параметры: '. $object_id . ' = ' . $class_link . ' - ' . $field_link);
	return '0';
}

$pdoFetch = $modx->getService('pdoFetch');

//- Finding the current object
if (!$object = $pdoFetch->getArray($class, $object_id))
{
	$modx->log(MODX_LOG_LEVEL_ERROR,'[getIdsLink] $object: There is no Object with this ID: ' . $object_id);
	return '0';
}

//- We find all resources that correspond to the current parameter
//- Находим все ресурсы, которые соотвуют парметру текущего
$select['select'] = $field_link;
if (!$objects = $pdoFetch->getCollection($class_link, array(
	$field => $object[$field]
), $select))
{
	//-$modx->log(MODX_LOG_LEVEL_ERROR,'[getIdsLink] $objects: There are no Objects with this field: '. $field . ' = ' . $object_id);
	return '0';
}

$output = [];
foreach ($objects as $k => $value)
{
	$output[] = $value[$field_link];
}

//return '300,301';
return implode(',', $output);