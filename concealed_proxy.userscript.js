// ==UserScript==
// @name         Proxy hide solution
// @match        https://hrt.github.io/TamperDetectJS/
// @run-at       document-start
// ==/UserScript==

(function() {
    Error.prepareStackTrace = function(error, structuredStackTrace) {
        return error.stack.replace(/.*Object\.apply.*\n/g, '')
                          .replace(/(.*)Proxy\.(.*)/g, '$1Function.$2')
                          .replace(/(.*)Object\.(.*)/g, '$1Function.$2');
    };
    var proxy_to_og = new WeakMap();
    function hook(parent, key, replace) {
        // replace is optional, if true then proxied this/arguments will be replaced with original
        try {
            const og = parent[key];
            if (proxy_to_og.get(og)) {
                return; // we're already a proxy
            }
            parent[key] = new Proxy(og, {
                apply: function(target, that, args) {
                    if (replace) {
                        var new_args = [];
                        that = proxy_to_og.get(that) || that;
                        for (var i = 0; args && i < args.length; i++) {
                            new_args[i] = proxy_to_og.get(args[i]) || args[i];
                        }
                        args = new_args;
                    }
                    try {
                        return og.apply(that, args);
                    } catch (e) {
                        if (!replace) {
                            var new_args = [];
                            that = proxy_to_og.get(that) || that;
                            for (var i = 0; args && i < args.length; i++) {
                                new_args[i] = proxy_to_og.get(args[i]) || args[i];
                            }
                            args = new_args;
                            return og.apply(that, args);
                        } else {
                            throw e;
                        }
                    }
                }
            })
            proxy_to_og.set(parent[key], og);
        } catch(e) {}
    };
    var descriptors = Object.getOwnPropertyDescriptors(window);
    for (var key in descriptors) {
        try {
            var prototype = window[key].prototype;
            // find these with the some code
            hook(prototype, 'concat');
            hook(prototype, 'push');
            hook(prototype, 'join');
            hook(prototype, 'sort');
            hook(prototype, 'slice');
            hook(prototype, 'shift');
            hook(prototype, 'unshift');
            hook(prototype, 'splice');
            hook(prototype, 'toString', true);
            hook(prototype, 'toLocaleString', true);
            hook(prototype, 'toDateString', true);
            hook(prototype, 'toLocaleDateString', true);
            hook(prototype, 'toLocaleTimeString', true);
        } catch(e) {}
    }

})();
