<?php
/** @var modX $modx
 * Автоматическая настройка источника файлов в товарах в зависимости от родителя
 * Automatic configuration of the file source in products depending on the parent
 */
switch ($modx->event->name)
{
    case 'OnDocFormRender':

		if ($resource->class_key != 'msProduct') return;

		if (!$page_parent = $modx->getObject('modResource', array('id' => $resource->parent)))
		{
			$modx->log(modX::LOG_LEVEL_ERROR,'[pl_shopSource]Error getting parent object ($resource->parent): ' . $resource->parent);
			return;
		}

		if (!$name = $page_parent->get('menutitle'))
		{
			$name = $page_parent->get('pagetitle');
		}

		if (!$source = $modx->getObject('modMediaSource', array('name' => $name)))
		{
			$modx->log(modX::LOG_LEVEL_ERROR,'[pl_shopSource]Error getting file source object ($name): ' . $name);
			return;
		}

		if (!$page_product = $modx->getObject('msProductData', array('id' => $resource->id)))
		{
			$modx->log(modX::LOG_LEVEL_ERROR,'[pl_shopSource]Error getting msProductData object ($resource->id): ' . $resource->id);
			return;
		}

		if ($page_product->get('source') == $source->get('id')) return;

		$page_product->set('source', $source->get('id'));
		$page_product->save();

        break;
}