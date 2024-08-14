import { format, transports, createLogger, Logger } from 'winston';
import config from '@/config';
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const loggerConf = {
    level: config.debug ? 'debug' : 'info',
    // format: format.json(),
    format: combine(label({ label: 'litminka-api' }), timestamp(), myFormat),
    defaultMeta: { service: 'litminka-api' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/litminka-api.log' }),
        new transports.Console()
    ]
};

const logger: Logger = createLogger(loggerConf);
export { logger };
