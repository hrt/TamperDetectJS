// ==UserScript==
// @name         Simple Proxy
// @include      *
// @run-at       document-start
// ==/UserScript==
// for this to run on local html files, allow tamper monkey to access local files
(function() {
	'use strict';
	Array.prototype.join = new Proxy(Array.prototype.join, {
		apply: function(target, _this, _arguments) {
			return target.apply(_this, _arguments);
	}});
	console.warn('loaded JoinHook');
})();
