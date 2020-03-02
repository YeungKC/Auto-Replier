var matchRegex = /^"([\s|\S]*)"/
var replaceRegex = /[\s|\(|\)|-]/g

function autoReplier() {
  var labelObj = GmailApp.getUserLabelByName('SMS')
  var unreadCount = labelObj.getUnreadCount()
  var threads = labelObj.getThreads()
  var thread

  for (var i = 0; i < unreadCount; i++) {
    thread = threads[i]
    if (thread.isUnread()) {
      thread.markRead()

      var phone = thread.getMessages()[0].getFrom().match(matchRegex)[1].replace(replaceRegex, '')
      var contacts = ContactsApp.getContactsByPhone(phone)
      if (contacts.length) continue

      thread.reply("Hey, I received your message and may reply to you later.")
    }
  }
}
