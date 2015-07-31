import React from 'react';

class App extends React.Component {
	constructor(){
		super();
		this.state = {
			data : 'Hello React'
		};
	}
	componentDidMount(){
		var self = this;
		chrome.storage.sync.get(function(data){
			self.setState(data);
		});
	}
	componentWillMount() {
		let self = this;
		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
			console.log('hear the update');
			chrome.storage.sync.set({data: JSON.stringify(changeInfo)}, function(){
				console.log('just saved the changes');
			});
		});
		chrome.storage.onChanged.addListener(function(changes, areaName){
			console.log('i hear the change', changes, areaName);
			self.setState({data : changes});
		});
	}
	render() {
		return (
			<pre>
				{this.state.data}
			</pre>
		);
	}
}

export default App;