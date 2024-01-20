const axios = require("axios");

module.exports = {
  config: {
    name: "lyrics",
    author: "ViLLAVER",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: { en: "sends lyrics to chat" },
  },
  onStart() {},
  onChat: async function ({ api, event, args }) {
    const input = event.body;
    if (
      (input && input.trim().toLowerCase().startsWith("lyrics")) ||
      (input && input.trim().toLowerCase().startsWith("lyric"))
    ) {
      const datas = input.split(" ");
      datas.shift();
      const song = datas.join(" ");
      try {
        if (!song) {
          api.sendMessage(
            "Please provide a song name.",
            event.threadID,
            event.messageID
          );
          return;
        }
        const res = await axios.get(
          `https://aji.no-moto.repl.co/api/lyrics?song=${song}`
        );
        const { title, artist, lyrics, image } = res.data;
        const attachment = [await global.utils.getStreamFromURL(image)];
        const message = `🎵 | Title: ${title}\nBy: ${artist}\n\n\n${lyrics}`;
        api.setMessageReaction("🎧", event.messageID, event.messageID, api);
        api.sendMessage(
          "⏳| Searching for lyrics, please wait...",
          event.threadID,
          event.messageID
        );
        api.sendMessage(
          { attachment, body: message },
          event.threadID,
          event.messageID
        );
      } catch (error) {
        console.error(error);
        api.sendMessage("Error occurred.", event.threadID, event.messageID);
      }
    }
  },
};