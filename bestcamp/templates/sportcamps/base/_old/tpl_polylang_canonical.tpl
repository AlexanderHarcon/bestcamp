{*
* < base.tpl
*}
{if $current?}
    <link  rel="canonical"  href="{$url}"/>
    {if $total>1}
        {$.const.PHP_EOL}
    {/if}
{/if}
{if $total>1}
    <link  rel="alternate" hreflang="{$lang}" href="{$url}"/>
{/if}