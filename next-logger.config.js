const { createLogger, format, transports } = require('winston')

const isDevelopment = process.env.NODE_ENV !== 'production'

const logger = createLogger({
    transports: [
        new transports.Console({
            handleExceptions: true,
            format: isDevelopment
                ? format.combine(format.colorize(), format.simple())
                : format.combine(format.timestamp(), format.json()),
        }),
    ],
})

module.exports = {
    logger,
}
