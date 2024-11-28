<?php
/**
 * API MODX
 */
define('MODX_API_MODE', true);
while (!isset($modx) && ($i = isset($i) ? --$i : 10))
{
    if (
    	($file = dirname(!empty($file) ? dirname($file) : __FILE__) . '/index.php') AND
		!file_exists($file)
	)  continue;

    require_once $file;
}

$modx->getService('error','error.modError');
$modx->getRequest();
$modx->setLogLevel(modX::LOG_LEVEL_ERROR);
$modx->setLogTarget('FILE');
$modx->error->message = null;