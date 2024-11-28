<?php
/**
 * msFieldsManager Connector
 * @package msfieldsmanager
 */

require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require_once MODX_CONNECTORS_PATH.'index.php';

$corePath = $modx->getOption('msfieldsmanager.core_path',null,$modx->getOption('core_path').'components/msfieldsmanager/');
require_once $corePath.'model/msfieldsmanager/msfm.class.php';
$modx->msfm = new Msfm($modx);

$modx->lexicon->load('msfieldsmanager:default');

/* handle request */
$path = $modx->getOption('processorsPath',$modx->msfm->config,$corePath.'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));
