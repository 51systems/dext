define(['dojo/Deferred', "dojo/_base/lang"], function(Deferred, lang) {

    var d = {

        /**
         * List of
         */
        hash: {},

        /**
         * Returns a Deferred that will resolve after the specified delay.
         * If delay is called with the same id before the deferred has resolved,
         * it will be canceled.
         *
         * @param id
         * @param delay
         * @return {Deferred}
         */
        spool: function (id, delay) {

            if (d.hash[id]) {
                clearTimeout(d.hash[id].timer);

                if (d.hash[id].deferred && !d.hash[id].deferred.isResolved()) {
                    d.hash[id].deferred.cancel('Timer Restarted');
                }
            }

            if (!d.hash[id])
                d.hash[id] = {};

            d.hash[id].timer = setTimeout(function(){
                if (d.hash[id] && d.hash[id].deferred
                    && !d.hash[id].deferred.isCanceled() && !d.hash[id].deferred.isResolved()) {
                    d.hash[id].deferred.resolve();
                }

                delete d.hash[id];
            }, delay);

            return d.hash[id].deferred = new Deferred();
        }

    };

    return d;

});