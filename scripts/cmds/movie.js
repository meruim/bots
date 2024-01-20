const axios = require("axios");

module.exports = {
  config: {
    name: "movie",
    author: "ViLLAVER",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: { en: "Get Movie Info with download links." },
  },
  
  onStart: async ({ api, event, args }) => {
      const title = args.join(' ');
      if (!title) {
        api.sendMessage("Please a movie to search!.", event.threadID, event.messageID);
        return;
      }
      try {
        const res = await axios.get(`https://api.mangroveprotvillaver.repl.co/movies/?query=${title}`);
        const {  movie_image, result } = res.data;
        const attachment = [await global.utils.getStreamFromURL(movie_image)];
       
        api.setMessageReaction("🔍", event.messageID, event.messageID, api);
        
        api.sendMessage({ attachment, body: result }, event.threadID, event.messageID);
      } catch (error) {
        console.error(error);
        api.sendMessage("Error occurred.", event.threadID, event.messageID);
      }
  },
};