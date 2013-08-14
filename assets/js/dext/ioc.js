/**
 * Loader plugin that allows easy access to the Dependency Injection registry.
 *
 * Sometimes, it can be useful to defer the return of the plugin until certain events fire
 * (for example, if we are registering widgets with the ioc container).
 *
 * To support this, the plugin will wait until a promise is resolved before returning.
 * To set the promise set:
 * dojoConfig.deferIOC = true
 *
 * and then require ioc/deferred to get the deferred to fufill the promise on.
 *
 */
define([
    "dojo/_base/config",
    "./ioc/deferred",
    "./ioc/registry"
], function(config, deferred, registry) {
    return {
        load: function(id, require, callback) {
            deferred.then( function () {
                console.log("Resolving IOC Call:" + id);
                callback(registry.get(id))
            });
        }
    };
});