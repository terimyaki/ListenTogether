import $ from 'jquery';
import {parse} from 'url';

console.log('content script loaded');
console.log('this is the movie player', $('#movie_player'), 'this is the find', $(document).find($('#movie_player')));
(function(url){
	let selector,
		port,
		runtime = chrome.runtime;

	function haveMediaPlayer(selector){
		return $(selector).length;
	}

	function observeMediaPlayer(selector){
		if(haveMediaPlayer(selector)){
			port = runtime.connect({name : 12345});

		} else {
			if(port) {
				port.disconnect();
				port = null;
			}
		}
	}

	runtime.sendMessage({status: 'connected'});
})(url);