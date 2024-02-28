const { createLogger, format, transports } = require('winston')

const logger = createLogger({
    transports: [
        new transports.Console({
            handleExceptions: true,
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.simple()
            ),
        }),
    ],
})

module.exports = {
    logger,
}
