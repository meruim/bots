module.exports = {
  config: {
    name: "newgc",
    version: "1.0",
    author: "langit",
    role: 0,
    shortDescription: {
      en: "Adds the user to a specific thread."
    },
    longDescription: {
      en: "Adds the user to a specific thread and sends them a notification message."
    },
    category: "System",
    guide: {
      en: "Use {p}join to add yourself to the specified thread."
    }
  },
  onStart: async function ({ api, event, args }) {
    const threadID = "6472246432864351"; // ID of the thread to add the user to

    try {
      await api.addUserToGroup(event.senderID, threadID);
      api.sendMessage("You have been added to the group chat. Please wait for admin approval.", event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage("Failed to add you to the group chat. Wether you're already exist in group or waiting for approval.\n\nIf you think there's something wrong, please contact the administrator by typing:\n/cs [state your problem here]", event.threadID, event.messageID);
    }
  }
};