/* eslint @typescript-eslint/explicit-module-boundary-types: 'off' */
import { PromService } from '@digikare/nestjs-prom'
import { LoggerService } from '@nestjs/common'
import { createLogger, Logger, LoggerOptions } from 'winston'

async function promCounter(promService: PromService, logLevel: string) {
  promService
    .getCounter({ name: 'logback_events_total', help: 'Counter for log events', labelNames: ['level'] })
    .labels(logLevel)
    .inc(1)
}

//ADD REQUEST ID
export class WinstonLogger implements LoggerService {
  private readonly logger: {
    (logLevel: string): Logger
  }
  private readonly promService: PromService
  private context?: string

  /**
   *
   * @param options
   */
  constructor(options?: LoggerOptions) {
    this.promService = new PromService()
    this.logger = (logLevel: string) => {
      promCounter(this.promService, logLevel)
      return createLogger(options)
    }
  }

  /**
   *
   * @param context
   */
  public setContext(context: string) {
    this.context = context
  }

  /**
   *
   * @param message
   * @param context
   */
  public log(message: any, context?: string): any {
    context = context || this.context
    const logLevel = 'info'
    if ('object' === typeof message) {
      const { message: msg, ...meta } = message
      return this.logger(logLevel).info(msg as string, {
        context,
        ...meta
      })
    }

    return this.logger(logLevel).info(message, {
      context
    })
  }

  /**
   *
   * @param message
   * @param trace
   * @param context
   */
  public error(message: any, trace?: string, context?: string): any {
    context = context || this.context
    const logLevel = 'error'
    if (message instanceof Error) {
      const { message: msg, stack } = message

      return this.logger(logLevel).error(msg, {
        context,
        stack: [trace || stack]
      })
    }

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message

      return this.logger(logLevel).error(msg as string, {
        context,
        stack: [trace],
        ...meta
      })
    }

    return this.logger(logLevel).error(message, {
      context,
      stack: [trace]
    })
  }

  /**
   *
   * @param message
   * @param context
   */
  public warn(message: any, context?: string): any {
    context = context || this.context
    const logLevel = 'warn'
    if ('object' === typeof message) {
      const { message: msg, ...meta } = message

      return this.logger(logLevel).warn(msg as string, {
        context,
        ...meta
      })
    }

    return this.logger(logLevel).warn(message, {
      context
    })
  }

  /**
   *
   * @param message
   * @param context
   */
  public debug?(message: any, context?: string): any {
    context = context || this.context
    const logLevel = 'debug'
    if ('object' === typeof message) {
      const { message: msg, ...meta } = message

      return this.logger(logLevel).debug(msg as string, {
        context,
        ...meta
      })
    }

    return this.logger(logLevel).debug(message, {
      context
    })
  }

  /**
   *
   * @param message
   * @param context
   */
  public verbose?(message: any, context?: string): any {
    context = context || this.context
    const logLevel = 'verbose'
    if ('object' === typeof message) {
      const { message: msg, ...meta } = message

      return this.logger(logLevel).verbose(msg as string, {
        context,
        ...meta
      })
    }

    return this.logger(logLevel).verbose(message, {
      context
    })
  }
}
