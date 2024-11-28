{*
* < tpl_render.pug / dbr_ObjectSport / service_idsrender
*}
{*Получаем все данные записи*}
{set $sportobj = $id | dbarray : 'cmpObjectSport'}

{*Из таблицы связей получаем данные по сервисам конкретного Спорта*}
{set $sport_service = 'pdoResources' | snippet : [
    'parents' => 0,
    'depth'   => 0,
    'limit'   => 0,
    'select' => 'service_id',
    'sortby' => 'sport_id',
    'where' => [
        'sport_id' => $sportobj.sport_id
    ],
    'class' => 'cmpSportService',
    'return'     => 'data'
]}

{*Из поля service_migx получаем и обрабатываем данные для отслеживания деактивации*}
{set $service_migx = $sportobj.service_migx | fromJSON}
{set $services = []}
{foreach $service_migx as $item}
    {set $services[$item.service_id] = $item}
{/foreach}