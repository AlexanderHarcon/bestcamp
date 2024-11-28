<?php
/**
 * getIdsPost
 * Obtaining resource IDs corresponding to the current data using POST
 * Получение IDs ресурсов соттветствующие данным текущего используя POST
 */
//- Loading the service
$pdoFetch = $modx->getService('pdoFetch');
$param = $modx->getOption('param', $scriptProperties, 'resource_id');
$class = $modx->getOption('class', $scriptProperties, 'modResource');
$field = $modx->getOption('field', $scriptProperties, 'pagetitle');
$switch = $modx->getOption('switch', $scriptProperties, 'default');
$resources = [];

switch ($switch)
{
	case 'sportCamps':

		/**
		 * dbr_SportCamps < sport_id < Chunk: listsportCamps (68)
		 */
		//-$modx->log(modX::LOG_LEVEL_ERROR, '[getIdsPost]:$_POST ' . print_r($_POST, 1));

		$output = [];
		$resource_id = (int) $_POST[$param];

		if ($_POST['object_id'] == 'new' && !$resource_id) break;

		if (!$resource_id)
		{
			$select['select'] = 'resource_id';
			if ($camp = $pdoFetch->getArray('cmpSportCamps', $_POST['object_id'], $select))
			{
				$resource_id = $camp['resource_id'];
			}
		}

		$select['select'] = 'sport_id';
		if (!$collection = $pdoFetch->getCollection('cmpObjectSport', array(
			'resource_id' => $resource_id,
			'published' => 1
		), $select)) return 0;


		foreach ($collection as $k => $data)
		{
			$output[] = $data['sport_id'];
		}

		break;

	case 'CampsFeatures':

		/**
		 * dbr_SportCamps < features_ids < Chunk: listCampsFeatures (69)
		 * Сбор данных по Особенностям и вывод их в Кемпах
		 */

		$output = [];
		$resource_id = (int) $_POST[$param];

		if ($_POST['object_id'] == 'new' && !$resource_id) break;

		if (!$resource_id)
		{
			$select['select'] = 'resource_id';
			if ($camp = $pdoFetch->getArray('cmpSportCamps', $_POST['object_id'], $select))
			{
				$resource_id = $camp['resource_id'];
			}
		}

		$select['select'] = 'country,region,city';
		if (!$arrdata = $pdoFetch->getArray('msProductData', array(
			'id' => $resource_id
		), $select)) return 0;

		$features_ids = 'features_ids';
		$select['select'] = $features_ids;

		if (
			$arrdata['country'] &&
			$arr = $pdoFetch->getArray('cmpCountries', array(
				'id' => $arrdata['country']
		), $select))
		{

			if (is_array($arr[$features_ids]) && $arr[$features_ids][0])
			{
				$output = $arr[$features_ids];
			}
		}

		if (
			$arrdata['region'] &&
			$arr = $pdoFetch->getArray('cmpRegions', array(
				'id' => $arrdata['region']
		), $select))
		{
			if (is_array($arr[$features_ids]) && $arr[$features_ids][0])
			{
				foreach ($arr[$features_ids] as $item)
				{
					if (in_array($item, $output)) continue;

					$output[] = $item;
				}
			}
		}

		if (
			$arrdata['city'] &&
			$arr = $pdoFetch->getArray('cmpCities', array(
				'id' => $arrdata['city']
			), $select))
		{
			if (is_array($arr[$features_ids]) && $arr[$features_ids][0])
			{
				foreach ($arr[$features_ids] as $item)
				{
					if (in_array($item, $output)) continue;

					$output[] = $item;
				}
			}
		}

		$select['select'] = 'value';
		if ($arr = $pdoFetch->getArray('modTemplateVarResource', array(
				'contentid' => $resource_id,
				'tmplvarid' => 67
			), $select))
		{
			$arr = explode('||', $arr['value']);

			foreach ($arr as $item)
			{
				if (in_array($item, $output)) continue;

				$output[] = $item;
			}
		}



		break;

	// Спит........
	case 'ObjectSport':

		$select['select'] = 'infrastr_id';
		if (!$resources = $pdoFetch->getCollection('cmpObjSportInfra', array(
			$param => (int) $_POST[$param]
		), $select))
		{
			$modx->log(MODX_LOG_LEVEL_ERROR,'[getIdsPost-ObjectSport] $dbmigx: There are no Objects with this field: '. $field . ' = ' . $_POST[$param]);
			return 0;
		}

		$output = [];
		foreach ($resources as $k => $resource)
		{
			if (in_array($resource['infrastr_id'], $output)) continue;

			$output[] = $resource['infrastr_id'];
		}

		//$modx->log(modX::LOG_LEVEL_ERROR, '[$output]: ' . print_r($output, 1));

		$select['select'] = 'sport_id';
		if (!$resources = $pdoFetch->getCollection('cmpInfrastrSport', array(
			'infrastr_id:IN' => $output
		), $select))
		{
			$modx->log(MODX_LOG_LEVEL_ERROR,'[getIdsPost-ObjectSport] $resources: There are no Objects with this field: ');
			return 0;
		}

		$output = [];
		foreach ($resources as $k => $resource)
		{
			$output[] = $resource['sport_id'];
		}

		break;

	case 'default':

		//- Finding the current resource
		if (!$resource = $pdoFetch->getArray($class, (int) $_POST[$param]))
		{
			$modx->log(MODX_LOG_LEVEL_ERROR,'[getIdsPost] $resource: There is no Object with this ID: ' . $_POST[$param]);
			return 0;
		}

		//- We find all resources that correspond to the current parameter
		//- Находим все ресурсы, которые соотвуют парметру текущего
		$select['select'] = 'id';
		if (!$resources = $pdoFetch->getCollection($class, array(
			$field => $resource[$field]
		), $select))
		{
			$modx->log(MODX_LOG_LEVEL_ERROR,'[getIdsPost] $resources: There are no Objects with this field: '. $field . ' = ' . $_POST[$param]);
			return 0;
		}

		$output = [];
		foreach ($resources as $k => $resource)
		{
			$output[] = $resource['id'];
		}
}

//return '300,301';
//$modx->log(modX::LOG_LEVEL_ERROR, '[getIdsPost]: ' . print_r($output, 1));
return implode(',', $output);