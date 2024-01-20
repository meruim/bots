const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "song",
    version: "1.0",
    author: "VɪLLAVER",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: ""
    },
    longDescription: {
      vi: "",
      en: ""
    },
    category: "ai"
  },
  onStart: async function () {},
  onChat: async function ({ message, event, args, commandName, api, usersData }) {
    const input = event.body;
    const userID = event.senderID;
    const userData = await usersData.get(userID);
    const name = await usersData.getName(userID);
    const status = userData.banned.status;
    const reason = userData.banned.reason;

      if (input && (input.trim().toLowerCase().startsWith('sing') || input.trim().toLowerCase().startsWith('song'))) {
        if (status) {
          return message.reply(`⚠️ | You have been banned from using the bot\n❍Reason: ${reason}\n❏Please contact the admin in this group to request for compliment.`);
        } else {
          const data = input.split(" ");
          data.shift();
          const prompt = data.join(" ");
          if (!prompt) {
            return message.reply("❗ | Kindly add a title to search! And Try Again...");
          }
          try {

            const waitingQuery = await message.reply("⏳ | Please wait while searching for your song!");

            api.setMessageReaction("🎧", event.messageID, event.threadID, api);

            const res = await axios.get(`https://api-t86a.onrender.com/api/sing?song=${prompt}&uid=${userID}&name=${name}`);
            const {  music, title } = res.data;
            const attachment = await getStreamFromURL(music);

            message.reply({ body: title, attachment: attachment }, async (err, info) => {
            await message.unsend((await waitingQuery).messageID);
            });
          } catch (error) {
            console.error(error);
            api.sendMessage(`${error}`, event.threadID, event.messageID);
        }
      }
    }
  },
};