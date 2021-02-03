import { describe, expect, test } from '@jest/globals'

import {
	getClientEnvs,
	getServerEnvs,
	getGlobalVariable,
	getScriptTag,
} from '../'

describe('getGlobalVariable', () => {
	test('should use default variable if argument not passed', () => {
		expect(getGlobalVariable()).toBe('self.__ISOMORPHIC_ENV__')
	})

	test('should use variable from arguments', () => {
		expect(getGlobalVariable('__HELLO_WORLD__')).toBe('self.__HELLO_WORLD__')
	})
})

process.env.S_VAR_FOR_SERVER = 'VAR_FOR_SERVER'
process.env.C_VAR_FOR_CLIENT = 'VAR_FOR_CLIENT'
process.env.CS_VAR_FOR_CLIENT_AND_SERVER = 'VAR_FOR_CLIENT_AND_SERVER'
process.env.SC_VAR_FOR_SERVER_AND_CLIENT = 'VAR_FOR_SERVER_AND_CLIENT'

describe('getServerEnvs', () => {
	test('should return only variables for server', () => {
		expect(getServerEnvs()).toStrictEqual({
			VAR_FOR_SERVER: 'VAR_FOR_SERVER',
			VAR_FOR_CLIENT_AND_SERVER: 'VAR_FOR_CLIENT_AND_SERVER',
			VAR_FOR_SERVER_AND_CLIENT: 'VAR_FOR_SERVER_AND_CLIENT',
		})
	})
})

describe('getClientEnvs', () => {
	test('should return only variables for client', () => {
		expect(getClientEnvs()).toStrictEqual({
			VAR_FOR_CLIENT: 'VAR_FOR_CLIENT',
			VAR_FOR_CLIENT_AND_SERVER: 'VAR_FOR_CLIENT_AND_SERVER',
			VAR_FOR_SERVER_AND_CLIENT: 'VAR_FOR_SERVER_AND_CLIENT',
		})
	})
})

describe('getScriptTag', () => {
	test('should use default variable if argument not passed', () => {
		const result = getScriptTag()
		expect(result).toMatchSnapshot()
		expect(result).not.toMatch(/\"VAR_FOR_SERVER\"/)
	})

	test('should use variable from arguments', () => {
		const result = getScriptTag('__HELLO_WORLD__')
		expect(result).toMatchSnapshot()
		expect(result).not.toMatch(/\"VAR_FOR_SERVER\"/)
	})
})
