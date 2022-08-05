/* istanbul ignore file */

import clc from 'cli-color'
import { isObject } from 'lodash'
import { format } from 'winston'

// Map of npm output levels to Stackdriver Logging levels.
const NPM_LEVEL_NAME_TO_CODE = {
  error: 3,
  warn: 4,
  info: 6,
  verbose: 7,
  debug: 7,
  silly: 7
}

// Map of Stackdriver Logging levels.
const STACK_DRIVER_LOGGING_LEVEL_CODE_TO_NAME = {
  0: 'emergency',
  1: 'alert',
  2: 'critical',
  3: 'error',
  4: 'warning',
  5: 'notice',
  6: 'info',
  7: 'debug'
}

const NEST_COLOR_SCHEME: Record<string, (text: string) => string> = {
  info: clc.green,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magenta,
  verbose: clc.cyan
}

/**
 * Add severity.
 */
export const severity = format((info, opts) => {
  const { level } = info
  const levels = info.levels || NPM_LEVEL_NAME_TO_CODE
  const levelCode = levels[level]
  const stackDriverLevel =
    STACK_DRIVER_LOGGING_LEVEL_CODE_TO_NAME[levelCode as keyof typeof STACK_DRIVER_LOGGING_LEVEL_CODE_TO_NAME] || 'info'

  return {
    ...info,
    severity: opts.upperCase ? stackDriverLevel.toUpperCase() : stackDriverLevel
  }
})

export const nestConsoleFormat = (appName = 'NestWinston') =>
  format.printf(({ context, level, timestamp, message, ms, ...meta }) => {
    const color = NEST_COLOR_SCHEME[level] || ((text: string): string => text)
    const levelMessage = color(`[${appName}] ${level.toUpperCase()}   - `)
    const timestampMessage = timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString()
    const contextMessage = context ? clc.yellow(`[${context}] `) : ''
    const outputMessage = isObject(message) ? color(JSON.stringify(message)) : color(message)
    const timestampDiff = clc.yellow(ms)
    const metaMessage = isObject(meta) ? color(JSON.stringify(meta, null, 2)) : color(meta)

    return `${levelMessage}${timestampMessage}   ${contextMessage}${outputMessage} ${timestampDiff} - ${metaMessage}`
  })
