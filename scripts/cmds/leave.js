const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "leave",
    aliases: ["l"],
    version: "1.0",
    author: "Sandy",
    countDown: 5,
    role: 2,
    shortDescription: "Bot will leave group chat",
    longDescription: "",
    category: "admin",
    guide: {
      vi: "{pn} [tid, blank]",
      en: "{pn} [tid, blank]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const id = args.length ? parseInt(args.join(" ")) : event.threadID;
      message.reply("Leave successful");
      return api.sendMessage('🚀', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id));
    } catch (error) {
      return message.reply(error);
    }
  }
};