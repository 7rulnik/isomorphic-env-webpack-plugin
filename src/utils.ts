function getEnv(environment: 'client' | 'server') {
	const obj: { [key: string]: string | undefined } = {}

	const prefixConfig = {
		client: 'C_',
		server: 'S_',
		clientServer: 'CS_',
		serverClient: 'SC_',
	}

	const prefixForEnvironemt = prefixConfig[environment]

	for (const [key, value] of Object.entries(process.env)) {
		let prefix: string = ''
		if (key.startsWith(prefixForEnvironemt)) {
			prefix = prefixForEnvironemt
		} else if (key.startsWith(prefixConfig.clientServer)) {
			prefix = prefixConfig.clientServer
		} else if (key.startsWith(prefixConfig.serverClient)) {
			prefix = prefixConfig.serverClient
		}

		if (prefix) {
			const correctKey = key.slice(prefix.length)
			obj[correctKey] = value
		}
	}

	return obj
}

export function getClientEnvs() {
	return getEnv('client')
}

export function getServerEnvs() {
	return getEnv('server')
}

const defaultGlobalVariable = '__ISOMORPHIC_ENV__'

export function getGlobalVariable(variableName?: string) {
	return `self.${variableName || defaultGlobalVariable}`
}

export function getScriptTag(variableName?: string) {
	return `<script>${getGlobalVariable(variableName)} = ${JSON.stringify(
		getClientEnvs(),
		null,
		'  '
	)}</script>`
}
