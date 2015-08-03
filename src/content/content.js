import $ from 'jquery';

(function(){
	let runtime = chrome.runtime;

	function alertVideoStatusChange(port){
		if(!port) throw new SyntaxError('Need a valid port');
		return function videoStatusChange(event){
			console.log('i have been triggered', event);
			return port.postMessage({
				type : event.type,
				time : event.currentTarget.currentTime
			});
		};
	}

	class TabWatcher {
		constructor(){
			this._selector = null;
			this.port = null;
		}
		get selector(){
			return $(this._selector).find('video');
		}
		set selector(selector) {
			this._selector = selector;
		}
		//checks to see if there is media player on the page
		haveMediaPlayer(){
			return this.selector.length;
		}
		mediaIsPlaying(){
			return this.selector;
		}
		attachListeners(){
			var self = this;
			if(this.selector){
				console.log('in selector', this.selector);
				this.selector.on('playing', alertVideoStatusChange(self.port));
				this.selector.on('pause', alertVideoStatusChange(self.port));
				//this doesnt work
				this.selector.get(0).pause();
				this.selector.get(0).play();
			}
		}
		//If there is a media initiate a connection
		observeMediaPlayer(){
			if(this.haveMediaPlayer()) {
				this.port = runtime.connect();
			} else if(this.port) {
				this.port.disconnect();
				this.port = null;
			}
		}
		init(){
			let self = this;
			runtime.sendMessage({status : 'complete'}, (response) => {
				console.log('this is the response', response);
				if(response && response.selector){
					self.selector = response.selector;
					self.observeMediaPlayer();
					self.attachListeners();
				}
				return self;
			});
		}

	}
	return new TabWatcher().init();

})();

console.log('this is this', this);