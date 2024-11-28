<?php
/** @var modX $modx
 * Fenom modifiers
 */
switch ($modx->event->name) {
    case 'pdoToolsOnFenomInit':

		//- Converting to JSON with Unicode
		$fenom->addModifier('toJSONunicod', function ($input)
		{
			if (!is_array($input)) return $input;

			return json_encode($input, JSON_UNESCAPED_UNICODE);
		});

		//- Wrapping a string in tags
		$fenom->addModifier('wrap_tag', function ($input, $param)
		{
			$order = array("\r\n", "\n", "\r");

			$tag = '<'.$param.'>';
			$tag_end = '</'.$param.'>';

			$content = $tag.$input.$tag_end;
			$content = str_replace($order, $tag_end.$tag, $content);
			$content = str_replace($tag.$tag_end, '', $content);

			return $content;
		});

		//- Temperature rounding and more
		$fenom->addModifier('round', function ($input)
		{
			$input_int = $input * 1;
			$input_str = str_replace($input_int, '', $input);

			return $input_str . round($input_int);
		});

		//- preg_match with getting the desired occurrence
		$fenom->addModifier('preg_match_get', function ($input, $param)
		{
			preg_match($param, $input, $matches);
			return $matches[1] ?: "";
		});

		//- Determination of the URL depending on the availability of language localization
		//- Если есть локализация ничего не возвращает
		$fenom->addModifier('url_lang', function ($id, $default = '', $cultureKey = false) use ($modx)
		{
			$polylang = $modx->getService('polylang', 'Polylang');
			$tools = $polylang->getTools();

			if (!$cultureKey)
			{
				$cultureKey = $modx->getOption('cultureKey');
			}
			if (
				$tools->hasLocalization($id, $cultureKey)
				|| $cultureKey == 'en'
			) return $default;
			return str_ireplace('/' . $cultureKey . '/', '/', $modx->makeUrl($id,'','', 'full'));
		});

		//- Finds the equivalent of a field value from the MIGX store depending on the locale
		//- Находит эквивалент значения поля из MIGX хранилища в зависимости от языковой локализации
		$fenom->addModifier('lang_data', function ($field, $name = '', $cultureKey = false) use ($modx)
		{
			if (!$name) return $field;

			if (!$cultureKey)
			{
				$cultureKey = $modx->getOption('cultureKey');
			}

			$tv_value = '';
			if ($resource = $modx->getObject('modResource', 2))
			{
				// Получаем значение TV поля по имени
				$tv_value = json_decode($resource->getTVValue($name), true);
			}

			if (!is_array($tv_value)) return $field;

			$field_key = '';
			foreach ($tv_value as $value)
			{
				foreach ($value as $key => $item)
				{
					if ($item == $field)
					{
						$field_key = $key;
						break 2;
					}
				}
			}

			foreach ($tv_value as $value)
			{
				if ($value[$field_key] == $field)
				{
					$field_key_new = str_ireplace('_en', '_' . $cultureKey, $field_key);
					return $value[$field_key_new];
				}
			}

			return $field;
		});

		//- Finds the equivalent of a field value from custom tables depending on the language localization
		//- Находит эквивалент значения поля из кастомных таблиц в зависимости от языковой локализации
		$fenom->addModifier('lang_dbdata', function ($velue, $class = '', $field = '') use ($modx)
		{
			if (!$class || !$velue) return $velue;

			$fields = [
				'cmpCountries' => 'country',
				'cmpSports' => 'sport'
			];

			if (!$field)
			{
				$field = $fields[$class];
			}

			$cultureKey = $modx->getOption('cultureKey');

			if (!$object = $modx->getObject($class, (int) $velue))
			{
				$modx->log(modX::LOG_LEVEL_ERROR, 'Modifier[lang_dbdata]: Ошибка получения объёекта ID: ' . $velue . 'класса: ' . $class);
				return $velue;
			}

			return $object->get($field . '_' . $cultureKey);
		});

		//- Finds the equivalent value of the given field from custom tables
		//- Находит эквивалент значения заданного поля из кастомных таблиц
		$fenom->addModifier('dbdata', function ($velue, $class = '', $field = '', $source = '') use ($modx)
		{
			if (!$class || !$velue || !$field) return $velue;

			$pdoFetch = $modx->getService('pdoFetch');

			if (!$arr = $pdoFetch->getArray($class, $velue))
			{
				$modx->log(modX::LOG_LEVEL_ERROR, print_r(array(
						'source' => 'Modifier[dbdata]',
						'message' => 'Ошибка получения объёекта',
						'ID' => $velue,
						'class' => $class,
						'call' => $source
					), 1));
				return $velue;
			}

			return $arr[$field];

			/*if (!$object = $modx->getObject($class, (int) $velue))
			{
				$modx->log(modX::LOG_LEVEL_ERROR, 'Modifier[lang_dbdata]: Ошибка получения объёекта ID: ' . $velue . 'класса: ' . $class);
				return $velue;
			}

			return $object->get($field);*/
		});

		//- displaying an array of custom table values
		//- вывод массива значений кастомной таблицы
		$fenom->addModifier('dbarray', function ($velue, $class = '') use ($modx)
		{
			if (!$class || !$velue) return $velue;

			if (!$object = $modx->getObject($class, (int) $velue))
			{
				$modx->log(modX::LOG_LEVEL_ERROR, 'Modifier[lang_dbdata]: Ошибка получения объёекта ID: ' . $velue . 'класса: ' . $class);
				return $velue;
			}

			return $object->toArray();
		});

		//- Obtaining an array of data collections from custom tables
		//- Получение массива кллекции данных из кастомных таблиц
		$fenom->addModifier('dbdataarray', function ($velue, $class = '', $field = '') use ($modx)
		{
			if (!$class || !$velue || !$field) return $velue;

			$pdoFetch = $modx->getService('pdoFetch');

			if (!$arr = $pdoFetch->getCollection($class, array(
				$field => $velue
			)))
			{
				//$modx->log(modX::LOG_LEVEL_ERROR, 'Modifier[dbdataarray]: Ошибка получения объёектов по полю: ' . $field . ' значением: ' . $velue . ' класса: ' . $class);
				return $velue;
			}

			return $arr;
		});

		//- Retrieve field values from a specified resource
		//- Вывод значения полей из указанного ресурса
		$fenom->addModifier('field_res', function ($field, $id = 2) use ($modx)
		{
			$output = $modx->runSnippet('pdoField', array(
				'id' => $id,
				'field' => $field,
				'default' => 'pagetitle'
			));

			return $output;
		});

		//- Optimized image output
		//- Вывод оптимизированного изображегния
		$fenom->addModifier('pthumb', function ($input, $options) use ($modx)
		{
			$output = $modx->runSnippet('pthumb', array(
				'input' => $input,
				'options' => $options
			));

			return $output;
		});

		//- Получение ИД ресурса с помощью других полей
/*		 $fenom->addModifier('resid', function ($input, $param) use ($modx)
		 {
			 $output = $modx->runSnippet('pdoResources',array(
				 'parents'           => $input,
				 'limit'             => 1,
				 'select'            => 'id',
				 'where'             => $param,
				 'returnIds'         => 1
			 ));

			 return $output;
		 });*/

        break;
}
// TODO Оптимизировать запросы к базе через кеширование таблиц