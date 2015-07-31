// ==UserScript==
// @name            BetterTTV
// @namespace       BTTV
// @description     Enhances Twitch with new features, bug fixes, and reduced clutter.
// @copyright       NightDev
// @icon            http://cdn.betterttv.net/icon.png
//
// @grant           none
//
// @include         *://*.twitch.tv/*
//
// @version         0.0.1
// ==/UserScript==

function betterttv_init()
{
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "http://etmad.github.io/betterttv.js?"+Math.random();
	var head = document.getElementsByTagName('head')[0];
	if(head) head.appendChild(script);
}

betterttv_init();
