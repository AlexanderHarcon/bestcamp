<?php
/**
 * getPostField
 * Retrieving Field from POST data
 * Получение данных полей используя POST
 */
return '300,302';
//- Загружаем сервис
$pdoFetch = $modx->getService('pdoFetch');
$param = $modx->getOption('param', $scriptProperties, 'resource_id');
$class = $modx->getOption('class', $scriptProperties, 'modResource');
$field = $modx->getOption('field', $scriptProperties, 'pagetitle');

//- Загружаем массив данных по Городу
if (!$res_arr = $pdoFetch->getArray($class, (int) $_POST[$param]))
{
	$modx->log(MODX_LOG_LEVEL_ERROR,'[getPostField] $res_arr: Нет Объекта с таким ID: ' . $_POST[$param]);
	return;
}

return $res_arr[$field] ?: 'error';