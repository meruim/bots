const axios = require('axios');

module.exports = {
  config: {
    name: "brainly",
    aliases: ["brainly"],
    version: "1.0",
    author: "MILAN",
    countDown: 5,
    role: 0,
    shortDescription: "Ask anything",
    longDescription: "Ask anything",
    category: "ai",
    guide: {
      en: "{pn} ask"
    },
  },
  onStart: async function() {},
  onChat: async function ({ message, args, api, event }) {
        const input = event.body;
    if (input && input.trim().toLowerCase().startsWith('brainly')){
      const quest = input.split(" ");
      const songs = quest.shift();
      const question = quest.join(" ");
    const { threadID, messageID, body } = event;

    if (!question) {
      api.sendMessage("Please provide a question.", threadID, messageID);
      return;
    }

    try {
      api.sendMessage("Searching for an answer. Please wait...", threadID, messageID);
      const res = await axios.get(`https://testapi.heckerman06.repl.co/api/other/brainly?text=${encodeURIComponent(question)}`);
      const data = res.data;
      if (data.question && data.answer) {
        const response = `Answer:\n ${data.answer}`;
        api.sendMessage(response, threadID, messageID);
      } else {
        api.sendMessage("No answer found for the given question.", threadID, messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("Error occurred while fetching data from the Brainly API.", threadID, messageID);
    }
    }
  },  	
};