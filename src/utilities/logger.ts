import { transports, createLogger, format } from 'winston';
const { json, timestamp, combine } = format;

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [new transports.Console()],
});
