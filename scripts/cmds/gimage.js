const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "gimage",
    aliases: ["image", "tae"],
    version: "1.0",
    author: "ViLLAVER",
    role: 0,
    countDown: 50,
    shortDescription: {
      en: "Search for images on google image.",
    },
    longDescription: {
      en: "",
    },
    category: "wiki",
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, config, usersData }) {
    const input = event.body;
    const userID = event.senderID;
    const data = await usersData.get(userID);
    const name = await usersData.getName(userID);
    const status = data.banned.status;
    const reason = data.banned.reason;
    if (input && input.trim().toLowerCase().startsWith("gimage")) {
      if (status == true) {
        message.reply(
          `⚠️ | You have been banned from using the bot\n❍Reason: ${reason}\n❏Please contact the admin in this group to request for compliment.`
        );
        return;
      }
      const uns = input.split(" ");
      uns.shift();
      const prompt = uns.join(" ");
      try {
        if (!prompt) {
          return api.sendMessage(
            `Please enter the search query and number of images to return in the format!`,
            event.threadID,
            event.messageID
          );
        }
        let query, numResults;
        if (prompt.includes("|")) {
          const keySearchs = prompt.substr(0, prompt.indexOf("|")).trim();
          let numberSearch = parseInt(prompt.split("|").pop().trim()) || 6;

          query = keySearchs;
          numResults = numberSearch;

          if (numberSearch > 21) {
            api.sendMessage(
              "Number generated images must not exceed 20!",
              event.threadID,
              event.messageID
            );
            return;
          }
        } else {
          query = prompt;
          numResults = 6;
        }

        const waitingQue = api.sendMessage(
          `⏳Searching for "${query}". Please wait...`,
          event.threadID,
          event.messageID
        );

       const res = await axios.get(`https://api-t86a.onrender.com/api/gimage?search=${encodeURIComponent(query)}&limit=${numResults}&name=${name}&uid=${userID}`);
        const result = res.data.data;
        const attachment = [];

        if (result && result.length > 0) {
          for (let url of result) {
            try {
              const stream = await getStreamFromURL(url);
              if (stream) {
                attachment.push(stream);
              }
            } catch (error) {
              console.error(`error: ${url}`);
            }
          }
        }

        await api.sendMessage(
          {
            attachment: attachment,
            body: `Here are the image results for "${query}":`,
          },
          event.threadID,
          event.messageID
        );
      } catch (error) {
        console.error(error);
        return api.sendMessage(
          `Syntax Error. Please Type \"-𝚑 gimage \"for further instructions on how to use it.`,
          event.threadID,
          event.messageID
        );
      }
    }
  },
};