https://hrt.github.io/ProxyDetectJS/


# Detecting Javascript "Proxy" objects
> "It is impossible to determine whether an object is a proxy or not (transparent virtualization)." - https://exploringjs.com/es6/ch_proxies.html

Detecting altered prototypes is useful for when you don't want 3rd party scripts from messing with your page. This repo explores methods of detecting if a method has been tampered with.



---



`index.html` is a standalone page with embeded javascript that will check if `Array.prototype.join` has been tampered with. It includes explanations.

You can view `index.html` on your browser here https://hrt.github.io/ProxyDetectJS/

I've included two tampermonkey content script that tampers with `Array.prototype.join`.


With the detected content script loaded that performs a simple Proxy, opening the above page results in:

![](https://i.imgur.com/wzvUtgM.png)


Included a content script `undetected_proxy.userscript.js` which shows that even these methods used to detect proxy objects can be concealed by altering stack traces :

![](https://i.imgur.com/9oXL6EV.png)
