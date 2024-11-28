{*
* < system.html
*}
{set $template = $theme ~ '/system/'}

{*Минифицируем и собираем css js*}
{'!MinifyX@MinifyXHome' | snippet : [
    'cssSources'     =>
        $template ~ 'system.css',
]}