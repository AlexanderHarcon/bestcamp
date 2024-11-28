<?php
/**
 * getSession
 * Retrieving session data
 * Получение данных сессии
 */
if (!isset($param)) return;
return $_SESSION[$param];