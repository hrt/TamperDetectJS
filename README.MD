![https://hrt.github.io/TamperDetectJS/](https://i.imgur.com/wzvUtgM.png)

https://hrt.github.io/TamperDetectJS/


# Detecting alterered native functions / prototypes in Javascript
> "It is impossible to determine whether an object is a proxy or not (transparent virtualization)." - https://exploringjs.com/es6/ch_proxies.html

Detecting altered prototypes is useful for when you don't want 3rd party scripts from messing with your page - including anti cheats for certain games. This repo explores methods of detecting if a method has been tampered with as well as methods to get around such detections.

In conclusion, it's possible to determine if a proxy of a native function is a proxy. [There are many tells]( https://github.com/hrt/TamperDetectJS/blob/main/index.html#L12-L198).



---



`index.html` is a standalone page with embeded javascript that will check if `Array.prototype.join` has been tampered with.

You can view `index.html` on your browser here https://hrt.github.io/TamperDetectJS/

I've included two tampermonkey content script that tampers with `Array.prototype.join`.

One is a simple proxy that gets detected. The other attempts to conceal the proxy.
