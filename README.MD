https://hrt.github.io/ProxyDetectJS/


# Detecting Javascript "Proxy" objects
> "It is impossible to determine whether an object is a proxy or not (transparent virtualization)." - https://exploringjs.com/es6/ch_proxies.html

This repo explores methods of detecting if a method has been tampered with through the use of a proxy.

Use case: Detecting altered prototypes is useful for when you don't want 3rd party scripts from messing with your page.



---




`proxy.userscript.js` is a tampermonkey content script that replaces `Array.prototype.join` with a proxy on all pages


`index.html` is a standalone html page that will check if `Array.prototype.join` has been tampered with. It includes explanations.

You can view `index.html` on your browser here https://hrt.github.io/ProxyDetectJS/


With the content script loaded, opening the above page results in:

![](https://i.imgur.com/US3fs0v.png)

