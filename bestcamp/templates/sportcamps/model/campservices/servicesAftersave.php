<?php
/**
 * servicesAftersave
 * Passing Data to Related Tables about Sports
 * Передача данных в связанные таблицы о Видах спорта
 * Passing Data to Related Tables about slave Service
 * Передача данных в связанные таблицы с подчиненными сервисами
 */
$templates_obj = [7,8];
$parents = [14,301];

//$modx->addPackage('campservices',MODX_CORE_PATH.'components/campservices/model/');

$object = &$modx->getOption('object', $scriptProperties, null);
$postvalues = $modx->getOption('postvalues', $scriptProperties, null);
$properties = $modx->getOption('scriptProperties',$scriptProperties,array());
$pdoFetch = null;

/**
 * Sports
 */
$config = [];
$config['link_classname'] = 'cmpSportService';
$config['link_alias'] = 'ServiceSport';
$config['postfield'] = 'sport_ids';
$config['id_field'] = 'service_id';
$config['link_field'] = 'sport_id';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

//- Записываем массив данных в поле
//- We write an array of data into a field
$sport = 1;
if (!is_array($properties['sport_ids']))
{
	if (!$properties['sport_ids'])
	{
		$sport = 0;
	}
	$properties['sport_ids'] = [$properties['sport_ids']];
}

/**
 * Links
 */
$config = [];
$config['link_classname'] = 'cmpServiceLink';
$config['link_alias'] = 'masterService';
$config['postfield'] = 'service_ids';
$config['id_field'] = 'master';
$config['link_field'] = 'slave';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

//- We write an array of data into a field
if (!is_array($properties['service_ids']))
{
	$properties['service_ids'] = [$properties['service_ids']];
}

/**
 * Evaluation
 */
$config = [];
$config['link_classname'] = 'cmpServiceEvaluation';
$config['link_alias'] = 'ServiceEvaluation';
$config['postfield'] = 'evaluation_ids';
$config['id_field'] = 'service_id';
$config['link_field'] = 'evaluation_id';
$modx->migx->handleRelatedLinks($object, $postvalues, $config);

//- We write an array of data into a field
if (!is_array($properties['evaluation_ids']))
{
	$properties['evaluation_ids'] = [$properties['evaluation_ids']];
}
//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftersave] $object: ' . print_r($object->toArray(), 1));

//- Принимаем и формируем массив для сравнения
//- We accept and form an array for comparison
$migx_in = [];
if ($properties['evaluation_migx'])
{
	$migx_arr = json_decode($properties['evaluation_migx'], true);
	if (count($migx_arr))
	{
		foreach ($migx_arr as $item)
		{
			$migx_in[$item['evaluation_id']] = $item;

			//- Если есть Прайс загружаем Объект из таблицы связей
			//- If there is a Price, load the Object from the links table
			if (!$objlinks = $modx->getObject('cmpServiceEvaluation', array(
					'service_id' => $object->get('id'),
					'evaluation_id' => $item['evaluation_id']
			)))
			{
				$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftersave] $objlinks: object getting error');
				continue;
			}

			$objlinks->set('price', $item['price'] ?: 0);
			$objlinks->save();
		}
	}
}

$migx = [];
if ($properties['evaluation_ids'][0])
{
	//- Loading the service
	if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

	//- Loading data from Evaluations
	$param['select'] = 'id,title_en';
	$evaluation_arr = $pdoFetch->getCollection('cmpEvaluation', array(
		'id:IN' => $properties['evaluation_ids']
	), $param);

	$evaluation = [];
	foreach ($evaluation_arr as $item)
	{
		$evaluation[$item['id']] = $item['title_en'];
	}

	$k = 0;
	foreach ($properties['evaluation_ids'] as $item)
	{
		$migx[$k]['evaluation_id'] = $item;
		$migx[$k]['price'] = $migx_in[$item]['price'] ?: 0;
		$migx[$k]['active'] = $migx_in[$item] ? $migx_in[$item]['active'] : 1;
		$migx[$k]['title'] = $evaluation[$item];

		$k++;
	}
}

if (!$object) return '';

$object->set('sport',$sport);
$object->set('sport_ids',$properties['sport_ids']);
$object->set('service_ids',$properties['service_ids']);
$object->set('evaluation_ids',$properties['evaluation_ids']);
$object->set('evaluation_migx', json_encode($migx));
$object->save();

//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftersave] $properties: ' . print_r($properties, 1));
//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftersave] $object: ' . print_r($object->toArray(), 1));

/**
 * ObjectServices
 * Только при зоздании нового Сервиса
 */
if (
	$object->get('sport') ||
	$object->get('object_id') != 'new'
) return '';
//- Loading the service
if (!$pdoFetch) $pdoFetch = $modx->getService('pdoFetch');

$param['select'] = 'id';
$msProduct_arr = $pdoFetch->getCollection('msProduct', array(
	'template:IN' => $templates_obj,
	'parent:IN' => $parents
), $param);

$service_migx = [];
if ($properties['service_ids'][0])
{
	//- Загружаем данные по Сервисам
	$param['select'] = 'id,title_en,evaluation_migx';
	$services_arr = $pdoFetch->getCollection('cmpObjServices', array(
		'id:IN' => $properties['service_ids']
	), $param);

	foreach ($services_arr as $k => $item)
	{
		$service_migx[$k]['service_id'] = $item['id'];
		$service_migx[$k]['service_title'] = $item['title_en'];
		$service_migx[$k]['evaluation_migx'] = json_encode($item['evaluation_migx']);
		$service_migx[$k]['active'] = 1;
	}
}

foreach ($msProduct_arr as $item)
{
	$object_new = $modx->newObject('cmpObjectServices');
	$object_new->set('resource_id', $item['id']);
	$object_new->set('service_id', $object->get('id'));
	$object_new->set('service_title', $object->get('title_en'));
	$object_new->set('evaluation_migx', $object->get('evaluation_migx'));
	$object_new->set('service_migx', json_encode($service_migx));
	$object_new->set('published', 1);
	$object_new->set('publishedon', time());
	$object_new->set('publishedby', $modx->getUser());
	$object_new->set('createdby', $modx->getUser());
	$object_new->set('createdon', time());
	$object_new->save();

	//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftersave] $object_new: ' . print_r($object_new->toArray(), 1));

	if ($properties['evaluation_ids'][0])
	{
		foreach ($properties['evaluation_ids'] as $evaluation_id)
		{
			$object_new2 = $modx->newObject('cmpObjServiceEvaluation');
			$object_new2->set('evaluation_id', $evaluation_id);
			$object_new2->set('objservice_id', $object_new->get('id'));
			$object_new2->save();

			//$modx->log(modX::LOG_LEVEL_ERROR,'[servicesAftersave] $object_new2: ' . print_r($object_new2->toArray(), 1));
		}
	}
}

return '';