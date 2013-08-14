define([
    'dojo/_base/lang'
], function (lang) {

    /**
     * Factories that are used to return instances of an object.
     * @type {{function}}
     */
    var factories = {};

    /**
     * Stores objects that have a singleton scope.
     * @type {{object}}
     */
    var singletons = {};

    return {

        /**
         * Registers the object definition with the dependency injection framework.
         *
         * Object Scopes:
         *  singleton - The same instance is returned every time
         *  prototype - A new instance is returned every time.
         *
         * @param {string} id     Id that identifies the object
         * @param def     Object / Class definition
         * @param {string} scope  One of singleton or prototype
         */
        register: function (id, def, scope) {
            if(factories[id]){
                throw new Error("id==" + widget.id + " is already registered");
            }

            var factory;

            switch (scope) {
                case 'singleton':

                    singletons[id] = def;

                    factory = function() {
                        return singletons[id];
                    };

                break;

                case 'prototype':
                    throw new Error("prototype scope not implemented");
                break;

                default:
                    throw new Error("Invalid scope specified: '" + scope + "'");
                break;
            }

            factories[id] = factory;
        },

        /**
         * Returns an instance of the passed id
         * @param {string} id
         */
        get: function (id) {
            if (!factories[id]) {
                throw new Error("id==" + id + " not registered");
            }

            return factories[id]();
        }
    };
});