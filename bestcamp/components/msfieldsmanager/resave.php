<?php
header('Content-Type: application/json; charset=UTF-8');
define('MODX_API_MODE', true);
require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/index.php';

$modx->getService('error', 'error.modError');
$modx->setLogLevel(modX::LOG_LEVEL_ERROR);
$modx->setLogTarget('FILE');

set_time_limit(0);

$wait = 0;
$total = 0;
$success = 0;
$error = 0;

$classKey = 'msProduct';

$q = $modx->newQuery($classKey);
$q->select($modx->getSelectColumns($classKey, $classKey, '', array('id')));
$q->where(array('class_key' => 'msProduct'));

if ($q->prepare() && $q->stmt->execute()) {
    while ($id = $q->stmt->fetch(PDO::FETCH_COLUMN)) {
        $total++;
        if ($product = $modx->getObject('msProduct', $id)) {
            if (!$product->save()) {
                $error++;
                $modx->log(modX::LOG_LEVEL_ERROR, 'Error save product ID:' . $id);
            } else {
                $success++;
            }
        }
        if ($wait) sleep($wait);
    }
}
echo "total:{$total};  success: {$success}; error: {$error}";