<?php
if (file_exists(dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php')) {
    /** @noinspection PhpIncludeInspection */
    require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
}
else {
    require_once dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php';
}
/** @noinspection PhpIncludeInspection */
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
/** @noinspection PhpIncludeInspection */
require_once MODX_CONNECTORS_PATH . 'index.php';

$modx->lexicon->load('xbuttons:default');

// handle request
$path = $modx->getOption('xbuttons_core_path', null, $modx->getOption('core_path') . 'components/xbuttons/').'processors/';
//$modx->log(modX::LOG_LEVEL_ERROR, $path);
$modx->request->handleRequest(array(
	'processors_path' => $path,
	'location' => '',
));