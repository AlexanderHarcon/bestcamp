{*
* < sports.html
* > countries/countries.css
* > info/info.css
*}
{set $template = $theme ~ '/sports/'}
{set $path_sports = $opt.assets_url ~ 'images/sports/'}

{*Минифицируем и собираем css js*}
{'!MinifyX@MinifyXHome' | snippet : [
    'cssSources'     =>
        $theme_modules ~ 'countries/countries.css,' ~
        $theme_modules ~ 'info/info.css,' ~
        $theme_modules ~ 'formrequest/formrequest.css,' ~
        $theme_modules ~ 'services/services.css,' ~
        $template ~ 'sports.css',
    'jsSources' =>
        $theme_modules ~ 'formrequest/formrequest.js,' ~
        $template ~ 'sports.js'
]}

{*Getting match values from custom tables*}
{*Получение масива значений из кастомных таблиц*}
{set $sport = $res.select_sports | dbarray : 'cmpSports'}