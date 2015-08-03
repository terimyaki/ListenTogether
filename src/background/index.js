//This will be the event page that will be the meditator between content scripts and popup script. It will handle events. Using RxJs here.
import rx from 'rx';
import {parse} from 'url';

let runtime = chrome.runtime,
	tabs = chrome.tabs;

function returnHost(url){
	let host = parse(url).host;
	return host.slice(host.indexOf('.') + 1, host.lastIndexOf('.'));
}

function returnSelectorTag(host){
	console.log('this is the host', host);
	let available = {
		'youtube' : '#movie_player'
	};
	return available[host];
}

function isStatusComplete(status){
	return status === 'complete';
}

function isStatusPlaying(data){
	return data.type === 'playing';
}

function isStatusPaused(data){
	return data.type === 'pause';
}

runtime.onMessage.addListener((request, sender, sendResponse) => {
	
	let selector = returnSelectorTag(returnHost(sender.url));
	console.log('this is the request', request, sender, selector);
	if(isStatusComplete(request.status) && selector) {
		sendResponse({selector});
	}
});

tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log('this is the request from the tab updating', tabId, changeInfo, tab);
	let selector = returnSelectorTag(returnHost(tab.url));
	if(isStatusComplete(changeInfo.status) && selector){
		tabs.sendMessage(tabId, {selector});
	}
});

runtime.onConnect.addListener((port) => {
	port.onMessage.addListener((msg) => {
		if(isStatusPlaying(msg)) {
			console.log('port is playing', port);
		} else if (isStatusPaused(msg)){
			console.log('port is paused', port);
		}
	});
});