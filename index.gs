var findRegex = /^"([\s|\S]*)"/
var replaceRegex = /[\s|\(|\)|-]/g

function autoReplier() {
  // var labelObj = GmailApp.getUserLabelByName('SMS');
  // var unreadCount = labelObj.getUnreadCount();
  // var threads = labelObj.getThreads();
  // var thread;

  //   for (var i = 0; i < unreadCount; i++) {
  //     thread = threads[i];
  //     if (thread.isUnread()) {
  //       thread.reply("Hey, I received your message and may reply to you later.");
  //       thread.markRead();
  //     }
  //   }
  // }

  // var from = threads[0].getMessages()[0].getFrom()
  // var number = from.match(regex)[1]
  // console.log(number)

  // console.log(ContactsApp.getContactsByAddress(number))
  console.log(ContactsApp.getContactsByPhone('8217568888'))
}