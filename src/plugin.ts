import { DefinePlugin, WebpackError } from 'webpack'
import type { Compiler } from 'webpack'
import { validate } from 'schema-utils'

import { getGlobalVariable } from './utils'
import schema from './schema.json'

type Options = {
	variableName?: string
}

const pluginName = 'IsomorphicEnvWebpackPlugin'

export class IsomorphicEnvWebpackPlugin {
	defeninions: {
		'process.env': string
	}

	constructor(options: Options = {}) {
		// @ts-expect-error
		validate(schema, options, {
			name: pluginName,
		})

		const defeninions = {
			'process.env': getGlobalVariable(options.variableName),
		}

		this.defeninions = defeninions
	}

	apply(compiler: Compiler) {
		const { plugins } = compiler.options
		const index = plugins.findIndex(
			(plugin) => plugin instanceof IsomorphicEnvWebpackPlugin
		)
		const afterPlugin = plugins.slice(index + 1)

		const definePluginAfter = afterPlugin.some(
			(plugin) => plugin instanceof DefinePlugin
		)

		if (definePluginAfter) {
			compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
				const ErrorClass = WebpackError ?? Error
				const error = new ErrorClass(
					`${pluginName} — Don't use DefinePlugin after ${pluginName}`
				)
				error.name = pluginName
				compilation.errors.push(error)
			})
		}

		new DefinePlugin(this.defeninions).apply(compiler)
	}
}
