import path from 'path';
import webpack from 'webpack';
import {merge} from 'lodash';

const config = {
	plugins: [
      new webpack.NoErrorsPlugin()
    ],
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module : {
		// preLoaders : [
		// 	{
		// 		test: /\.js$/,
		// 		loader: "eslint-loader",
		// 		exclude: /node_modules/
		// 	}
		// ],
		loaders : [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			}
			// ,{
			// 	test:/\.js$/,
			// 	exclude: /node_modules/,
			// 	loader: 'uglify'
			// }
			]
		}
};
const contentConfig = merge({}, config, {
	entry : ['./src/content/content.js'],
	output : {
		path : path.join(__dirname, 'build', 'content'),
		filename: 'content.bundle.js'
	},
	extensions: {
		'jquery': 'jquery'
	}
});

const popupConfig = merge({}, config, {
	entry : ['./src/popup/entry.js'],
	output : {
		path : path.join(__dirname, 'build', 'popup'),
		filename: 'popup.bundle.js'
	},
	module : {
		loaders : [{
				test: /\.jsx?$/,
				loaders: ['react-hot', 'babel', 'jsx?harmony'],
				exclude: /node_modules/
			},
			{
		      test: /\.scss$/,
		      loader: 'style!css!sass'
		    }]
		}
});

const backgroundConfig = merge({}, config, {
	entry : ['./src/background/index.js'],
	output : {
		path: path.join(__dirname, 'build', 'background'),
		filename : 'background.bundle.js'
	},
	extensions: {
		'rx': 'rx'
	}
});

export default {
	contentConfig,
	popupConfig,
	backgroundConfig
};