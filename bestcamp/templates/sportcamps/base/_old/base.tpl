{*
* < base.html
*}
{set $opt = $_modx->config}
{set $res = $_modx->resource}
{set $templates = $opt.pdotools_elements_path | replace : $opt.base_path : ''}
{set $templates_libs = $templates ~ 'libs/'}
{set $theme = $templates ~ 'sportcamps'}
{set $template = $theme ~ '/base/'}
{set $images = $opt.assets_url ~ 'images/'}
{set $images_social = $images ~ 'social/'}

{*Минифицируем и собираем css js*}
{'!MinifyX' | snippet : [
    'minifyCss'      => 0,
    'registerCss'    => 'placeholder',
    'cssPlaceholder' => 'minify_css_base',
    'cssSources'     =>
        $template ~ 'base.css',
    'minifyJs'      => 1,
    'registerJs'    => 'placeholder',
    'jsPlaceholder' => 'minify_js_base',
    'jsSources'     =>
        $template ~ 'base.js'
]}
