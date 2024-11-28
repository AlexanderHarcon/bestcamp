<?php
/** @var modX $modx
 * Редирект на базовый Урл при отсутствии локаоизованной версии
 * Redirect to the base URL if there is no localized version
 */
switch ($modx->event->name) {
    case 'OnHasPolylangError404':

		if (!$has) return;

		$order = array('/de/');

		$url = $modx->makeUrl($modx->resource->get('id'), '', '', 'full');
		$url = str_ireplace($order, '/', $url);
		$modx->sendRedirect($url, array('responseCode' => 'HTTP/1.1 301 Moved Permanently'));

		//$modx->log(modX::LOG_LEVEL_ERROR, '[pl_lang]: ' . $has . '--' . print_r($url, 1));
		//$modx->log(modX::LOG_LEVEL_ERROR, '[pl_lang]: ' . print_r($_SERVER, 1));

        break;
}