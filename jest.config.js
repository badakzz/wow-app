module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@prisma/client$": "<rootDir>/__mocks__/@prisma/client/index.ts",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "mjs"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
}
