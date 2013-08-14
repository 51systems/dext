/**
 * Deferred handling for the ioc plugin.
 * Causes the plugin to wait until a promise has been resolved before returning.
 * 
 * Allows us to ensure that the required values have been registered prior to trying to retrieve them.
 */
define([
    "dojo/_base/config",
    "dojo/_base/lang",
    "dojo/Deferred"
], function(config, lang, Deferred) {

    var deferred;

    var ioc = lang.getObject('dext.ioc', true);

    if (!ioc.deferred) {
        ioc.deferred = new Deferred();
    }

    //We aren't deferring anything, immediately resolve
    if(!config.deferIOC) {
        ioc.deferred.resolve(value);
    }

    return ioc.deferred;
});