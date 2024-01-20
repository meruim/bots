const axios = require('axios');

module.exports = {
  config: {
    name: "unsplash",
    author: "ChatGPT",
    version: "4.0",
    shortDescription: "Search for images using Unsplash API",
    longDescription: "Search for high-quality images using Unsplash API and return a specified number of results.",
    category: "utility",
    guide: {
      vi: "",
      en: ""
    }
  },
  onStart: async function () {},
  onChat: async function({ args, message, getLang, event, api }) {
    const input = event.body;
    if (input && input.trim().toLowerCase().startsWith('unsplash')){
      const uns = input.split(" ");
      const que = uns.shift();
      const text = uns.join(" ");
      if(!text){
        message.reply("Enter query.");
        return;
      }
      
      let query, numResults;
    if (text.includes("|")) {
      const [promptText, modelText] = text.split("|").map((str) => str.trim());
      
      query = promptText;
      numResults = modelText;
     
      if(numResults > 21) {
        api.sendMessage("Number generated images must not exceed 20!", event.threadID, event.messageID);
      return;
      }
    } else {
      query = text;
      numResults = 6;
    }
      api.sendMessage(`⏳Searching for "${query}". Please wait...`, event.threadID, event.messageID );
    try {
      const url = `https://api.unsplash.com/search/photos?page=1&per_page=${numResults}&query=${query}&client_id=oWmBq0kLICkR_5Sp7m5xcLTAdkNtEcRG7zrd55ZX6oQ`;

      const { data } = await axios.get(url);
      const results = data.results.map(result => result.urls.regular);

      const attachments = await Promise.all(results.map(url => global.utils.getStreamFromURL(url)));

      return message.reply({body: `Here are the top ${numResults} high-quality image results for "${query}" from Unsplash:`, attachment: attachments});
    } catch (error) {
      console.error(error);
      return message.reply("Sorry, I couldn't find any results.");
    }
    }
  },
};