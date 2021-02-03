module.exports = {
	preset: 'ts-jest',
	testRegex: '/__tests__/.*\\.test\\.(t|j)s$',
	clearMocks: true,
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	testEnvironment: 'node',
}
