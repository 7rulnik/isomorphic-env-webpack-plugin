import { getClientEnvs, getServerEnvs } from "../utils"

describe('filtering in getServerEnvs', () => {
    beforeAll(() => {
        process.env.S_OK_VARIABLE = 'S_OK_VARIABLE'
        process.env.S_LP_VARIABLE = 'S_LP_VARIABLE'
    })

    test('filter variables by key', () => {
        const result = getServerEnvs({ filter: (key, _) => key.includes('_OK_') })

        expect(result).toStrictEqual({
			OK_VARIABLE: 'S_OK_VARIABLE'
		})
    })

    test('filter variables by value', () => {
        const result = getServerEnvs({ filter: (_, value) => value?.includes('_LP_') ?? true })

        expect(result).toStrictEqual({
			LP_VARIABLE: 'S_LP_VARIABLE'
		})
    })
})

describe('filtering in getClientEnvs', () => {
    beforeAll(() => {
        process.env.C_OK_VARIABLE = 'C_OK_VARIABLE'
        process.env.C_LP_VARIABLE = 'C_LP_VARIABLE'
    })

    test('filter variables by key', () => {
        const result = getClientEnvs({ filter: (key, _) => key.includes('_OK_') })

        expect(result).toStrictEqual({
			OK_VARIABLE: 'C_OK_VARIABLE'
		})
    })

    test('filter variables by value', () => {
        const result = getClientEnvs({ filter: (_, value) => value?.includes('_LP_') ?? true })

        expect(result).toStrictEqual({
			LP_VARIABLE: 'C_LP_VARIABLE'
		})
    })
})