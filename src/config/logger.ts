import { createLogger, transports, format, Logger } from "winston";

const logger: Logger = createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: format.combine(format.colorize(), format.simple()),
    transports: [new transports.Console()],
});

export default logger;
