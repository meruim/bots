const fs = require('fs');

module.exports = {
  config: {
    name: "leaveall",
    aliases: ["approveonly"],
    version: "1.0",
    author: "OtinXSandip",
    countDown: 5,
    role: 2,
    shortDescription: "Leave all unapproved groups",
    longDescription: "Leave all unapproved groups except the current one.",
    category: "owner",
    guide: "{p}leaveall",
  },
  onStart: async function ({ api, event }) {
    try {
      const approveList = JSON.parse(fs.readFileSync('tid.json'));
      const threadList = await api.getThreadList(100, null, ["INBOX"]);
      const botUserID = api.getCurrentUserID();

      const unapprovedThreads = [];

      for (const threadInfo of threadList) {
        if (threadInfo.isGroup && threadInfo.threadID !== event.threadID && !approveList.includes(threadInfo.threadID)) {
          unapprovedThreads.push(threadInfo.name || threadInfo.threadID);
          await api.removeUserFromGroup(botUserID, threadInfo.threadID);
        }
      }

      if (unapprovedThreads.length > 0) {
        const unapprovedMessage = `Successfully left ${unapprovedThreads.length} unapproved groups.`;
        api.sendMessage(unapprovedMessage, event.threadID);
      } else {
        api.sendMessage("No unapproved groups to leave.", event.threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while leaving unapproved groups.", event.threadID);
    }
  },
};