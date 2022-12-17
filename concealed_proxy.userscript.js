// ==UserScript==
// @name         Proxy hide solution
// @match        https://hrt.github.io/TamperDetectJS/
// @run-at       document-start
// ==/UserScript==

// Remember to set TamperMonkeys inject mode to "instant"

(function() {
    Error.prepareStackTrace = function(error, structuredStackTrace) {
        return error.stack.replace(/.*Object\.apply.*\n/g, '')
                          .replace(/(.*)Proxy\.(.*)/g, '$1Function.$2')
                          .replace(/(.*)Object\.(.*)/g, '$1Function.$2');
    };
    var proxyToOriginal = new WeakMap();
    proxyToOriginal.get = WeakMap.prototype.get; // Avoid detection via tampering of WeakMap.prototype.get
    const apply = Reflect.apply;                 // Avoid detection via tampering of Function.prototype.apply / Reflect.apply
    function hook(parent, key, restoreOriginals) {
        try {
            const original = parent[key];
            if (proxyToOriginal.get(original)) {
                return; // we're already a proxy
            }
            parent[key] = new Proxy(original, {
                apply: function(target, that, args) {
                    if (restoreOriginals) {
                        var newArgs = [];
                        that = proxyToOriginal.get(that) || that;
                        for (var i = 0; args && i < args.length; i++) {
                            newArgs[i] = proxyToOriginal.get(args[i]) || args[i];
                        }
                        args = newArgs;
                    }
                    try {
                        return apply(original, that, args);
                    } catch (e) {
                        throw e
                    }
                }
            })
            proxyToOriginal.set(parent[key], original);
        } catch(e) {}
    };
    var descriptors = Object.getOwnPropertyDescriptors(window);
    for (var key in descriptors) {
        try {
            var prototype = window[key].prototype;
            // Hook all prototype functions that can be applied to Array.prototype.join that can check if tampered
            hook(prototype, 'concat');
            hook(prototype, 'push');
            hook(prototype, 'join');
            hook(prototype, 'sort');
            hook(prototype, 'slice');
            hook(prototype, 'shift');
            hook(prototype, 'unshift');
            hook(prototype, 'splice');
            // toString functions should always attempt to replace proxied "this" to original
            hook(prototype, 'toString', true);
            hook(prototype, 'toLocaleString', true);
            hook(prototype, 'toDateString', true);
            hook(prototype, 'toLocaleDateString', true);
            hook(prototype, 'toLocaleTimeString', true);
        } catch(e) {}
    }
    // todo: Can be detected by checking if "Error.prepareStackTrace" is defined or by overwriting it

    // todo: Can be detected by checking error message of "ArrayBuffer.prototype in 0".
    //       The resulting string representation of "ArrayBuffer.prototype" behaves weird when "Object.prototype.toString" is truly non-native.
})();
