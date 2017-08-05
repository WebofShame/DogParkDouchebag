import path from 'path';
import webpack from 'webpack'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

export default {
	devtool: '#source-map',
	entry: [
		path.resolve(__dirname, 'src/bootstrap/bootstrap.less')
	],
	target: 'web',
	output: {
		path: path.resolve(__dirname, 'src'),
		publicPath: '/',
		filename: 'bundle.js'
	},
	plugins: [
		new ExtractTextPlugin('assets/css/custom-bootstrap.css')//,
		//new webpack.optimize.DedupePlugin(),
		// new webpack.optimize.UglifyJsPlugin({
		// 	sourceMap: true
		// })
	],
	module: {
		rules: [
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: [{
							loader: 'css-loader',
							options: {
								//minimize: true,
								sourceMap: true
							}
						},
						{
							loader: 'less-loader',
							options: {
								sourceMap: true
							}
						}
					]
				})
			}
		]
	}
}
