{*
* До добавления Погодного виджета из таблиц
* <= country.html
* > countries/countries.css
* > infostart/infostart.css
* > shooseus/shooseus.css
* > info/info.css
*}
{set $template = $theme ~ '/country/'}

{*Минифицируем и собираем css js*}
{'!MinifyX@MinifyXHome' | snippet : [
    'cssSources'     =>
        $theme_modules ~ 'countries/countries.css,' ~
        $theme_modules ~ 'infostart/infostart.css,' ~
        $theme_modules ~ 'shooseus/shooseus.css,' ~
        $theme_modules ~ 'info/info.css,' ~
        $theme_modules ~ 'formrequest/formrequest.css,' ~
        $template ~ 'country.css',
    'jsSources'     =>
        $theme_modules ~ 'formrequest/formrequest.js,' ~
        $template ~ 'country.js'
]}

{*set $months = 'test' | snippet : [
'count' => 6,
'input' => $res.migx_weather_widget
]*}

{set $months = []}
{set $start = 12}
{set $count = 6}
{foreach $res.migx_weather_widget | fromJSON as $weather_widget index=$index}
    {if $weather_widget.param_en == '' | date : 'M'}
        {set $start = $index}
    {/if}
    {if $index >= $start && $index < $start + $count}
        {set $months[$weather_widget.param_en] = $weather_widget.valueen}
    {/if}
{/foreach}

{set $countries = 'pdoResources' | snippet : [
    'parents' => '8',
    'depth'   => 0,
    'includeTVs' => 'img_prev_bg,select_country',
    'where' => [
        'id:!=' => $res.id
    ]
    'tvPrefix' => '',
    'return'     => 'data'
]}
