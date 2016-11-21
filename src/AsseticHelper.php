<?php

namespace Dext;

use Assetic\AssetManager;
use Assetic\Asset\FileAsset;

/**
 * Helper method to have Assetic copy all files in a directory (and subdirectories) to the target directory.
 */
class AsseticHelper
{
    /**
     * Adds all files found in the directory to Assetic.
     *
     * @param \Assetic\AssetManager $assetManager
     * @param string $directory
     */
    public static function registerDir(AssetManager $assetManager, $directory)
    {
        $directoryIterator = new \RecursiveDirectoryIterator($directory);

        $assets = new \Assetic\Asset\AssetCollection();

        /** @var $element \SplFileInfo */
        foreach(new \RecursiveIteratorIterator($directoryIterator) as $filename => $element) {
            if(!$element->isFile())
                continue;

            $asset = new FileAsset($filename, array(), str_replace($filename, "", $directory));
            $asset->setTargetPath($asset->getSourcePath());

            $assetManager->set(md5($asset->getSourceRoot().$asset->getSourcePath()), $asset);
        }
    }
}
