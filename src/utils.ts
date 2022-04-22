import stringify from 'fast-json-stable-stringify';

type Opts = {filter?: (key: string, value?: string) => boolean}

function getEnv(environment: 'client' | 'server', opts?: Opts) {
	const filter = opts?.filter ?? (() => true)

	const obj: { [key: string]: string | undefined } = {}

	const prefixConfig = {
		client: 'C_',
		server: 'S_',
		clientServer: 'CS_',
		serverClient: 'SC_',
	}

	const prefixForEnvironemt = prefixConfig[environment]

	for (const [key, value] of Object.entries(process.env)) {
		if (!filter(key, value)) {
			continue
		}
		
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

export function getClientEnvs(opts?: Opts) {
	return getEnv('client', opts)
}

export function getServerEnvs(opts?: Opts) {
	return getEnv('server', opts)
}

const defaultGlobalVariable = '__ISOMORPHIC_ENV__'

export function getGlobalVariable(variableName?: string) {
	return `self.${variableName || defaultGlobalVariable}`
}

export function getScriptContent(variableName?: string, opts?: Opts) {
	return `${getGlobalVariable(variableName)} = ${stringify(getClientEnvs(opts))}`
}

export function getScriptTag(variableName?: string, opts?: Opts) {
	return `<script>${getScriptContent(variableName, opts)}</script>`
}
