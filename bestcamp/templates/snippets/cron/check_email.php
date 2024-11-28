<?php
/** @var modX $modx */
//exit('NON');
require_once '../console/idx.php';
//-------------------------------------------------------------------------------------------------------

$emailTo = '7527862@ukr.net';
$subject = 'Проверка почты с сайта';
$message = 'Это тестовое сообщение для проверки отправки почты.';

$sent = $modx->getService('mail', 'mail.modPHPMailer');
$modx->mail->set(modMail::MAIL_SUBJECT, $subject);
$modx->mail->set(modMail::MAIL_BODY, $message);
$modx->mail->set(modMail::MAIL_SENDER, 'admin@bestsportcamps.com'); // замените на отправителя
$modx->mail->set(modMail::MAIL_FROM, 'admin@bestsportcamps.com');   // замените на реальный адрес
$modx->mail->address('to', $emailTo);

if (!$modx->mail->send())
{
	// Логируем ошибку, если письмо не отправлено
	$modx->log(modX::LOG_LEVEL_ERROR, 'Ошибка при отправке тестового сообщения.');
	// Также можно отправить письмо об ошибке на другой email или добавить другие действия
}
else
{
	// Очищаем объект почты
	$modx->mail->reset();
}

//$modx->log(modX::LOG_LEVEL_ERROR,'[habitationAftersave] $object: ' . print_r($object->toArray(), 1));

return '';