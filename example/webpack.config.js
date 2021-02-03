const { IsomorphicEnvWebpackPlugin } = require('../dist/plugin')

module.exports = {
	context: __dirname,
	mode: 'development',
	entry: './app.js',
	output: {
		path: __dirname,
		filename: `bundle.js`,
	},
	devtool: false,
	plugins: [new IsomorphicEnvWebpackPlugin()],
}
