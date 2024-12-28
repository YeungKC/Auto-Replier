class Logger {
  constructor(scope, parent = null) {
    this.scope = scope
    this.parent = parent
    this.path = parent ? `${parent.path}[${scope}]` : `[${scope}]`
  }

  child(scope) {
    return new Logger(scope, this)
  }

  info(...args) {
    console.log(`${this.path}`, ...args)
  }

  error(...args) {
    console.error(`${this.path}`, ...args)
  }
}

function extractPhoneNumber(thread) {
  try {
    const message = thread.getMessages()[0]
    const from = message.getFrom()
    const numbers = from.match(/(?<=")(?:[^"]*)(?<!")/)
    return numbers?.length > 0 ? numbers[0] : null
  } catch (error) {
    return null
  }
}

function formatDate(date) {
  return date.toLocaleString("zh-HK", { timeZone: "Asia/Hong_Kong" })
}

function formatDuration(durationMs) {
  const hours = Math.floor(durationMs / (60 * 60 * 1000))
  const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000))

  if (hours === 0) {
    return `${minutes}m`
  }

  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`
}
