<?php
/**
 * galleryMigx
 */

//- gallery_migx Принимаем и формируем массив для сравнения
//- We accept and form an array for comparison
$migx_in = [];
if ($postvalues[$field])
{
	$images = json_decode($postvalues[$field], true);
	if (count($images))
	{
		foreach ($images as $image)
		{
			$migx_in[$image['id']] = $image;
		}
	}
}
//$modx->log(modX::LOG_LEVEL_ERROR,'[habitationAftersave] $object: ' . print_r($migx_in, 1));

//- Если есть фото в галерее вытаскиваем место оригиналов
//- If there is a photo in the gallery, take out the place of the originals
if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');
$param['select'] = 'id,name,description,url';
$migx = [];
if (
	$productfiles = $pdoFetch->getCollection('msProductFile', array(
		'product_id' => $properties['resource_id'],
		'parent' => 0
), $param)
)
{
	//- Формируем новый массив с учётом изменённых данных
	foreach ($productfiles as $k => $productfile)
	{
		$migx[$k]['id'] = $productfile['id'];
		$migx[$k]['title_en'] = $migx_in[$productfile['id']]['title_en'] ?: $productfile['name'];
		$migx[$k]['alt_en'] = $migx_in[$productfile['id']]['alt_en'] ?: $productfile['description'];
		$migx[$k]['img'] = $productfile['url'];
		$migx[$k]['active'] = $migx_in[$productfile['id']]['active'] ?: 0;
		$migx[$k]['title_de'] = $migx_in[$productfile['id']]['title_de'] ?: '';
		$migx[$k]['alt_de'] = $migx_in[$productfile['id']]['alt_de'] ?: '';
	}

	//$modx->log(modX::LOG_LEVEL_ERROR,'[habitationAftersave] $object: ' . print_r($migx, 1));
}


