<?php
/** @var modX $modx
 */
switch ($modx->event->name)
{
    case 'OnHandleRequest':

		// Определяем системную переменную friendly urls
		$uri = $modx->context->getOption('request_param_alias', 'q');
		// Проверяем её наличие в запросе.
		if (!isset($_REQUEST[$uri])) return;

		// Разбиваем путь на массив сегментов
		$segments = explode('/', $_REQUEST[$uri]);

		// Если путь не из 3 сегментов
		if (count($segments) != 3) return;

		$uries_root = [
			'sport-facilities'
		];

		// Если не соответствует категории выходим
		if (!in_array($segments[0], $uries_root)) return;

		// Формируем Ури целевой страницы
		$uri = $segments[0] . '/' . $segments[1];

		// Ищем ресурс по полученному Ури
		if (!$id = $modx->findResource($uri)) return;

		$pdoFetch = $modx->getService('pdoFetch');

		//- Обращаемся к объекту Кемпа
		$select['select'] = 'article,sport_id,title_en,title_de,desc_en,desc_de,habitation_ids,infrahabitation_ids,nutrition_ids,service_ids,services_migx,price,prices,rating_id,status_id,features_ids,tag_ids,properties,published,resource_id';
		if (!$camp = $pdoFetch->getArray('cmpSportCamps', array(
			'article' => $segments[2],
			'deleted' => 0
		), $select)) break;

		if ($id != $camp['resource_id']) return;

		// Отправляем переменную с массивом данных
		$_POST['camp'] = $camp;

		// Переходим на целевую страницу
		$modx->sendForward($id, '');

		//$modx->log(modX::LOG_LEVEL_ERROR, '[pl_test]: ' . print_r($camp, 1));

        break;
}