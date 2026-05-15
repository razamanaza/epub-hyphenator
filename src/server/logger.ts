const BUFFER_SIZE = 500

interface LogEntry {
  ts: string
  level: 'INFO' | 'WARN' | 'ERROR'
  msg: string
}

const buffer: Array<LogEntry> = []

function fmt(args: Array<unknown>): string {
  return args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')
}

function push(level: LogEntry['level'], args: Array<unknown>) {
  buffer.push({ ts: new Date().toISOString(), level, msg: fmt(args) })
  if (buffer.length > BUFFER_SIZE) buffer.shift()
}

const _log = console.log.bind(console)
const _warn = console.warn.bind(console)
const _error = console.error.bind(console)

console.log = (...args: Array<unknown>) => {
  push('INFO', args)
  _log(...args)
}
console.warn = (...args: Array<unknown>) => {
  push('WARN', args)
  _warn(...args)
}
console.error = (...args: Array<unknown>) => {
  push('ERROR', args)
  _error(...args)
}

export function getLines(limit: number): Array<string> {
  return buffer.slice(-limit).map((e) => `[${e.ts}] [${e.level}] ${e.msg}`)
}

export function getAllLines(): Array<string> {
  return buffer.map((e) => `[${e.ts}] [${e.level}] ${e.msg}`)
}

export function getTotal(): number {
  return buffer.length
}
