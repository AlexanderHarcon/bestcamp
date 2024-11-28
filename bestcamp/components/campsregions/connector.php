<?php
/**
 * campsregions Connector
 * @package campsregions
 */
$base_path = dirname(__FILE__);
while (!file_exists($base_path . '/config.core.php')) {
	$base_path = dirname($base_path);
}
require_once $base_path . '/config.core.php';
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

// Подключаем модель наших объектов
$modx->addPackage('campsregions', MODX_CORE_PATH . 'components/campsregions/model/');
$modx->request->handleRequest(array(
	'processors_path' => MODX_CORE_PATH . 'components/campsregions/processors/',
	'location' => '',
));
