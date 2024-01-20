const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "bard",
    version: "1.0",
    author: "aji-nomoto",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "",
    },
    longDescription: {
      vi: "",
      en: "",
    },
    category: "Bard",
  },
  onStart: async function () {},
  onChat: async function ({
    message,
    event,
    args,
    commandName,
    api,
    usersData,
  }) {
    const input = event.body;
    const userID = event.senderID;
    const data = await usersData.get(userID);
    const status = data.banned.status;
    const reason = data.banned.reason;
    const name = data.name;
    const author = this.config.author;
    let images = "";

    if (
      input &&
      (input.trim().toLowerCase().startsWith("bard") ||
        input.trim().toLowerCase().startsWith("google"))
    ) {
      if(event.threadID === '7239944279397137') return;
      if (status === true) {
        return message.reply(
          `⚠ | You have been banned from using the bot\n❍Reason: ${reason}\n❏Please contact the admin in this group to request for a compliment.`
        );
      }
      const inputData = input.split(" ");
      inputData.shift();
      const prompt = inputData.join(" ");

      if (!prompt) {
        const responses = [
    "Hello, how can I help you?",
    "What is your questions?",
    "Bard is listening."
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return message.reply(`${randomResponse}`);
      }
      const waitingQue = await message.reply("...");
      if (
        event.type === "message_reply" &&
        event.messageReply.attachments &&
        event.messageReply.attachments.length > 0 &&
        ["photo", "sticker"].includes(event.messageReply.attachments[0].type)
      ) {
        images = encodeURIComponent(event.messageReply.attachments[0].url);
      }

      try {
        const response = await axios.get(
          `https://aji.no-moto.repl.co/api/bard?uid=${encodeURIComponent(
            userID
          )}&prompt=${encodeURIComponent(prompt)}&name=${encodeURIComponent(
            name
          )}&attImg=${images}`
        );
        const result = response.data;
        let content = result.result;
        let attachment = [];
         if (response.status === 400) {
        return message.reply(`Error: ${response.data.error}`);
      }
        if (result.images && result.images.length > 0) {
          for (let url of result.images) {
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

        await message.reply(
          { body: content, attachment: attachment },
          async (err, info) => {
            await message.unsend((await waitingQue).messageID);
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID,
              name: name,
            });
          }
        );
      } catch (error) {
        console.error("Error:", error.message);
        api.sendMessage(`${error}`, event.threadID, event.messageID);
      }
    }
  },
  onReply: async function ({ message, event, Reply, args, api, usersData }) {
    let { author, commandName } = Reply;
    if (event.senderID != author) return;
    const userID = event.senderID;
    const data = await usersData.get(userID);
    const name = data.name;
    const prompt = args.join(" ");
    const authorName = name;

    try {
      api.setMessageReaction("🤖", event.messageID, event.threadID, api);
      const response = await axios.get(
        `https://aji.no-moto.repl.co/api/bard?uid=${encodeURIComponent(
          userID
        )}&prompt=${encodeURIComponent(prompt)}&name=${encodeURIComponent(
          authorName
        )}`
      );
      const result = response.data;

      if (result.status === 400) {
        return message.reply(`Error: ${result.error}`);
      }

      let content = result.result;
      let attachment = [];

      if (result.images && result.images.length > 0) {
        for (let url of result.images) {
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

      if (result.status === 400) {
        return message.reply(`Error: ${response.error}`);
      }

      message.reply({ body: content, attachment: attachment }, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID,
        });
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
};