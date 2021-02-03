import { expect, test } from '@jest/globals'

test('should set server variables into process.env', async () => {
	process.env.S_SOME_SERVER_VAR = 'SOME_SERVER_VAR'
	process.env.CS_SOME_CLIENT_SERVER_VAR = 'SOME_CLIENT_SERVER_VAR'
	process.env.SC_SOME_SERVER_CLIENT_VAR = 'SOME_SERVER_CLIENT_VAR'

	await import('../runtime')

	expect(process.env).toMatchObject({
		S_SOME_SERVER_VAR: 'SOME_SERVER_VAR',
		CS_SOME_CLIENT_SERVER_VAR: 'SOME_CLIENT_SERVER_VAR',
		SC_SOME_SERVER_CLIENT_VAR: 'SOME_SERVER_CLIENT_VAR',
		SOME_SERVER_VAR: 'SOME_SERVER_VAR',
		SOME_CLIENT_SERVER_VAR: 'SOME_CLIENT_SERVER_VAR',
		SOME_SERVER_CLIENT_VAR: 'SOME_SERVER_CLIENT_VAR',
	})
})
