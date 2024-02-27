const { createLogger, format, transports } = require('winston')

const isDevelopment = process.env.NODE_ENV !== 'production'

// Custom formatting for development
const devFormat = format.printf(
    ({ level, message, timestamp, pid, hostname }) => {
        const time = new Date(timestamp).toLocaleTimeString()
        return `${time} [${pid}@${hostname}] ${level}: ${message}`
    }
)

const logger = createLogger({
    transports: [
        new transports.Console({
            handleExceptions: true,
            format: isDevelopment
                ? format.combine(
                      format.colorize(),
                      format.timestamp(),
                      devFormat // Use custom format in development
                  )
                : format.combine(format.timestamp(), format.json()),
        }),
    ],
})

module.exports = {
    logger,
}
