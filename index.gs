const CONFIG = {
  SEARCH_QUERY: "is:unread from:(*@txt.voice.google.com)",
  AUTO_REPLY_MESSAGE: "Hey, I received your message and may reply to you later.",
  REPLY_INTERVAL_HOURS: 24,
  REPLY_HISTORY_SHEET_ID: "SMS Auto Reply History",
}

function main() {
  const log = new Logger("Main")
  try {
    log.info("Starting execution")
    const unreadThreads = getUnreadThreads(log)
    log.info("Found", unreadThreads.length, "unread threads")

    if (!unreadThreads || unreadThreads.length === 0) {
      log.info("No threads to process")
      return
    }

    processThreads(unreadThreads, log)
  } catch (error) {
    log.error("Execution failed:", error)
  }
}

function getUnreadThreads(parentLog) {
  const log = parentLog.child("GetUnreadThreads")
  const threads = GmailApp.search(CONFIG.SEARCH_QUERY)
  return threads
}

function processThreads(threads, parentLog) {
  const log = parentLog.child("ProcessThreads")
  log.info("Starting to process", threads.length, "threads")
  const db = new SheetDB()
  const now = new Date()

  threads.forEach((thread, index) => {
    try {
      log.info(`Processing thread ${index + 1}/${threads.length}`)
      processThread(thread, db, now, log)
    } catch (error) {
      log.error("Error processing thread:", error)
    }
  })
}

function processThread(thread, db, now, parentLog) {
  const log = parentLog.child("ProcessThread")
  thread.markRead()

  const phone = extractPhoneNumber(thread)
  log.info("Extracted phone number:", phone)
  if (!phone) {
    log.info("No valid phone number found")
    return
  }

  if (hasContact(phone, log)) {
    log.info("Contact found for phone number, skipping")
    return
  }

  if (!canSendReply(phone, db, now, log)) {
    log.info("Can't send reply due to time interval restriction")
    return
  }
  sendReply(thread, phone, db, now, log)
}

function hasContact(phone, parentLog) {
  const log = parentLog.child("HasContact")
  try {
    const response = People.People.searchContacts({
      query: phone,
      readMask: "phoneNumbers",
    })
    log.info("Contacts found:", response.results?.length || 0)
    return response.results?.length > 0
  } catch (error) {
    log.error("Error searching contacts:", error)
    return false
  }
}

function canSendReply(phone, db, now, parentLog) {
  const log = parentLog.child("CanSendReply")
  const lastReplyTime = db.getProperty(phone)
  log.info("Last reply time:", lastReplyTime ? new Date(lastReplyTime).toLocaleString() : "never")
  if (!lastReplyTime) return true

  const lastReply = new Date(lastReplyTime)
  const durationMs = now.getTime() - lastReply.getTime()
  log.info("Time since last reply:", formatDuration(durationMs))

  return durationMs >= CONFIG.REPLY_INTERVAL_HOURS * 60 * 60 * 1000
}

function sendReply(thread, phone, db, now, parentLog) {
  const log = parentLog.child("SendReply")
  try {
    thread.reply(CONFIG.AUTO_REPLY_MESSAGE)
    db.setProperty(phone, formatDate(now))
    log.info("Replied to:", phone, "at:", formatDate(now))
  } catch (error) {
    log.error("Error sending reply to", phone, ":", error)
  }
}
