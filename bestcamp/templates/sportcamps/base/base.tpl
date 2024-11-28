{*
* < base.html
*}
{var $theme = $templates ~ 'sportcamps'}
{var $template = $theme ~ '/base/'}
{var $theme_css = $theme ~ '/css/'}
{var $theme_js = $theme ~ '/js/'}
{var $theme_modules = $theme ~ '/modules/'}
{var $modules = 'sportcamps/modules/'}

{*Minify and collect css js*}
{'!MinifyX' | snippet : [
    'minifyCss'      => 0,
    'registerCss'    => 'placeholder',
    'cssPlaceholder' => 'minify_css_base',
    'hooks'          => 'csshook',
    'cssSources'     =>
        $template ~ 'base.css',
    'minifyJs'      => 1,
    'registerJs'    => 'placeholder',
    'jsPlaceholder' => 'minify_js_base',
    'jsSources'     =>
        $template ~ 'base.js'
]}

{set $onlyWithLocalization = 1}
{if $_modx->user.id > 0}
    {set $onlyWithLocalization = 0}
{/if}

{*Language switcher*}
{set $PolylangLinks = 'PolylangLinks' | snippet : [
    'tpl' => '@FILE sportcamps/base/tpl_polylang_links.html',
    'onlyWithLocalization' => $onlyWithLocalization,
    'css' => '',
    'js' => ''
]}

{*Alternate meta tags*}
{set $PolylangCanonical = 'PolylangCanonical' | snippet : [
    'tpl' => '@FILE sportcamps/base/tpl_polylang_canonical.tpl'
]}