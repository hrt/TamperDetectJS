// ==UserScript==
// @name         Proxy hide solution
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    Error.prepareStackTrace = function(error, structuredStackTrace) {
        return error.stack
                          .replace(/.*Object\.apply.*\n/g, '')
                          .replace(/(.*)Proxy\.(.*)/g, '$1Function.$2')
    }

    var redirections = new WeakMap();

    const Array_join = Array.prototype.join;
    Array.prototype.join = new Proxy(Array_join, {
        apply: function(target, _this, _arguments) {
            return Array_join.apply(_this, _arguments);
    }});
    redirections.set(Array.prototype.join, Array_join);

    function fix_toString(parent, key) {
        const og = parent[key];
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
    }
    fix_toString(Function.prototype, 'toString');
    fix_toString(Date.prototype, 'toString');
    fix_toString(Date.prototype, 'toDateString');

})();
