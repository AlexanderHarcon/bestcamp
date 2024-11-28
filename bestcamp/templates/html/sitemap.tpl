{switch ('cultureKey' | option)}
{case 'en'}
{set $sitemap_en = 'PolylangSitemap' | snippet : [
	'parents'       	=> '0',
	'showHidden'    	=> 1,
	'hideUnsearchable'  => 1,
	'tpl'           	=> '@INLINE <url><loc>{$url}</loc><lastmod>{$date}</lastmod></url>'
]}
{$sitemap_en | preg_replace : '~\.com\/<\/~': '.com</'}
{case'de'}
{set $sitemap_de = 'PolylangSitemap' | snippet : [
	'parents'       	=> '0',
	'resources'       	=> '-1',
	'showHidden'    	=> 1,
	'hideUnsearchable'  => 1,
	'onlyWithLocalization'  => 1,
	'tpl'           	=> '@INLINE <url><loc>{$url}</loc><lastmod>{$date}</lastmod></url>'
]}
{$sitemap_de | replace : '.com/de/</' : '.com/de</'}
{/switch}