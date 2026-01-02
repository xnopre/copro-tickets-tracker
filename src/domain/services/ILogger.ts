export interface LogContext {
  [key: string]: unknown;
}

export interface ILogger {
  info(message: string, context?: LogContext): void;
  error(message: string, error?: Error | unknown, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
}
