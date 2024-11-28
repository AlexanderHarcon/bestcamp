{*
* < base.html
*}
{set $opt = $_modx->config}
{set $res = $_modx->resource}
{set $images_path   = $opt.assets_url ~ 'images/'}
{var $templates     = $opt.pdotools_elements_path | replace : $opt.base_path : ''}
{set $lang = $opt.cultureKey}
{var $templates_js  = $templates ~ 'js/'}
{set $access = '' | ismember : ['Administrator', 'Manager']}
{set $youtube_reg = '%^(?:https?://)?(?:www\.|m\.)?(?:youtu\.be/|youtube(?:-nocookie)?\.com(?:/watch\?v=|/watch/\?v=|/embed/|/v/))([\w-]{10}[048AEIMQUYcgkosw]{1})($|\S+).*$%x'}