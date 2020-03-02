function autoReplier() {
  var labelObj = GmailApp.getUserLabelByName('SMS');
  var unreadCount = labelObj.getUnreadCount();
  var threads = labelObj.getThreads();
  var thread;

  for (var i = 0; i < unreadCount; i++) {
    thread = threads[i];
    if (thread.isUnread()) {
      thread.reply("Hey, I received your message and may reply to you later.");
      thread.markRead();
    }
  }
}