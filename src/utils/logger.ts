import { transports, createLogger, format } from 'winston';
const { json, timestamp, combine } = format;

export const log = (message: string, metadata?: any) => {
  const logger = createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [new transports.Console()],
  });
  logger.info({ message, metadata });
};
