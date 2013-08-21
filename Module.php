<?php

namespace Dext;

use Zend\EventManager\EventInterface;
use Zend\ModuleManager\Feature\BootstrapListenerInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\ModuleManager\Feature\InitProviderInterface;
use Zend\ModuleManager\ModuleManager;
use Zend\ModuleManager\ModuleManagerInterface;
use Zend\Mvc\MvcEvent;

/**
 *
 */
class Module implements
    ConfigProviderInterface,
    InitProviderInterface,
    BootstrapListenerInterface
{

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    /**
     * {@inheritDoc}
     */
    public function init(ModuleManagerInterface $moduleManager)
    {
        $moduleManager->loadModule('Dojo');
    }

    /**
     * @param MvcEvent|EventInterface $e
     * @return array|void
     */
    public function onBootstrap(EventInterface $e)
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
        $baseUrl = rtrim($as->getConfiguration()->getBaseUrl() . $as->getConfiguration()->getBasePath(), '/');

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