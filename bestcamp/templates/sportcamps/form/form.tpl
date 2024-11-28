{*Форма обратной связи
    > home.pug
*}

{set $success_message = 'polylang_site_request-manager' | lexicon}
{set $email_subject = 'Запрос со страницы: ' ~ $pagetitle_res}
{if $bell}
    {set $email_subject = 'Заказ обратного звоннка'}
{/if}
{set $hooks = $hooks ? : ''}

{'!FetchIt' | snippet : [
    'snippet' => 'FormIt',
    'form'                      => $form,
    'hooks'                     => $hooks ~ 'email',
    'emailTpl'                  => '@FILE sportcamps/form/tpl_mail.html',
    'emailTo'                   => '7527862@ukr.net,oleg.shats.001@gmail.com,info@activeplanet.com,oleg@a-cy.com,vakeria.vlasyuk@gmail.com,request@activeplanet.com',
    'emailFrom'                 => 'admin@' ~ $opt.http_host,
    'emailReplyTo'              => '[[+email]]',
    'emailFromName'             => $opt.http_host,
    'emailSubject'              => $email_subject,
    'validate'                  => $validate,
    'validationErrorMessage'    => 'polylang_site_form-error' | lexicon,
    'successMessage'            => 'polylang_site_request-manager' | lexicon,
    'clearFieldsOnSuccess' => 1,
]}