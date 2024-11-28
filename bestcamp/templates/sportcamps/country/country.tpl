{*
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
        $theme_modules ~ 'services/services.css,' ~
        $theme_modules ~ 'included/included.css,' ~
        $theme_modules ~ 'services2/services2.css,' ~
        $theme_modules ~ 'maininfo/maininfo.css,' ~
        $theme_modules ~ 'campoverview/campoverview.css,' ~
        $theme_modules ~ 'infrastructure/infrastructure.css,' ~
        $theme_modules ~ 'hoteloverview/hoteloverview.css,' ~
        $theme_modules ~ 'location/location.css,' ~
        $theme_modules ~ 'priceincluded/priceincluded.css,' ~
        $theme_modules ~ 'visitcard/visitcard.css,' ~
        $theme_modules ~ 'goodtoknow/goodtoknow.css,' ~
        $theme_modules ~ 'excursions/excursions.css,' ~
        $theme_modules ~ 'reviews/reviews.css,' ~
        $theme_modules ~ 'preview/preview.css,' ~
        $template ~ 'country.css',
    'jsSources'     =>
        $theme_modules ~ 'formrequest/formrequest.js,' ~
        $theme_modules ~ 'hoteloverview/hoteloverview.js,' ~
        $template ~ 'country.js'
]}

{*set $months = 'test' | snippet : [
'count' => 6,
'input' => $res.migx_weather_widget
]*}

{*Getting match values from custom tables*}
{*Получение массива значений из кастомных таблиц*}
{set $sport = ($res.parent | resource : 'select_sports') | dbarray : 'cmpSports'}

{*set $sportobj = 2 | dbarray : 'cmpObjectSport'*}

{*Find out if the Region is specified*}
{*Выясняем указан ли Регион*}
{if $res.drop_region}
    {set $country = $res.drop_region | dbarray : 'cmpRegions'}

    {*Is the Climate in the Region full?*}
    {*Заполнен ли Климат в Регионе*}
    {if !$country.climate}
        {set $country_reg = $country.country_id | dbarray : 'cmpCountries'}
        {set $country.climate = $country_reg.climate}
    {/if}

{else}
    {set $country = $res.drop_contry | dbarray : 'cmpCountries'}
{/if}

{set $country.climate = $country.climate | fromJSON}

{*We show climate data for the first 6 months*}
{*Показываем данные Климата на первые 6 месяцев*}
{set $months = []}
{set $start = 12}
{set $count = 6}
{foreach $country.climate as $climate}
    {if $climate.informer_id == 1}
        {foreach $climate.indicators | fromJSON as $indicators index=$index}
            {if $indicators.param_en == '' | date : 'M'}
                {set $start = $index}
            {/if}
            {if $index >= $start && $index < $start + $count}
                {set $months[$indicators.param_en] = $indicators.value_en}
            {/if}
        {/foreach}
    {/if}

    {*We bring it up to 6 months*}
    {*Доводим до 6 месяцев*}
    {if ($months | len) < $count}
        {set $iter = $count - ($months | len)}
        {foreach $climate.indicators | fromJSON as $indicators index=$index}
            {if $index < $iter}
                {set $months[$indicators.param_en] = $indicators.value_en}
            {/if}
        {/foreach}
    {/if}
{/foreach}

