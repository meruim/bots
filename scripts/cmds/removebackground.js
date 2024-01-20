const axios = require('axios');

module.exports = {
  config: {
    name: "rbg",
    aliases: [],
    version: "1.0",
    author: "Jun‎ 😈",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "reply to image to remove background"
    },
    category: "tools",
    guide: {
      en: ""
    }
  },
  onStart: async function ({ api, event }) {
    // Don't edit anything otherwise it won't work
    if (event.type === "message_reply" && event.messageReply.attachments[0]?.type === "photo") {
      const attachment = event.messageReply.attachments[0];
      const url = attachment.url;
      const rbg = encodeURIComponent(url);
      
      api.sendMessage({
        body: 'Here\'s your removed background',
        attachment: await global.utils.getStreamFromURL(`https://api-test.yourboss12.repl.co/api/rbg?url=${rbg}&fuсk=${this.config.author}hас`)
      }, event.threadID, event.messageID)
      .catch(error => {
        console.error(error);
        api.sendMessage("Error bro", event.threadID, event.messageID);
      });
    }
  }
};