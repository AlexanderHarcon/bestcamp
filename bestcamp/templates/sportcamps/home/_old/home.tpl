{*
* < home.html
*}
{set $template = $theme ~ '/home/'}
{set $images_home = $images ~ 'home/'}

{*Блок FAQ*}
{set $faq_migx = []}
{set $faq_html = ''}

{foreach $res.migx_faq | fromJSON as $faq}

    {if $faq.active != 1}{continue}{/if}

    {*Микроразметка FAQ*}
    {set $faq_migx[] =[
        '@type' => 'Question',
        'name' => $faq.question,
        'acceptedAnswer' =>[
        '@type' => 'Answer',
        'text' => $faq.answer
    ]]}

    {set $faq_i}
        <div class="faq_item">
            <div class="faq_question">
                <span class="question_title">{$faq.question}</span>
                <img src="{$images}arrow_black.svg" class="dropdown_icon" alt="">
            </div>
            <div class="faq_answer">{$faq.answer}</div>
        </div>
    {/set}

    {set $faq_html = $faq_html ~ $faq_i}

{/foreach}

{set $data = [
    '@context' => 'https://schema.org',
    '@type' => 'FAQPage',
    'mainEntity' => $faq_migx
]}
