const { findUid } = global.utils;
const regExCheckURL = /^(http|https):\/\/[^ "]+$/;
const axios = require("axios");

async function fetchDataAndReply(uid, message) {
  try {
    const response = await axios.get(`https://aji.no-moto.repl.co/api/get?id=${uid}&prompt=getinfo`);
    const result = response.data.requestLeft;
    let replyMessage;

    if (result !== undefined) {
      if (result === 0) {
        replyMessage = "Access limit reached for users. Please wait for a reset.";
      } else if (result === 1) {
        replyMessage = "You have 1 access request left.";
      } else {
        replyMessage = `You have ${result} access requests left.`;
      }
    } else {
      replyMessage = "Sorry, we couldn't find information for this user.";
    }

    message.reply(replyMessage);

  } catch (error) {
    message.reply(`${error}`);
  }
}


module.exports = {
  config: {
    name: "utrl",
    version: "1.0",
    author: "ViLLAVER",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View uid"
    },
    longDescription: {
      en: "View facebook user id of user"
    },
    category: "info"
  },
  
  onStart: async function (){},
  onChat: async function ({ message, event, args, getLang }) {
    const input = event.body; 

    if (input && (input.trim().toLowerCase().startsWith('utrl') || input.trim().toLowerCase().startsWith('info'))) {
      const data = input.split(" ");
      data.shift();

      if (event.messageReply) {
        const uid = event.messageReply.senderID;
        fetchDataAndReply(uid, message);
        return;
      }

      if (!data[0]) {
        const uid = event.senderID;
        fetchDataAndReply(uid, message);
        return;
      }
      if (data[0].match(regExCheckURL)) {
        let msg = '';
        for (const link of args) {
          try {
            const uid = await findUid(link);
            msg += `${uid} `;
          } catch (e) {
            message.reply(msg += `${link} (ERROR) => ${e.message}\n`);
            return;
          }
        }
        fetchDataAndReply(msg, message);
        return;
      }

      let msg = "";
      const { mentions } = event;
      for (const id in mentions)
        msg += `${id}`;
      fetchDataAndReply(msg, message);
    }
  }
};