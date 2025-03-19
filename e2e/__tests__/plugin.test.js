const { expect, test } = require('@jest/globals')
const path = require('path')
const { promisify } = require('util')
const { rimraf } = require('rimraf')
const webpack5 = promisify(require('webpack'))
const { readFile } = require('fs/promises')

beforeAll(() => rimraf(`${__dirname}/dist`))

describe.each([
	['webpack-5', webpack5],
])('%s', (webpackVersion, webpack) => {
	async function build(plugins, filename) {
		const webpackConfig = {
			context: __dirname,
			entry: path.resolve(__dirname, '..', 'main.js'),
			output: {
				path: path.resolve(__dirname, 'dist', webpackVersion),
				filename,
			},
			optimization: {
				minimize: false,
			},
			mode: 'production',
			devtool: false,
			plugins,
		}

		return webpack(webpackConfig)
	}

	async function checkBundleEquality(filename) {
		const [actual, expected] = await Promise.all([
			readFile(`${__dirname}/dist/${webpackVersion}/${filename}`, 'utf8'),
			readFile(`${__dirname}/fixtures/${webpackVersion}/${filename}`, 'utf8'),
		])
		expect(actual).toEqual(expected)
	}

	jest.resetModules()
	jest.doMock('webpack', () => {
		if (webpackVersion === 'webpack-5') return webpack5
	})

	const { IsomorphicEnvWebpackPlugin } = require('../../src/plugin.ts')

	test('default config works', async () => {
		await build([new IsomorphicEnvWebpackPlugin()], 'default.js')
		await checkBundleEquality('default.js')
	})

	test('variableName option works', async () => {
		await build(
			[new IsomorphicEnvWebpackPlugin({ variableName: '__SOME_VARIABLE__' })],
			'variable-name.js',
		)
		await checkBundleEquality('variable-name.js')
	})

	test("validate plugin's options", async () => {
		expect.assertions(2)

		try {
			build(
				[new IsomorphicEnvWebpackPlugin({ wrongParameter: true })],
				'validation-error.js',
			)
		} catch (err) {
			expect(err.name).toBe('ValidationError')
			expect(err.message).toBe(
				`Invalid configuration object. IsomorphicEnvWebpackPlugin has been initialized using a configuration object that does not match the API schema.
 - configuration has an unknown property 'wrongParameter'. These properties are valid:
   object { variableName? }`,
			)
		}
	})

	test('DefinePlugin before plugin works', async () => {
		await build(
			[
				new webpack.DefinePlugin({
					'process.env.FOO': JSON.stringify(
						'process.env.FOO before isomorphic plugin',
					),
				}),
				new IsomorphicEnvWebpackPlugin(),
			],
			'define-plugin-before.js',
		)
		await checkBundleEquality('define-plugin-before.js')
	})

	test('webpack has error if DefinePlugin used after plugin', async () => {
		const stats = await build(
			[
				new IsomorphicEnvWebpackPlugin(),
				new webpack.DefinePlugin({
					'process.env.FOO': JSON.stringify('Replaced FOO by DefinePlugin'),
				}),
			],
			'error-define-plugin-after.js',
		)

		expect(stats.hasErrors()).toBeTruthy()
		expect(stats.compilation.errors.length).toEqual(1)

		const error = stats.compilation.errors[0]
		expect(error.name).toBe('IsomorphicEnvWebpackPlugin')
		expect(error.message).toBe(
			"IsomorphicEnvWebpackPlugin — Don't use DefinePlugin after IsomorphicEnvWebpackPlugin",
		)
	})
})
