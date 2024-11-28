<?php
/**
 * https://bestsportcamps.com/assets/templates/snippets/console/console.php
 */
exit('NON');
require_once 'idx.php';
//-------------------------------------------------------------------------------------------------------
if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

$param['select'] = 'id,service_id,evaluation_migx';
$cmpObjectServices = $pdoFetch->getCollection('cmpObjectServices', array(
	'published' => 1
), $param);

foreach ($cmpObjectServices as $item)
{
	foreach ($item['evaluation_migx'] as $evaluation)
	{
		if (!$objekt = $modx->getObject('cmpObjServiceEvaluation', array(
			'objservice_id' => $item['id'],
			'evaluation_id' => $evaluation['evaluation_id']
		)))
		{
			$object_new = $modx->newObject('cmpObjServiceEvaluation');
			$object_new->set('objservice_id', $item['id']);
			$object_new->set('evaluation_id', $evaluation['evaluation_id']);
			$object_new->set('price', $evaluation['price_new']);
			$object_new->save();
		}
		else
		{
			$objekt->set('price', $evaluation['price_new']);
			$objekt->save();
		}
	}
}

//exit('ggggggggg');
//----------------------------------------------------------
echo '<!DOCTYPE html><head><meta charset="UTF-8"></head>';
echo '<h1>Test</h1>';
echo '<pre>' . print_r($cmpObjectServices, 1) . '</pre>';
//echo $output;
exit;