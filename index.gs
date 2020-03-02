function autoReplier() {
  var labelObj = GmailApp.getUserLabelByName('SMS');
  var labelObjUnreadCount = labelObj.getUnreadCount();
  var gmailThread;
    
  for (var i = 0; i < labelObjUnreadCount; i++) {
    gmailThread = labelObj.getThreads()[i];
    if(gmailThread.isUnread()) {
      gmailThread.reply("Hey, I received your message and may reply to you later.");
      gmailThread.markRead();
    }
  }
}