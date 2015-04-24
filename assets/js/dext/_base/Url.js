define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/io-query'], function(declare, lang, ioQuery) {

    var ore = new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$"),
        ire = new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$");

    /**
     * With code from dojo/url
     */
    var _Url = declare(null, {
        constructor: function (url) {
            var n = null,
                _a = arguments,
                uri = [_a[0]];
            // resolve uri components relative to each other
            for(var i = 1; i<_a.length; i++){
                if(!_a[i]){ continue; }

                // Safari doesn't support this.constructor so we have to be explicit
                // FIXME: Tracked (and fixed) in Webkit bug 3537.
                //		http://bugs.webkit.org/show_bug.cgi?id=3537
                var relobj = new _Url(_a[i]+""),
                    uriobj = new _Url(uri[0]+"");

                if(
                    relobj.path == "" &&
                    !relobj.scheme &&
                    !relobj.authority &&
                    !relobj.query
                ){
                    if(relobj.fragment != n){
                        uriobj.fragment = relobj.fragment;
                    }
                    relobj = uriobj;
                }else if(!relobj.scheme){
                    relobj.scheme = uriobj.scheme;

                    if(!relobj.authority){
                        relobj.authority = uriobj.authority;

                        if(relobj.path.charAt(0) != "/"){
                            var path = uriobj.path.substring(0,
                                    uriobj.path.lastIndexOf("/") + 1) + relobj.path;

                            var segs = path.split("/");
                            for(var j = 0; j < segs.length; j++){
                                if(segs[j] == "."){
                                    // flatten "./" references
                                    if(j == segs.length - 1){
                                        segs[j] = "";
                                    }else{
                                        segs.splice(j, 1);
                                        j--;
                                    }
                                }else if(j > 0 && !(j == 1 && segs[0] == "") &&
                                    segs[j] == ".." && segs[j-1] != ".."){
                                    // flatten "../" references
                                    if(j == (segs.length - 1)){
                                        segs.splice(j, 1);
                                        segs[j - 1] = "";
                                    }else{
                                        segs.splice(j - 1, 2);
                                        j -= 2;
                                    }
                                }
                            }
                            relobj.path = segs.join("/");
                        }
                    }
                }

                uri = this._assemble(relobj);
            }

            this.uri = uri.join("");

            // break the uri into its main components
            var r = this.uri.match(ore);

            this.scheme = r[2] || (r[1] ? "" : n);
            this.authority = r[4] || (r[3] ? "" : n);
            this.path = r[5]; // can never be undefined
            this.query = r[7] || (r[6] ? "" : n);
            this.fragment	 = r[9] || (r[8] ? "" : n);

            if(this.authority != n){
                // server based naming authority
                r = this.authority.match(ire);

                this.user = r[3] || n;
                this.password = r[4] || n;
                this.host = r[6] || r[7]; // ipv6 || ipv4
                this.port = r[9] || n;
            }
        },

        /**
         * Assembles the URI into an array of parts.
         * Call .join(""); to connect the parts.
         *
         * @param {_Url} relobj
         * @return {Array}
         * @private
         */
        _assemble: function (relobj) {
            var uri = [];

            if(relobj.scheme){
                uri.push(relobj.scheme, ":");
            }
            if(relobj.authority){
                uri.push("//", relobj.authority);
            }
            uri.push(relobj.path);
            if(relobj.query){
                uri.push("?", relobj.query);
            }
            if(relobj.fragment){
                uri.push("#", relobj.fragment);
            }

            return uri;
        },

        /**
         * Rebuilds the URI.
         *
         * @return {String}
         * @private
         */
        _rebuild: function () {
            return this.uri = this._assemble(this).join('');
        },

        /**
         * Return an object containing the query paramters.
         *
         * @return {*}
         */
        getQueryParams: function () {
            return (this.query)?
                ioQuery.queryToObject(this.query) :
                {};
        },

        /**
         * Sets the query parameters
         * @param params
         */
        setQueryParams: function (params) {
            this.query = ioQuery.objectToQuery(params);
            this._rebuild();
        },

        toString: function () {
            return this._rebuild();
        }
    });

    _Url.fromLocation = function () {
        return new _Url(document.location.href);
    };

    return _Url;
});