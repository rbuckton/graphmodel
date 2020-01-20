Error.stackTraceLimit = 500;
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ["jest-extended"],
    transform: {
        "^.+\\.tsx?": "ts-jest",
    },
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
            compiler: require.resolve('typescript')
        },
    }
};