{*
* < countries.html
*}

{if $source}
    {set $services_migx = 'migx_services' | field_res : $source}
    {set $imgservices_migx = 'migx_imgservices' | field_res : $source}
{else}
    {set $services_migx = $res.migx_services | fromJSON}
    {set $imgservices_migx = $res.migx_imgservices | fromJSON}
{/if}

{set $services_1 = []}
{set $services_2 = []}
{set $count = $services_migx | len}

{foreach $services_migx as $service}

    {if $service.active != 1 || !$service['param_' ~ $lang]}{continue}{/if}

    {if $service@index < ($count / 2)}
        {set $services_1[] = $service['param_' ~ $lang]}
    {else}
        {set $services_2[] = $service['param_' ~ $lang]}
    {/if}

{/foreach}

{set $imgservices_1 = []}
{set $imgservices_2 = []}
{set $count = $imgservices_migx | len}

{foreach $imgservices_migx as $img}

    {if $img.active != 1}{continue}{/if}

    {if $service@index < 3}
        {set $imgservices_1[$service@index]['img'] = $img.img | fromJSON}
        {set $imgservices_1[$service@index]['title'] = $img['title_' ~ $lang]}
        {set $imgservices_1[$service@index]['alt'] = $img['alt_' ~ $lang]}
    {elseif $service@index >= 3 && $service@index < 6}
        {set $imgservices_2[$service@index]['img'] = $img.img | fromJSON}
        {set $imgservices_2[$service@index]['title'] = $img['title_' ~ $lang]}
        {set $imgservices_2[$service@index]['alt'] = $img['alt_' ~ $lang]}
    {/if}

{/foreach}