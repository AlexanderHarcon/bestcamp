{*
* < home.html
* > faq-tpl.html
* > countries/countries.css
* > infostart/infostart.css
* > shooseus/shooseus.css
* > info/info.css
*}
{set $template = $theme ~ '/home/'}

{*Минифицируем и собираем css js*}
{'!MinifyX@MinifyXHome' | snippet : [
    'cssSources'     =>
        $theme_modules ~ 'countries/countries.css,' ~
        $theme_modules ~ 'infostart/infostart.css,' ~
        $theme_modules ~ 'shooseus/shooseus.css,' ~
        $theme_modules ~ 'info/info.css,' ~
        $theme_modules ~ 'formrequest/formrequest.css,' ~
        $template ~ 'home.css',
    'jsSources'     =>
        $theme_modules ~ 'formrequest/formrequest.js,' ~
        $template ~ 'home.js'
]}

{*set $product = '- not chosen -==0' ~'msProducts' | snippet : [
    'parents' => '14',
    'showUnpublished' => 1,
    'tpl' => '@INLINE ||[[+pagetitle]]==[[+id]]',
]*}

{*Блок FAQ*}
{set $faq_migx = []}
{set $faq_html = ''}

{foreach $res.migx_faq | fromJSON as $faq}

    {if $faq.active != 1 || !$faq['param_' ~ $lang]}{continue}{/if}

    {*Микроразметка FAQ*}
    {set $faq_migx[] =[
        '@type' => 'Question',
        'name' => $faq['param_' ~ $lang],
        'acceptedAnswer' =>[
        '@type' => 'Answer',
        'text' => $faq['value_' ~ $lang]
    ]]}

    {set $faq_i}
        {include "file:sportcamps/home/faq-tpl.html"
            i=$faq@index
            question=$faq['param_' ~ $lang]
            answer=$faq['value_' ~ $lang]
        }
    {/set}

    {set $faq_html = $faq_html ~ $faq_i}

{/foreach}

{set $data = [
    '@context' => 'https://schema.org',
    '@type' => 'FAQPage',
    'mainEntity' => $faq_migx
]}
{*Блок FAQ**********END*}
