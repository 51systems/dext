<?php

namespace Dext;

use Zend\Mvc\MvcEvent;

/**
 *
 */
class Module
{
    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function onBootstrap(MvcEvent $e)
    {
        $serviceManager = $e->getApplication()->getServiceManager();

        /** @var $as \AsseticBundle\Service */
        $as = $serviceManager->get('AsseticService');

        //Register the dext javascript files with assetic
        $assetManager = $as->getAssetManager();

        $this->_registerDextAssets($assetManager);

        /** @var $view Zend\View\RendererInterface */
        $view = $serviceManager->get('viewmanager')->getRenderer();

        /**
         * @var $dojo \Dojo\View\Helper\Configuration
         * Note that this is actually a \Dojo\View\Helper\Dojo object that we proxy to configuration.
         */
        $dojo = $view->plugin('dojo');
        $baseUrl = rtrim($as->getConfiguration()->getBaseUrl(), '/');

        $dojo->registerPackagePath('dext', $baseUrl . '/js/dext');
    }

    /**
     * Registers all files in the asset directory with assetic.
     *
     * @param \Assetic\AssetManager $am
     */
    private function _registerDextAssets(\Assetic\AssetManager $am)
    {
        $rootDir = __DIR__ . DIRECTORY_SEPARATOR . 'assets';

        AsseticHelper::registerDir($am, $rootDir);
    }
}