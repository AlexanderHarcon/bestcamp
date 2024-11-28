<?php
/**
 * Проба
 */
$modx->addPackage('campsregions',MODX_CORE_PATH.'components/campsregions/model/');

$object = &$modx->getOption('object', $scriptProperties, null);
$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties', $scriptProperties, array());

