// ==UserScript==
// @name         Proxy hide solution
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       https://hrt.github.io/TamperDetectJS/
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    Error.prepareStackTrace = function(error, structuredStackTrace) {
        return error.stack
                          .replace(/.*Object\.apply.*\n/g, '')
                          .replace(/(.*)Proxy\.(.*)/g, '$1Function.$2')
    };

    var redirections = new WeakMap();

    const Array_join = Array.prototype.join;
    Array.prototype.join = new Proxy(Array_join, {
        apply: function(target, _this, _arguments) {
            return Array_join.apply(_this, _arguments);
    }});
    redirections.set(Array.prototype.join, Array_join);

    function conceal(parent, key) {
        try {
            const og = parent[key];
            if (redirections.get(parent[key])) {
                // parent[key] is already a proxy
                return;
            }
            parent[key] = new Proxy(og, {
                apply: function(target, _this, _arguments) {
                    var original_fn = redirections.get(_this);
                    if (original_fn) {
                        _this = original_fn;
                    }
                    return og.apply(_this, _arguments);
                }
            })
            redirections.set(parent[key], og);
        } catch(e) {

        }
    };
    var descriptors = Object.getOwnPropertyDescriptors(window);
    for (var key in descriptors) {
        try {
            conceal(window[key].prototype, 'sort'); // not viable to find each case
            conceal(window[key].prototype, 'slice');
            conceal(window[key].prototype, 'toString');
            conceal(window[key].prototype, 'toLocaleString');
            conceal(window[key].prototype, 'toDateString');
            conceal(window[key].prototype, 'toLocaleDateString');
            conceal(window[key].prototype, 'toLocaleTimeString');
        } catch(e) {

        }
    }

})();
