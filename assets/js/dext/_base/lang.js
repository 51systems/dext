
define(["dojo/_base/lang"], function(lang){

    // Module export
    var dextLang = {
        // summary:
        //		This module defines Javascript language extensions.

        /**
         * This works essentially the same as dojo.mixin, except the prototypes from both functions are preserved
         *
         * @param {Object} obj The original object
         * @param {Object} prop The object to mixin
         * @return {Object}
         */
        mixinPrototype: function(obj, prop){
            var prototype = lang.mixin(obj.prototype, prop.prototype);
            var newObject = lang.mixin(obj, prop);
            newObject.prototype = prototype;
            return newObject;
        },

        /**
         * Checks if a variable isSet (same behaviour as php).
         * Returns true if the passed variables are defined and not null.
         * @return {Boolean}
         */
        isset: function () {
            // http://kevin.vanzonneveld.net
            // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   improved by: FremyCompany
            // +   improved by: Onno Marsman
            // +   improved by: Rafał Kukawski
            // *     example 1: isset( undefined, true);
            // *     returns 1: false
            // *     example 2: isset( 'Kevin van Zonneveld' );
            // *     returns 2: true
            var a = arguments,
                l = a.length,
                i = 0,
                undef;

            if (l === 0) {
                throw new Error('Empty isset');
            }

            while (i !== l) {
                if (a[i] === undef || a[i] === null) {
                    return false;
                }
                i++;
            }
            return true;
        },

        /**
         * Iterates over objects in the same way dojo.forEach iterates over arrays
         *
         * @param {Object} obj The object to iterate over
         * @param {Function} callback a function is invoked with three arguments: item, index, and object
         */
        forEachProperty: function(obj, callback)
        {
            if(!lang.isObject(obj)){
                throw new Error('Passed obj is not an object');
            }

            for(var i in obj){
                callback.call(null, obj[i], i, obj);
            }
        }

    };

    return dextLang;
});