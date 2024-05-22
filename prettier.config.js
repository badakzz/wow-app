module.exports = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    singleQuote: false,
    overrides: [
        {
            files: '*.scss',
            options: {
                semi: true,
            },
        },
        {
            files: ['*.yml', '*.yaml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
}
